import { Module } from '@nestjs/common';
import { CmsService } from './cms.service';
import { CmsController } from './cms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Setting } from '../entites/setting.entity';
import { SettingsModule } from 'src/settings/settings.module';

@Module({
  imports: [TypeOrmModule.forFeature([Setting]), AuthModule, SettingsModule],
  controllers: [CmsController],
  providers: [CmsService],
})
export class CmsModule {}
