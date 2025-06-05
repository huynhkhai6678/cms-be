import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionMedicalCertificateDto } from './dto/create-transaction-medical-certificate.dto';
import { UpdateTransactionMedicalCertificateDto } from './dto/update-transaction-medical-certificate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionMedicalCertificate } from '../entites/transaction-medical-certificate.entity';
import { HelperService } from '../helper/helper.service';
import { join } from 'path';
import { ClinicDocumentSetting } from '../entites/clinic-document-setting.entity';
import * as moment from 'moment';
import * as ejs from 'ejs';
import { parseTemplateContent } from '../utils/template.util';
import { I18nService } from 'nestjs-i18n';
import { PdfService } from 'src/shared/pdf/pdf.service';

@Injectable()
export class TransactionMedicalCertificateService {
  constructor(
    @InjectRepository(TransactionMedicalCertificate)
    private readonly transactionMedicalCertificateRepo: Repository<TransactionMedicalCertificate>,
    @InjectRepository(ClinicDocumentSetting)
    private readonly clinicDocumentRepo: Repository<ClinicDocumentSetting>,
    private helperService : HelperService,
    private i18n: I18nService,
    private pdfService : PdfService
  ) {}

  async create(createTransactionMedicalCertificateDto: CreateTransactionMedicalCertificateDto) {
    const category = this.transactionMedicalCertificateRepo.create(createTransactionMedicalCertificateDto);
    category.certificate_number = await this.generateInvoiceNumber();
    return await this.transactionMedicalCertificateRepo.save(category);
  }

  async findOne(id: number) {
    const data = await this.transactionMedicalCertificateRepo.findOneBy({ id});
    const doctors = await this.helperService.clinicDoctor(28);
   
    return {
      data,
      doctors
    };
  }

  async update(id: number, updateTransactionMedicalCertificateDto: UpdateTransactionMedicalCertificateDto) {
    const certificate = await this.transactionMedicalCertificateRepo.findOneBy({ id });
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    Object.assign(certificate, updateTransactionMedicalCertificateDto);
    return await this.transactionMedicalCertificateRepo.save(certificate);
  }

  async remove(id: number) {
    const certificate = await this.transactionMedicalCertificateRepo.findOneBy({ id });
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }
    return await this.transactionMedicalCertificateRepo.remove(certificate);
  }

  async generateInvoiceNumber() {
    const certificate = await this.transactionMedicalCertificateRepo
      .createQueryBuilder('transaction_medical_certificates')
      .orderBy('transaction_medical_certificates.certificate_number', 'DESC')
      .limit(1)
      .getOne();

    let nextNumber: string;
    if (certificate) {
      const lastMRN = parseInt(certificate.certificate_number, 10);
      nextNumber = (lastMRN + 1).toString().padStart(5, '0');
    } else {
      nextNumber = '00001';
    }

    return nextNumber;
  }

  async export(id : number) {
    const templatePath = join(__dirname, '..', 'templates', 'transaction-certificate.ejs');

    const certificate = await this.transactionMedicalCertificateRepo.findOne({ 
      where : {
        id
      },
      relations : [
        'transaction_invoice', 
        'transaction_invoice.patient', 
        'transaction_invoice.patient.user', 
        'transaction_invoice.doctor', 
        'transaction_invoice.doctor.user'
      ] 
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    const clinicSetting = await this.clinicDocumentRepo.findOneBy({clinic_id : certificate.transaction_invoice.clinic_id});

    if (!clinicSetting) {
      throw new NotFoundException('Clinic Setting not found');
    }

    const templateData = {
      'patient_name'      : `${certificate.transaction_invoice.patient.user.first_name} ${certificate.transaction_invoice.patient.user.last_name}`,
      'id_number'         : `${certificate.transaction_invoice.patient.user.id_number}`,
      'start_date'        : moment(certificate.start_date).format('DD/MM/YYYY'),
      'end_date'          : moment(certificate.end_date).format('DD/MM/YYYY'),
      'start_time'        : certificate.type == 2 ? certificate.start_time : '',
      'end_time'          : certificate.type == 2 ? certificate.end_time : '',
      'type'              : certificate.type === 2 ? this.i18n.t('main.messages.transaction.medical_certificate') :  this.i18n.t('main.messages.transaction.time_slip'),
      'reason'            : certificate.reason,
      'description'       : certificate.description,
      'certificate_number': certificate.certificate_number,
      'doctor_name'       : `${certificate.transaction_invoice.doctor.user.first_name} ${certificate.transaction_invoice.doctor.user.last_name}`,
      'invoice_date'      : moment(certificate.transaction_invoice.bill_date).format('DD/MM/YYYY'),
    }

    let body = clinicSetting.medical_certificate_template;
    body = parseTemplateContent(body, templateData);

    const htmlContent = await ejs.renderFile(templatePath, {
      title: this.i18n.t('main.messages.transaction.medical_certificate'),
      header: clinicSetting.header,
      type : certificate.type === 2 ? this.i18n.t('main.messages.transaction.medical_certificate') :  this.i18n.t('main.messages.transaction.time_slip'),
      body
    });

    const pdfBuffer = await this.pdfService.createPdfFromHtml(htmlContent);
    return pdfBuffer;
  } 
}
