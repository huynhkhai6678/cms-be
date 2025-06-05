import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSmartPatientCardDto } from './dto/create-smart-patient-card.dto';
import { UpdateSmartPatientCardDto } from './dto/update-smart-patient-card.dto';
import { DatabaseService } from '../shared/database/database.service';
import { InjectRepository } from '@nestjs/typeorm';
import { SmartPatientCard } from '../entites/smart-patient-card.entity';
import { In, Repository } from 'typeorm';
import { Setting } from '../entites/setting.entity';
import { Patient } from '../entites/patient.entity';
import { User } from '../entites/user.entity';
import { HelperService } from '../helper/helper.service';
import { CreatePatientSmartPatientCardDto } from './dto/create-patient-smart-patient-card.dto';
import { Address } from '../entites/address.entity';
import { PdfService } from '../shared/pdf/pdf.service';
import { join } from 'path';
import * as ejs from 'ejs';
import { City } from 'src/entites/city.entity';
import { State } from 'src/entites/state.entity';
import { Country } from 'src/entites/country.entity';

@Injectable()
export class SmartPatientCardsService {
  constructor(
    @InjectRepository(SmartPatientCard)
    private readonly smartCardRepo: Repository<SmartPatientCard>,
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>,
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,
    @InjectRepository(State)
    private readonly stateRepo: Repository<State>,
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
    private helperService : HelperService,
    private pdfService: PdfService,
    private database: DatabaseService,
  ) {}

  async create(createSmartPatientCardDto: CreateSmartPatientCardDto) {
    const card = this.smartCardRepo.create(createSmartPatientCardDto);
    return await this.smartCardRepo.save(card);
  }

