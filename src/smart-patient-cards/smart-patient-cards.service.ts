import { Injectable } from '@nestjs/common';
import { CreateSmartPatientCardDto } from './dto/create-smart-patient-card.dto';
import { UpdateSmartPatientCardDto } from './dto/update-smart-patient-card.dto';
import { DatabaseService } from '../shared/database/database.service';
import { InjectRepository } from '@nestjs/typeorm';
import { SmartPatientCard } from '../entites/smart-patient-card.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SmartPatientCardsService {
  constructor(
    @InjectRepository(SmartPatientCard)
    private readonly smartCardRepo: Repository<SmartPatientCard>,
    private database: DatabaseService,
  ) {}

  create(createSmartPatientCardDto: CreateSmartPatientCardDto) {
    return 'This action adds a new smartPatientCard';
  }

  async findAll(query) {
    return await this.database.paginateAndSearch<SmartPatientCard>({
      repository: this.smartCardRepo,
      alias: 'smart_patient_card',
      query: {
        ...query,
      },
      searchFields: ['template_name'],
      filterFields: ['clinic_id'],
      allowedOrderFields: ['template_name', 'email_show', 'phone_show', 'dob_show', 'blood_group_show', 'address_show', 'show_patient_unique_id'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields: [],
      relations: [],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} smartPatientCard`;
  }

  update(id: number, updateSmartPatientCardDto: UpdateSmartPatientCardDto) {
    return `This action updates a #${id} smartPatientCard`;
  }

  remove(id: number) {
    return `This action removes a #${id} smartPatientCard`;
  }
}
