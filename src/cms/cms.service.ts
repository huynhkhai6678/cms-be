import { Injectable } from '@nestjs/common';
import { UpdateCmDto } from './dto/update-cm.dto';
import { Setting } from '../entites/setting.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>,
    private settingService: SettingsService,
  ) {}

  async findOne(clinic_id: number) {
    const keys = [
      'about_image_1',
      'about_image_2',
      'about_image_3',
      'about_title',
      'about_experience',
      'about_short_description',
      'terms_conditions',
      'privacy_policy',
    ];

    const settings = await this.settingRepo.find({
      where: {
        clinic_id,
        key: In(keys),
      },
    });

    const result = settings.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});

    return {
      data: result,
    };
  }

  async update(id: number, updateCmDto: UpdateCmDto) {
    for (const [key, value] of Object.entries(updateCmDto)) {
      if (
        key != 'about_image_1' &&
        key != 'about_image_2' &&
        key != 'about_image_3'
      ) {
        await this.settingService.updateSetting(id, key, value);
      } else {
        if (value != '') {
          await this.settingService.updateSetting(id, key, value);
        }
      }
    }
  }
}
