import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from '../guards/auth.guard';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/entites/user.entity';

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private i18n: I18nService,
  ) {}

  @Get()
  async getProfile(@Req() request) {
    const user: User = request['user'];
    return await this.profileService.getProfile(user.id);
  }

  @Post()
  updateProfile(
    @Req() request,
    @Body(new ValidationPipe()) updateProfileDto: UpdateProfileDto,
  ) {
    const user: User = request['user'];
    return this.profileService.updateProfile(user.id, updateProfileDto);
  }

  @Post('change-password')
  async changePassword(
    @Req() request: any,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ) {
    const user: User = request['user'];
    return await this.profileService.changePassword(user.id, changePasswordDto);
  }

  @Post('update-language')
  async updateLanguage(
    @Req() request: any,
    @Body('language') language: string,
  ) {
    const user: User = request['user'];
    await this.profileService.updateLanguage(user.id, language);
    return {
      message: this.i18n.translate('main.messages.flash.language_change'),
    };
  }

  @Post('update-theme')
  async updateTheme(@Req() request: any, @Body('dark_mode') darkMode: boolean) {
    const user: User = request['user'];
    await this.profileService.updateTheme(user.id, darkMode);
    return {
      message: this.i18n.translate('main.messages.flash.theme_change'),
    };
  }
}
