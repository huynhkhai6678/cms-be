import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientMedicalRecordDocument } from '../../entites/patient-medical-record-document.entity';
import { Repository } from 'typeorm';
import { FileService } from '../../shared/file/file.service';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(PatientMedicalRecordDocument)
    private readonly medicalRecordDocumentRepo: Repository<PatientMedicalRecordDocument>,
    private fileService: FileService
  ) { }

  async create(createDocumentDto: CreateDocumentDto) {
    const category = this.medicalRecordDocumentRepo.create(createDocumentDto);
    return await this.medicalRecordDocumentRepo.save(category);
  }

  async findAll(id: number) {
    const data = await this.medicalRecordDocumentRepo.findBy({ patient_medical_record_id : id });
    return {
      data
    };
  }

  async findOne(id: number) {
    return {
      data: await this.medicalRecordDocumentRepo.findOneBy({ id }),
    };
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    const document = await this.medicalRecordDocumentRepo.findOneBy({ id });
    if (!document) throw new NotFoundException('Document not found');

    Object.assign(document, updateDocumentDto);
    return await this.medicalRecordDocumentRepo.save(document);
  }

  async remove(id: number) {
    const document = await this.medicalRecordDocumentRepo.findOneBy({ id });
    if (!document) throw new NotFoundException('Document not found');

    await this.fileService.deleteFile(document.path);

    await this.medicalRecordDocumentRepo.remove(document);
  }
}
