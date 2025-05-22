import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ClinicChainsService } from './clinic-chains.service';
import { CreateClinicChainDto } from './dto/create-clinic-chain.dto';
import { UpdateClinicChainDto } from './dto/update-clinic-chain.dto';

@Controller('clinic-chains')
export class ClinicChainsController {
  constructor(private readonly clinicChainsService: ClinicChainsService) {}

  @Post()
  create(
    @Body(new ValidationPipe()) createClinicChainDto: CreateClinicChainDto,
  ) {
    return this.clinicChainsService.create(createClinicChainDto);
  }

  @Get()
  async findAll(@Query() query) {
    return this.clinicChainsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clinicChainsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateClinicChainDto: UpdateClinicChainDto,
  ) {
    return this.clinicChainsService.update(+id, updateClinicChainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clinicChainsService.remove(+id);
  }
}
