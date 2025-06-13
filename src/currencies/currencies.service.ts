import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { DatabaseService } from 'src/shared/database/database.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../entites/currency.entity';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    private database: DatabaseService,
  ) {}

  create(createCurrencyDto: CreateCurrencyDto) {
    const currency = this.currencyRepository.create(createCurrencyDto);
    return this.currencyRepository.save(currency);
  }

  async findAll(query) {
    return await this.database.paginateAndSearch<Currency>({
      repository: this.currencyRepository,
      alias: 'currency',
      query: query,
      searchFields: ['currency_name', 'currency_icon', 'currency_code'],
      filterFields: [],
      allowedOrderFields: ['currency_name', 'currency_icon', 'currency_code'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'ASC',
      selectFields: [],
      relations: [],
    });
  }

  async findOne(id: number) {
    return {
      data: await this.currencyRepository.findOne({ where: { id } }),
    };
  }

  async update(id: number, updateCurrencyDto: UpdateCurrencyDto) {
    await this.findOne(id);
    return this.currencyRepository.update(id, updateCurrencyDto);
  }

  async remove(id: number) {
    return await this.currencyRepository.delete(id);
  }
}
