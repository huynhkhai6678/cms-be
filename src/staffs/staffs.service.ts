import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, In, Not, Repository } from 'typeorm';
import { Clinic } from '../entites/clinic.entity';
import { User } from '../entites/user.entity';
import { Address } from '../entites/address.entity';
import { UserClinic } from '../entites/user-clinic.entity';
import { UserRole } from '../constants/user.constant';
import { Role } from '../entites/role.entity';
import { hashPassword } from '../utils/hash.util';
import { FileService } from 'src/shared/file/file.service';

@Injectable()
export class StaffsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Clinic) private clinicRepo: Repository<Clinic>,
    @InjectRepository(Address) private addressRepo: Repository<Address>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    private fileService: FileService
  ) {}

  async create(createStaffDto: CreateStaffDto, imageUrl : string) {
    // Create user
    const hashed = await hashPassword(createStaffDto.password);
    const clinicIds = createStaffDto.clinic_ids.split(',');

    const userDto = new User();
    userDto.first_name = createStaffDto.first_name;
    userDto.last_name = createStaffDto.last_name;
    userDto.contact = createStaffDto.contact;
    userDto.region_code = createStaffDto.region_code;
    userDto.email = createStaffDto.email;
    userDto.gender = createStaffDto.gender;
    userDto.status = 1;
    userDto.clinic_id = parseInt(clinicIds[0]);
    userDto.type = createStaffDto.type;
    userDto.password = hashed;

    if (imageUrl) {
      userDto.image_url = imageUrl;
    }
    const clinics = await this.clinicRepo.findBy({
      id: In([clinicIds]),
    });
    userDto.clinics = clinics;
    const user = await this.userRepository.save(userDto);

    // Create address
    const addressDto = new Address();
    addressDto.owner_id = user.id;
    addressDto.owner_type = 'App\\Models\\User';
    await this.addressRepo.save(addressDto);
  }

  async findAll(query) {
    return await this.getPaginatedStaffs(query);
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ 
      where : {
        id
      },
      relations : ['clinics']
    });

    const roles = await this.roleRepo.find({
      where : {
        is_default : Not(In([1, 2]))
      }
    });

    return {
      data : {
        clinic_id: user?.clinic_id,
        first_name: user?.first_name,
        last_name: user?.last_name,
        email: user?.email,
        contact: user?.contact,
        gender: user?.gender,
        type: user?.type,
        clinic_ids : user?.clinics.map(clinic => { return clinic.id}),
      },
      roles : roles.map(role => { return {value: role.id, label: role.display_name}})
    }
  }

  async update(id: number, updateStaffDto: UpdateStaffDto, imageUrl : string) {

    // Update user
    const user = await this.userRepository.findOne({
      where : {
        id
      },
      relations : ['clinics']
    });

    if (user) {
      const clinicIds = updateStaffDto.clinic_ids?.split(',') || [];
      const clinics = await this.clinicRepo.findBy({
        id: In([clinicIds]),
      });

      user.first_name = updateStaffDto.first_name || '';
      user.last_name = updateStaffDto.last_name || '';
      user.contact = updateStaffDto.contact || '';
      user.region_code = updateStaffDto.region_code || '';
      user.email = updateStaffDto.email || '';
      user.gender = updateStaffDto.gender;
      user.type = updateStaffDto.type;
      user.clinic_id = parseInt(clinicIds[0]);
      user.clinics = clinics;

      if (imageUrl) {
        user.image_url = imageUrl;
      }

      await this.userRepository.save(user);
    }
    return true;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({
      id
    });
    if (user) {
      if (user.image_url) {
        await this.fileService.deleteFile(user.image_url);
      }
      await this.userRepository.remove(user);
    }

    const addrress = await this.addressRepo.findOne({
      where: {
        owner_id: id,
        owner_type: 'App\\Models\\Doctor',
      },
    });
    if (addrress) {
      await this.addressRepo.remove(addrress);
    }

  }

  async getPaginatedStaffs(query: any) {
    const take = !isNaN(Number(query.limit)) && Number(query.limit) > 0 ? Number(query.limit) : 10;
    const page = !isNaN(Number(query.page)) && Number(query.page) > 0 ? Number(query.page) : 1;
    const skip = (page - 1) * take;
    const qb = this.userRepository.createQueryBuilder('user');

    // Join user with user_clinics
    qb.leftJoinAndMapMany(
      'user.user_clinics',
      UserClinic,
      'userClinic',
      'user.id = userClinic.user_id',
    );

    qb.leftJoinAndMapOne(
      'user.role',
      Role,
      'role',
      'user.type = role.id',
    );

    qb.select([
      'user.id',
      'user.first_name',
      'user.last_name',
      'user.type',
      'user.email',
      'user.email_verified_at',
      'role.display_name',
      `CONCAT(user.first_name, ' ', user.last_name) as full_name`
    ]);

    qb.distinct(true);

    // Search functionality
    if (query.search) {
      qb.andWhere(
        `CONCAT(user.first_name, ' ', user.last_name) LIKE :search`, // Search on concatenated full_name
        { search: `%${query.search}%` },
      );
    }

    if (query.clinic_id) {
      qb.andWhere('userClinic.clinic_id = :clinic_id', { clinic_id: query.clinic_id });
    }

    qb.andWhere(
        `user.type NOT IN (:types)`, // Search on concatenated full_name
        { types: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT] },
      );

    const orderableFieldsMap = {
      full_name: "CONCAT(user.first_name, ' ', user.last_name)",
      email_verified_at: "user.email_verified_at",
    };

    const orderByField =
      query.orderBy && orderableFieldsMap[query.orderBy]
        ? orderableFieldsMap[query.orderBy]
        : 'user.id';

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

  async findDetail(id) {
    const user = await this.userRepository.findOne({
      where : {
        id,
      },
      relations : ['role', 'role.permissions']
    });

    if (!user) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }
    
    return {
      data : {
        name : `${user.first_name} ${user.last_name}`,
        email : user.email,
        contact : `+${user.region_code} ${user.contact}`,
        image_url : user.image_url,
        gender : user.gender,
        register_on : user.created_at,
        last_update : user.updated_at,
        role : user.role,
      }
    }
  }
}
