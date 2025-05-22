import { Module } from '@nestjs/common';
import { ClinicDocumentSettingService } from './clinic-document-setting.service';
import { ClinicDocumentSettingController } from './clinic-document-setting.controller';
import { ClinicDocumentSetting } from '../entites/clinic-document-setting.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicDocumentSetting])],
  controllers: [ClinicDocumentSettingController],
  providers: [ClinicDocumentSettingService],
})
export class ClinicDocumentSettingModule {}