  async findAll(query) {
    return await this.database.paginateAndSearch<SmartPatientCard>({
      repository: this.smartCardRepo,
      alias: 'smart_patient_card',
      query: {
        ...query,
      },
      searchFields: ['template_name'],
      filterFields: ['clinic_id'],
      allowedOrderFields: ['template_name', 'email_show', 'phone_show', 'dob_show', 'blood_group_show', 'address_show', 'show_patient_unique_id'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields: [],
      relations: [],
    });
  }

  async findPatientCard(query) {
    const take = !isNaN(Number(query.limit)) && Number(query.limit) > 0 ? Number(query.limit) : 10;
    const page = !isNaN(Number(query.page)) && Number(query.page) > 0 ? Number(query.page) : 1;
    const skip = (page - 1) * take;

    const qb = this.patientRepo.createQueryBuilder('patient');

    // Join doctor with user
    qb.leftJoinAndMapOne(
      'patient.user',
      User,
      'user',
      'patient.user_id = user.id',
    );

    // Join user with user_clinics
    qb.leftJoinAndMapOne(
      'patient.smart_patient_card',
      SmartPatientCard,
      'template',
      'patient.template_id = template.id',
    );

    qb.select([
      'patient.id as patient_id',
      'user.id as user_id',
      'user.email as patient_email',
      'user.image_url as image_url',
      'patient.patient_mrn as patient_mrn',
      'patient.patient_unique_id as patient_unique_id',
      'template.template_name as template_name',
      `CONCAT(user.first_name, ' ', user.last_name) as full_name`,
    ]);

    // Search functionality
    if (query.search) {
      qb.andWhere(
        `CONCAT(user.first_name, ' ', user.last_name) LIKE :search OR patient_unique_id LIKE :search OR template_name  LIKE :search`,
        { search: `%${query.search}%` },
      );
    }

    if (query.clinic_id) {
      qb.andWhere('user.clinic_id = :clinic_id', { clinic_id: query.clinic_id });
    }

    qb.andWhere('patient.template_id IS NOT NULL');

    // Order by logic (can also order by concatenated full_name)
    const orderableFieldsMap = {
      full_name: "CONCAT(user.first_name, ' ', user.last_name)",
      patient_unique_id: "patient.patient_unique_id",
      template_name: "template.template_name",
    };

    const orderByField =
      query.orderBy && orderableFieldsMap[query.orderBy]
        ? orderableFieldsMap[query.orderBy]
        : 'patient.id';

    const orderDirection =
      query.order && ['ASC', 'DESC'].includes(query.order.toUpperCase())
        ? query.order.toUpperCase()
        : 'DESC';

    qb.orderBy(orderByField, orderDirection as 'ASC' | 'DESC');

    // Apply pagination
    qb.skip(skip).take(take);

    // Fetch the results and total count
    const data = await qb.getRawMany();
    const total = await qb.getCount();
    
    return {
      data,
      pagination: {
        page,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async findOne(id: number, clinicId : number) {
    const smartPatientCard = await this.smartCardRepo.findOneBy({id});
    const settings = await this.settingRepo.find({
      where : {
        clinic_id : clinicId,
        key : In(['clinic_name', 'address_one', 'logo']) 
      },
      select : ['value']
    });

    return {
      data : smartPatientCard,
      clinic_name : settings[0]?.value || '',
      address_one : settings[1]?.value || '',
      logo : settings[2]?.value || '',
    }
  }

  async generatePatientCard(clinicId: number) {
    const templates = await this.templateByClinic(clinicId);
    const patients = await this.helperService.clinicPatient(clinicId);

    return {
      templates,
      patients
    }
  }

  async templateByClinic(clinicId: number) {
    const templates = await this.smartCardRepo.findBy({clinic_id : clinicId});
    return templates.map(template => { return {label:template.template_name, value: template.id}});
  }

  async createPatientCard(createPatientSmartPatientCardDto : CreatePatientSmartPatientCardDto) {
    if (createPatientSmartPatientCardDto.type === 1) {
      const query = `
        UPDATE patients AS \`patient\`
        INNER JOIN \`users\` AS \`user\` ON \`user\`.\`id\` = \`patient\`.\`user_id\`
        SET \`template_id\` = ?, \`patient\`.\`updated_at\` = CURRENT_TIMESTAMP
        WHERE \`user\`.\`clinic_id\` = ?
      `;

      const result = await this.patientRepo.query(query, [
        createPatientSmartPatientCardDto.template_id, 
        createPatientSmartPatientCardDto.clinic_id
      ]);
    }

    if (createPatientSmartPatientCardDto.type === 2 && createPatientSmartPatientCardDto.patient_id) {
      const patient = await this.patientRepo.findOneBy({id: createPatientSmartPatientCardDto.patient_id});
      if (!patient) {
        throw new NotFoundException('Patient not found');
      }
      patient.template_id = createPatientSmartPatientCardDto.template_id;
      await this.patientRepo.save(patient);
    }

    if (createPatientSmartPatientCardDto.type === 3) { 
      const query = `
        UPDATE patients AS \`patient\`
        INNER JOIN \`users\` AS \`user\` ON \`user\`.\`id\` = \`patient\`.\`user_id\`
        SET \`template_id\` = ?, \`patient\`.\`updated_at\` = CURRENT_TIMESTAMP
        WHERE \`template_id\` IS NULL
        AND \`user\`.\`clinic_id\` = ?
      `;

      const result = await this.patientRepo.query(query, [
        createPatientSmartPatientCardDto.template_id, 
        createPatientSmartPatientCardDto.clinic_id
      ]);
    }

    return true;
  }

  async update(id: number, updateSmartPatientCardDto: UpdateSmartPatientCardDto) {
    const card = await this.smartCardRepo.findOneBy({id});
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    Object.assign(card, updateSmartPatientCardDto);
    return await this.smartCardRepo.save(card);
  }

  async updateEntity(id : number, body : any) {
    const { column, value } = body;
    const card = await this.smartCardRepo.findOneBy({id});
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    
    card[column] = value;
    this.smartCardRepo.save(card);
    return true;
  }

  async remove(id: number) {
    const card = await this.smartCardRepo.findOneBy({id});
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return await this.smartCardRepo.remove(card);
  }

  async removePatientCard(id : number) {
    const patient = await this.patientRepo.findOneBy({id});
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    patient.template_id = null;
    return await this.patientRepo.save(patient);
  }

  async showPatientCard(id : number) {
    const patient = await this.patientRepo.findOne({
      where : {
        id
      },
      relations : ['smart_patient_card', 'user']
    });

    if (!patient || !patient.user) {
      throw new NotFoundException('Patient not found');
    }

    const settings = await this.settingRepo.find({
      where : {
        clinic_id : patient.user.clinic_id,
        key : In(['clinic_name', 'address_one', 'logo']) 
      },
      select : ['value']
    });

    const addrress = await this.addressRepo.findOne({
      where: {
        owner_id: patient.id,
        owner_type: 'App\\Models\\Patient',
      },
    });

    return {
      data : patient,
      patient_address: addrress?.address1,
      clinic_name : settings[0]?.value || '',
      address_one : settings[1]?.value || '',
      logo : settings[2]?.value || '',
    }
  }

  async export(id : number) {
    const templatePath = join(__dirname, '..', 'templates', 'patient-card.ejs');
    const data = await this.getSmartPatientData(id);
    const setting = await this.getSettingData(data.user.clinic_id);
    const city = await this.cityRepo.findOneBy({id: setting['city_id']});
    const country = await this.countryRepo.findOneBy({id: setting['country_id']});
    const state = await this.stateRepo.findOneBy({id: setting['state_id']});

    const htmlContent = await ejs.renderFile(templatePath, {
      city: city?.name ?? '',
      state: state?.name ?? '',
      country: country?.name ?? '',
      setting: setting,
      datas: data,
      assetsPath: `${process.env.API_URL}/public`,
      base64QrCode: 'base64_encoded_qr_code',
    });

    const pdfBuffer = await this.pdfService.createPdfFromHtml(htmlContent);
    return pdfBuffer;
  }

  async getSmartPatientData(id : number) {
    const patient = await this.patientRepo.findOne({
      where : {
        id
      },
      relations : ['smart_patient_card', 'user']
    });

    if (!patient || !patient.user) {
      throw new NotFoundException('Patient not found');
    }

    const addrress = await this.addressRepo.findOne({
      where: {
        owner_id: patient.id,
        owner_type: 'App\\Models\\Patient',
      },
    });

    patient.address = addrress;
    return patient;
  }

  async getSettingData(id : number) {
    const settings = await this.settingRepo.find({
      where : {
        clinic_id : id,
        key : In(['clinic_name', 'address_one', 'logo', 'address_two', 'country_id', 'state_id', 'city_id']) 
      },
    });

    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  }
}
