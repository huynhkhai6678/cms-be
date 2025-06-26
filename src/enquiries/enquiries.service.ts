import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
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

  async create(createEnquiryDto: CreateEnquiryDto) {
    const enquiry = this.enquiryRepo.create(createEnquiryDto);
    return await this.enquiryRepo.save(enquiry);
  }

  async findAll(query) {
    return await this.database.paginateAndSearch<Enquiry>({
      repository: this.enquiryRepo,
      alias: 'enquiry',
      query: {
        ...query,
      },
      searchFields: ['name', 'message'],
      filterFields: ['clinic_id', 'view'],
      allowedOrderFields: ['name', 'message', 'created_at'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields: [],
      relations: [],
    });
  }

  async findOne(id: number) {
    const enquiry = await this.enquiryRepo.findOneBy({ id });
    if (!enquiry) {
      throw new NotFoundException('Enquiry not found');
    }

    if (!enquiry.view) {
      enquiry.view = true;
      await this.enquiryRepo.save(enquiry);
    }

    return {
      data: enquiry,
    };
  }

  async remove(id: number) {
    const enquiry = await this.enquiryRepo.findOneBy({ id });
    if (!enquiry) {
      throw new NotFoundException('Enquiry not found');
    }

    await this.enquiryRepo.remove(enquiry);
  }
}
