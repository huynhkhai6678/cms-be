import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DatabaseService } from '../shared/database/database.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entites/role.entity';
import { In, Repository } from 'typeorm';
import { Permission } from '../entites/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private database: DatabaseService,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.roleRepository.findOne({
      where: {
        display_name: createRoleDto.display_name,
      },
    });

    if (role) {
      return false;
    }

    let roleDto = new Role();
    roleDto.name = createRoleDto.display_name;
    roleDto.display_name = createRoleDto.display_name;

    const permissions = await this.permissionRepository.findBy({
      id: In(createRoleDto.permission_ids),
    });

    roleDto.permissions = permissions;
    return await this.roleRepository.save(roleDto);
  }

  async findAll(query) {
    return await this.database.paginateAndSearch<Role>({
      repository: this.roleRepository,
      alias: 'role',
      query: query,
      searchFields: ['name', 'display_name'],
      filterFields: ['clinic_id', 'is_default'],
      allowedOrderFields: ['name', 'created_at'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields : [],
      relations: ['permissions'],
    });
  }

  async findOne(id: number) {
    const leftList = [
      'manage_front_cms',
      'manage_settings',
      'manage_specialities',
      'manage_doctors',
      'manage_staff',
      'manage_doctors_holiday',
      'manage_doctor_sessions',
    ];

    const rightList = [
      'manage_admin_dashboard',
      'manage_appointments',
      'manage_patients',
      'manage_patient_visits',
      'manage_transactions',
      'manage_medicines',
      'manage_clinic_service',
      'manage_report',
    ];

    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
      relations: {
        permissions: true,
      },
    });
    const permissions = await this.permissionRepository.find();

    return {
      data: role,
      left_list: permissions.filter((permission) => {
        return leftList.includes(permission.name);
      }),
      right_list: permissions.filter((permission) => {
        return rightList.includes(permission.name);
      }),
    };
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) throw new NotFoundException('Role not found');

    const newPermissions = await this.permissionRepository.findBy({
      id: In(updateRoleDto.permission_ids ?? []),
    });

    role.permissions = newPermissions;
    return this.roleRepository.save(role);
  }

  async remove(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'], // load related permissions
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.roleRepository.remove(role);
  }
}
