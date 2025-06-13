import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { Subscribe } from '../entites/subcriber.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseService } from '../shared/database/database.service';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscribe)
    private readonly subscribeRepo: Repository<Subscribe>,
    private dataTable: DatabaseService,
  ) {}

  create(createSubscriberDto: CreateSubscriberDto) {
    const subscriber = this.subscribeRepo.create(createSubscriberDto);
    return this.subscribeRepo.save(subscriber);
  }

  async findAll(query) {
    return await this.dataTable.paginateAndSearch<Subscribe>({
      repository: this.subscribeRepo,
      alias: 'subscribe',
      query: {
        ...query,
      },
      searchFields: ['email'],
      filterFields: ['clinic_id'],
      allowedOrderFields: ['email', 'created_at'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields: [],
      relations: [],
    });
  }

  async remove(id: number) {
    const enquiry = await this.subscribeRepo.findOneBy({ id });
    if (!enquiry) {
      throw new NotFoundException('Enquiry not found');
    }

    return await this.subscribeRepo.remove(enquiry);
  }
}
