import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateClinicDocumentSettingDto } from './dto/update-clinic-document-setting.dto';
import { ClinicDocumentSetting } from '../entites/clinic-document-setting.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClinicDocumentSettingService {
  constructor(
    @InjectRepository(ClinicDocumentSetting)
    private readonly documentRepo: Repository<ClinicDocumentSetting>,
  ) {}

  async findOne(id: number) {
    return {
      data: await this.documentRepo.findOneBy({ clinic_id: id }),
    };
  }

  async update(
    id: number,
    updateClinicDocumentSettingDto: UpdateClinicDocumentSettingDto,
  ) {
    const document = await this.documentRepo.findOneBy({ clinic_id: id });
    if (!document) {
      throw new NotFoundException('Invalid document');
    }

    document.header = updateClinicDocumentSettingDto.header;
    document.transaction_invoice_template =
      updateClinicDocumentSettingDto.transaction_invoice_template;
    document.transaction_receipt_template =
      updateClinicDocumentSettingDto.transaction_receipt_template;
    document.medical_certificate_template =
      updateClinicDocumentSettingDto.medical_certificate_template;
    return await this.documentRepo.save(document);
  }

  uploadImage(uploadImageDto) {
    console.log(uploadImageDto);
    return 'testing';
  }
}
