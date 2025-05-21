import { Controller, Get, Post, Body, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from '../guards/auth.guard';
import { I18nService } from 'nestjs-i18n';

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService, private i18n: I18nService) {}

  @Get()
  getProfile(@Req() request) {
    const user = request['user'];
    return this.profileService.getProfile(user.id);
  }

  @Post()
  updateProfile(@Req() request, @Body(new ValidationPipe()) updateProfileDto: UpdateProfileDto) {
    const user = request['user'];
    return this.profileService.updateProfile(user.id, updateProfileDto);
  }

  @Post('change-password')
  changePassword(@Req() request, @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto) {
    const user = request['user'];
    return this.profileService.changePassword(user.id, changePasswordDto);
  }

  @Post('update-language')
  async updateLanguage(@Req() request, @Body('language') language: string) {
    const user = request['user'];
    this.profileService.updateLanguage(user.id, language);
    return {
      message: await this.i18n.t('main.messages.flash.language_change'),
    };
  }

  @Post('update-theme')
  async updateTheme(@Req() request, @Body('dark_mode') darkMode: boolean) {
    const user = request['user'];
    this.profileService.updateTheme(user.id, darkMode);
    return {
      message: await this.i18n.t('main.messages.flash.theme_change'),
    };
  }
}
