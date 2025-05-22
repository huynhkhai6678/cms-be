import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateGenralDto } from './dto/update-general-setting.dto';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { AuthGuard } from '../guards/auth.guard';
import { UpdateContactInformationDto } from './dto/update-contact-information-setting.dto';
import { I18nService } from 'nestjs-i18n';

@UseGuards(AuthGuard, RoleGuardFactory('manage_settings'))
@Controller('settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private i18n: I18nService,
  ) {}

  @Get('general/:id')
  findGeneralSetting(@Param('id') id: string) {
    return this.settingsService.findGeneralSetting(+id);
  }

  @Get('contact-information/:id')
  findContactInformation(@Param('id') id: string) {
    return this.settingsService.findContactInformation(+id);
  }

  @Post('general/:id')
  async updateGeneralSetting(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateSettingDto: UpdateGenralDto,
  ) {
    this.settingsService.updateGeneralSetting(+id, updateSettingDto);
    return {
      message: await this.i18n.t('main.messages.flash.setting_update'),
    };
  }

  @Post('contact-information/:id')
  async updateContactInformation(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateSettingDto: UpdateContactInformationDto,
  ) {
    this.settingsService.updateContactInformation(+id, updateSettingDto);
    return {
      message: await this.i18n.t('main.messages.flash.setting_update'),
    };
  }
}
