import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpecilizationsService } from './specilizations.service';
import { CreateSpecilizationDto } from './dto/create-specilization.dto';
import { UpdateSpecilizationDto } from './dto/update-specilization.dto';

@Controller('specilizations')
export class SpecilizationsController {
  constructor(private readonly specilizationsService: SpecilizationsService) {}

  @Post()
  create(@Body() createSpecilizationDto: CreateSpecilizationDto) {
    return this.specilizationsService.create(createSpecilizationDto);
  }

  @Get()
  findAll() {
    return this.specilizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specilizationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpecilizationDto: UpdateSpecilizationDto) {
    return this.specilizationsService.update(+id, updateSpecilizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specilizationsService.remove(+id);
  }
}
