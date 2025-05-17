import { Injectable } from '@nestjs/common';
import { CreateSpecilizationDto } from './dto/create-specilization.dto';
import { UpdateSpecilizationDto } from './dto/update-specilization.dto';

@Injectable()
export class SpecilizationsService {
  create(createSpecilizationDto: CreateSpecilizationDto) {
    return 'This action adds a new specilization';
  }

  findAll() {
    return `This action returns all specilizations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} specilization`;
  }

  update(id: number, updateSpecilizationDto: UpdateSpecilizationDto) {
    return `This action updates a #${id} specilization`;
  }

  remove(id: number) {
    return `This action removes a #${id} specilization`;
  }
}
