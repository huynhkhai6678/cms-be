import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from '../entites/doctor.entity';
import { In, Repository } from 'typeorm';
import { User } from '../entites/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialization } from '../entites/specilization.entity';
import { Address } from '../entites/address.entity';
import { UserClinic } from '../entites/user-clinic.entity';
import { Review } from '../entites/review.entity';
import { hashPassword } from 'src/utils/hash.util';
import { Clinic } from '../entites/clinic.entity';

@Injectable()
export class DoctorsService {
   constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Specialization)
    private readonly specialRepository: Repository<Specialization>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto, imageUrl : string) {
    // Create user
    const hashed = await hashPassword(createDoctorDto.password);
    const clinicIds = createDoctorDto.clinic_ids.split(',');

    const userDto = new User();
    userDto.first_name = createDoctorDto.first_name;
    userDto.last_name = createDoctorDto.last_name;
    userDto.contact = createDoctorDto.contact;
    userDto.region_code = createDoctorDto.region_code;
    userDto.email = createDoctorDto.email;
    userDto.dob = createDoctorDto.dob;
    userDto.gender = createDoctorDto.gender;
    userDto.status = createDoctorDto.status ? 1 : 0;
    userDto.clinic_id = parseInt(clinicIds[0]);
    userDto.type = 2;
    userDto.password = hashed;

    if (imageUrl) {
      userDto.image_url = imageUrl;
    }
    const clinics = await this.clinicRepository.findBy({
      id: In([clinicIds]),
    });
    userDto.clinics = clinics;
    const user = await this.userRepository.save(userDto);

    // Create address
    const addressDto = new Address();
    addressDto.owner_id = user.id;
    addressDto.owner_type = 'App\\Models\\Doctor';
    await this.addressRepository.save(addressDto);

    // Create doctor
    const doctorDto = new Doctor();
    doctorDto.user_id = user.id;
    doctorDto.experience = createDoctorDto.experience;

    const ids = createDoctorDto.specialization_ids.split(',');
    const specializations = await this.specialRepository.findBy({
      id: In(ids),
    });
    doctorDto.specializations = specializations;
    await this.doctorRepository.save(doctorDto);
    return true;
  }

  async findAll(query) {
    return await this.getPaginatedDoctors(query);
  }

  async findOne(id: number, clinic_id : number) {
    const doctor = await this.doctorRepository.findOne({ 
      where : {
        id
      },
      relations : ['user', 'specializations', 'user.clinics']
    });
    const specializations = await this.specialRepository.findBy({clinic_id});

    return {
      data : {
        clinic_id: doctor?.user.clinic_id,
        first_name: doctor?.user.first_name,
        last_name: doctor?.user.last_name,
        email: doctor?.user.last_name,
        phone: doctor?.user.contact,
        dob: doctor?.user.dob,
        gender: doctor?.user.gender,
        status: doctor?.user.status,
        specialization_ids: doctor?.specializations.map(specialization => { return specialization.id}),
        clinic_ids : doctor?.user.clinics.map(clinic => { return clinic.id}),
        experience: doctor?.experience,
      },
      specializations : specializations.map(specialization => { return {value: specialization.id, label: specialization.name}})
    }
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto, image_url) {
    const doctor = await this.doctorRepository.findOne({
      where : {
        id
      },
      relations : ['specializations']
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Update doctor
    const ids = updateDoctorDto.specialization_ids?.split(',') || [];
    const specializations = await this.specialRepository.findBy({
      id: In(ids),
    });

    doctor.experience = updateDoctorDto.experience;
    doctor.specializations = specializations;
    await this.doctorRepository.save(doctor);

    // Update user
    const user = await this.userRepository.findOne({
      where : {
        id : doctor.user_id
      },
      relations : ['clinics']
    });

    if (user) {
      const clinicIds = updateDoctorDto.clinic_ids?.split(',') || [];
      const clinics = await this.clinicRepository.findBy({
        id: In([clinicIds]),
      });

      user.first_name = updateDoctorDto.first_name || '';
      user.last_name = updateDoctorDto.last_name || '';
      user.contact = updateDoctorDto.contact || '';
      user.region_code = updateDoctorDto.region_code || '';
      user.email = updateDoctorDto.email || '';
      user.dob = updateDoctorDto.dob || '';
      user.gender = updateDoctorDto.gender;
      user.status = updateDoctorDto.status ? 1 : 0;
      user.clinic_id = parseInt(clinicIds[0]);
      user.clinics = clinics;
      await this.userRepository.save(user);
    }
    return true;
  }

  async remove(id: number) {
    const doctor = await this.doctorRepository.findOne({
      where : {
        id
      },
      relations : ['specializations']
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    } else {
      await this.doctorRepository.remove(doctor);
    }

    const user = await this.userRepository.findOneBy({
      id : doctor.user_id
    });

    if (user) {
      await this.userRepository.remove(user);
    }

    const addrress = await this.addressRepository.findOne({
      where: {
        owner_id: doctor.id,
        owner_type: 'App\\Models\\Doctor',
      },
    });

    if (addrress) {
      await this.addressRepository.remove(addrress);
    }
  }

  async getPaginatedDoctors(query: any) {
    const take = !isNaN(Number(query.limit)) && Number(query.limit) > 0 ? Number(query.limit) : 10;
    const page = !isNaN(Number(query.page)) && Number(query.page) > 0 ? Number(query.page) : 1;
    const skip = (page - 1) * take;

    const qb = this.doctorRepository.createQueryBuilder('doctor');

    // Join doctor with user
    qb.leftJoinAndMapOne(
      'doctor.user',
      User,
      'user',
      'doctor.user_id = user.id',
    );

    // Join user with user_clinics
    qb.leftJoinAndMapMany(
      'user.user_clinics',
      UserClinic,
      'userClinic',
      'user.id = userClinic.user_id',
    );

    // Join reviews table
    qb.leftJoinAndMapMany(
      'doctor.reviews',
      Review,
      'review',
      'review.doctor_id = doctor.id', // Join reviews with doctor using doctor_id
    );

    qb.select([
      'doctor.id',
      'user.id',
      'user.first_name',
      'user.last_name',
      'user.email',
      'user.created_at',
      'user.status',
      'user.email_verified_at',
      `CONCAT(user.first_name, ' ', user.last_name) as full_name`,
      `ROUND(COALESCE(AVG(review.rating), 0), 1) as avg_review`
    ]);

    qb.groupBy('doctor.id');

    // Search functionality
    if (query.search) {
      qb.andWhere(
        `CONCAT(user.first_name, ' ', user.last_name) LIKE :search`, // Search on concatenated full_name
        { search: `%${query.search}%` },
      );
    }

    // Filter by clinic_id (user_clinics.clinic_id)
    if (query.clinic_id) {
      qb.andWhere('userClinic.clinic_id = :clinic_id', { clinic_id: query.clinic_id });
    }

    // Filter by user status
    if (query.status) {
      qb.andWhere('user.status = :status', { status: query.status });
    }

    // Order by logic (can also order by concatenated full_name)
    const orderableFieldsMap = {
      full_name: "CONCAT(user.first_name, ' ', user.last_name)",
      status: "user.status",
      email_verified_at: "user.email_verified_at",
    };

    const orderByField =
      query.orderBy && orderableFieldsMap[query.orderBy]
        ? orderableFieldsMap[query.orderBy]
        : 'doctor.id'; // Default to doctor.id if no valid orderBy is provided

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

}
