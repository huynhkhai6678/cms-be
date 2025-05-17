import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { I18nService } from 'nestjs-i18n';

@UseGuards(AuthGuard, RoleGuardFactory('manage_clinics'))
@Controller('currencies')
export class CurrenciesController {
  constructor(
    private readonly currenciesService: CurrenciesService,
    private i18n: I18nService,
  ) {}

  @Post()
  async create(
    @Body(new ValidationPipe()) createCurrencyDto: CreateCurrencyDto,
  ) {
    this.currenciesService.create(createCurrencyDto);
    return {
      message: await this.i18n.t('main.messages.flash.currency_create'),
    };
  }

  @Get()
  async findAll(@Query() query) {
    return this.currenciesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.currenciesService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateCurrencyDto: UpdateCurrencyDto,
  ) {
    const result = await this.currenciesService.update(+id, updateCurrencyDto);
    if (result) {
      return {
        message: await this.i18n.t('main.messages.flash.currency_update'),
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.currenciesService.remove(id);
    if (result.affected === 1) {
      return {
        message: await this.i18n.t('main.messages.flash.currency_delete'),
      };
    }
  }
}
