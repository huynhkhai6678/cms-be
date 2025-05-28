import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateDoctorHolidayDto } from './dto/create-doctor-holiday.dto';
import { UpdateDoctorHolidayDto } from './dto/update-doctor-holiday.dto';
import { DoctorHoliday } from 'src/entites/doctor-holiday.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from '../entites/doctor.entity';
import { User } from '../entites/user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { HelperService } from '../helper/helper.service';
import * as moment from 'moment';

@UseGuards(AuthGuard, RoleGuardFactory('manage_doctors'))
@Injectable()
export class DoctorHolidaysService {
  constructor(
    @InjectRepository(DoctorHoliday) private doctorHolidayRepository: Repository<DoctorHoliday>,
    private helperService: HelperService
  ) {}
  
  async create(createDoctorHolidayDto: CreateDoctorHolidayDto) {
    const holiday = this.doctorHolidayRepository.create(createDoctorHolidayDto);
    holiday.date = moment(holiday.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    return await this.doctorHolidayRepository.save(holiday);
  }

  async findAll(query) {
    return await this.getPaginatedDoctorHoliday(query);
  }

  async findOne(id: number, clinic_id : number) {
    const data = await this.doctorHolidayRepository.findOneBy({id});
    const doctors = await this.helperService.clinicDoctor(clinic_id);

    return {
      data,
      doctors
    }
  }

  async update(id: number, updateDoctorHolidayDto: UpdateDoctorHolidayDto) {
    const doctorHoliday = await this.doctorHolidayRepository.findOneBy({ id });
    if (!doctorHoliday) throw new NotFoundException('Holiday not found');

    doctorHoliday.name = updateDoctorHolidayDto.name ?? '';
    doctorHoliday.date = moment(updateDoctorHolidayDto.date, 'DD/MM/YYYY').format('YYYY-MM-DD') ?? '';
    doctorHoliday.clinic_id = updateDoctorHolidayDto.clinic_id ?? 1;
    doctorHoliday.doctor_id = updateDoctorHolidayDto.doctor_id ?? 1;
    return await this.doctorHolidayRepository.save(doctorHoliday);
  }

  async remove(id: number) {
    const doctorHoliday = await this.doctorHolidayRepository.findOneBy({ id });
    if (!doctorHoliday) throw new NotFoundException('Holiday not found');

    await this.doctorHolidayRepository.remove(doctorHoliday);
  }

  async getPaginatedDoctorHoliday(query: any) {
    const take = !isNaN(Number(query.limit)) && Number(query.limit) > 0 ? Number(query.limit) : 10;
    const page = !isNaN(Number(query.page)) && Number(query.page) > 0 ? Number(query.page) : 1;
    const skip = (page - 1) * take;
    const qb = this.doctorHolidayRepository.createQueryBuilder('doctor_holiday');

    // Join user with user_clinics
    qb.leftJoinAndMapOne(
      'doctor_holiday.doctor',
      Doctor,
      'doctor',
      'doctor_holiday.doctor_id = doctor.id',
    );

    qb.leftJoinAndMapOne(
      'doctor.user',
      User,
      'user',
      'doctor.user_id = user.id',
    );

    qb.select([
      'doctor_holiday.id',
      'doctor_holiday.date',
      'doctor_holiday.name',
      'doctor.id',
      `CONCAT(user.first_name, ' ', user.last_name) as full_name`
    ]);

    qb.distinct(true);
    

    // Search functionality
    if (query.search) {
      qb.andWhere(
        `CONCAT(user.first_name, ' ', user.last_name) LIKE :search OR doctor_holiday.name LIKE :search OR doctor_holiday.date LIKE :search`, // Search on concatenated full_name
        { search: `%${query.search}%` },
      );
    }

    // Filter by clinic_id (user_clinics.clinic_id)
    if (query.clinic_id) {
      qb.andWhere('doctor_holiday.clinic_id = :clinic_id', { clinic_id: query.clinic_id });
    }

    const orderableFieldsMap = {
      full_name: "CONCAT(user.first_name, ' ', user.last_name)",
      name: "doctor_holiday.name",
      date: "doctor_holiday.date",
    };

    const orderByField =
      query.orderBy && orderableFieldsMap[query.orderBy]
        ? orderableFieldsMap[query.orderBy]
        : 'doctor_holiday.id';

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
