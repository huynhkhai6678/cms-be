import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecilizationDto } from './create-specilization.dto';

export class UpdateSpecilizationDto extends PartialType(
  CreateSpecilizationDto,
) {}
