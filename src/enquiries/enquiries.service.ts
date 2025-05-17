import { Injectable } from '@nestjs/common';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { Enquiry } from '../entites/enquiry.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseService } from '../shared/database/database.service';

@Injectable()
export class EnquiriesService {

  constructor(
    @InjectRepository(Enquiry)
    private readonly enquiryRepo: Repository<Enquiry>,
    private database: DatabaseService,
  ) {}

  create(createEnquiryDto: CreateEnquiryDto) {
    const enquiry = this.enquiryRepo.create(createEnquiryDto);
    return this.enquiryRepo.save(enquiry);
  }

  findAll() {
    return `This action returns all enquiries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enquiry`;
  }

  update(id: number, updateEnquiryDto: UpdateEnquiryDto) {
    return `This action updates a #${id} enquiry`;
  }

  remove(id: number) {
    return `This action removes a #${id} enquiry`;
  }
}
