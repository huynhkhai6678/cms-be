import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entites/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../entites/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const currentUser = await this.userRepository.findOneBy({ email });

    console.log(currentUser);
    if (!currentUser) {
      throw new BadRequestException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, currentUser.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const role = await this.roleRepository.findOne({
      where: {
        id: currentUser.type,
      },
      relations: {
        permissions: true,
      },
    });

    const data = {
      id: currentUser.id.toString(),
      email: currentUser.email,
      name: currentUser.first_name + ' ' + currentUser.last_name,
      contact: currentUser.contact,
      region_code: currentUser.region_code,
      type: currentUser.type?.toString(),
      dark_mode: currentUser.dark_mode,
      clinic_id: currentUser.clinic_id.toString(),
      language: currentUser.language,
    };

    const token = await this.jwtService.signAsync(data);
    return {
      token,
      data,
      permissions: role?.permissions.map((p) => p.name),
    };
  }

  async findWithRole(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        role: {
          permissions: true,
        },
      },
    });
  }
}
