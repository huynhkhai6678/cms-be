import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { I18nService } from 'nestjs-i18n';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';

@UseGuards(AuthGuard, RoleGuardFactory('manage_medicines'))
@Controller('brands')
export class BrandsController {
  constructor(
    private readonly brandsService: BrandsService,
    private i18n: I18nService,
  ) {}

  @Post()
  async create(@Body() createBrandDto: CreateBrandDto) {
    await this.brandsService.create(createBrandDto);
    return {
      message: this.i18n.translate('main.messages.flash.supplier_create'),
    };
  }

  @Get()
  findAll(@Query() query) {
    return this.brandsService.findAll(query);
  }

  @Get('supplier/:id')
  findSupplier(@Param('id') id: string) {
    return this.brandsService.findSupplier(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    await this.brandsService.update(+id, updateBrandDto);
    return {
      message: this.i18n.translate('main.messages.flash.supplier_update'),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.brandsService.remove(+id);
    return {
      message: this.i18n.translate('main.messages.flash.supplier_delete'),
    };
  }
}
