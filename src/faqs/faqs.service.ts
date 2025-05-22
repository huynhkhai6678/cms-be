import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { DatabaseService } from '../shared/database/database.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from '../entites/faq.entity';

@Injectable()
export class FaqsService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepo: Repository<Faq>,
    private database: DatabaseService,
  ) {}

  async create(createFaqDto: CreateFaqDto) {
    const faq = this.faqRepo.create(createFaqDto);
    return await this.faqRepo.save(faq);
  }

  async findAll(query) {
    return await this.database.paginateAndSearch<Faq>({
      repository: this.faqRepo,
      alias: 'faq',
      query: {
        ...query,
      },
      searchFields: ['question', 'answer'],
      filterFields: ['clinic_id'],
      allowedOrderFields: ['question', 'answer'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields: [],
      relations: [],
    });
  }

  async findOne(id: number) {
    return {
      data: await this.faqRepo.findOneBy({ id }),
    };
  }

  async update(id: number, updateFaqDto: UpdateFaqDto) {
    const faq = await this.faqRepo.findOneBy({ id });
    if (!faq) throw new NotFoundException('Faq not found');

    faq.question = updateFaqDto.question ?? '';
    faq.answer = updateFaqDto.answer ?? '';
    return await this.faqRepo.save(faq);
  }

  async remove(id: number) {
    const faq = await this.faqRepo.findOneBy({ id });
    if (!faq) throw new NotFoundException('Faq not found');

    await this.faqRepo.remove(faq);
  }
}
