import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { I18nService } from 'nestjs-i18n';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService, private i18n : I18nService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    await this.categoriesService.create(createCategoryDto);
    return {
      message: this.i18n.translate('main.messages.flash.cat_create'),
    };
  }

  @Get()
  findAll(@Query() query) {
    return this.categoriesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Post('update-status/:id')
  async updateStatus(@Param('id') id: string, @Body('active') active : boolean) {
    await this.categoriesService.updateStatus(+id, active);
    return {
      message: this.i18n.translate('main.messages.flash.update_status'),
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    await this.categoriesService.update(+id, updateCategoryDto);
    return {
      message: this.i18n.translate('main.messages.flash.cat_update'),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(+id);
    return {
      message: this.i18n.translate('main.messages.flash.cat_delete'),
    };
  }
}
