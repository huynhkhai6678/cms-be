import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entites/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../entites/role.entity';
import { UserClinic } from '../entites/user-clinic.entity';
import { UserRole } from 'src/constants/user.constant';
import { I18nService } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Setting } from '../entites/setting.entity';
import { Currency } from 'src/entites/currency.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Setting) private settingRepository: Repository<Setting>,
    @InjectRepository(Currency) private currencyRepository: Repository<Currency>,
    @InjectRepository(UserClinic)
    private readonly userClinicRepo: Repository<UserClinic>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailerService: MailerService,
    private readonly i18n : I18nService
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const currentUser = await this.userRepository.findOneBy({ email });
    if (!currentUser) {
      throw new BadRequestException(this.i18n.translate('main.messages.flash.current_invalid'));
    }

    const isMatch = await bcrypt.compare(password, currentUser.password);
    if (!isMatch) {
      throw new BadRequestException(this.i18n.translate('main.messages.flash.current_invalid'));
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

  async forgotPassword(email: string): Promise<any> {
    const currentUser = await this.userRepository.findOneBy({ email });
    if (!currentUser) {
      throw new BadRequestException(this.i18n.translate('main.messages.flash.current_invalid'));
    }

    const token = this.jwtService.sign({ sub: currentUser.id }, { expiresIn: '1h' });
    
    const webUrl = this.config.get<string>('WEB_URL');
    const resetLink = `${webUrl}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: "trabidao6678@gmail.com",
      subject: 'Reset Password',
      template: 'reset-password',
      context: { resetLink },
    });

    return {
      message : this.i18n.translate('main.messages.flash.email_send')
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<any> {
    const { token, password } = dto;

    let userId: number;
    try {
      const payload = await this.jwtService.verifyAsync(token);
      userId = payload.sub;
    } catch (error) {
      throw new BadRequestException('Invalid or expired token.');
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);

    return { message: 'Password reset successfully.' };
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

  async getClinics(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['clinics'],
    });

    const clinics = user?.clinics || [];
    for (const clinic of clinics) {
      const settingCurrency = await this.settingRepository.findOneBy({ clinic_id: clinic.id, key: 'currency' });
      if (settingCurrency) {
        const currency = await this.currencyRepository.findOneBy({ id : parseInt(settingCurrency.value)});
        clinic.currency = currency;
      }
    }

    return {
      data: clinics,
    };
  }

  async isUserInClinic(user: User, clinicId: number) {
    const type = user.type;
    if (type === UserRole.PATIENT) {
      return user.clinic_id === clinicId;
    }

    const matches = await this.userClinicRepo.count({
      where: { user_id: user.id, clinic_id: clinicId },
    });

    return matches > 0;
  }

  async verifySocketToken(token: string) {
    try {
     const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      
      return payload.id;
    } catch {
      return null;
    }
  }
}
