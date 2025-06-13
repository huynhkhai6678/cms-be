import { PartialType } from '@nestjs/mapped-types';
import { CreateSmartPatientCardDto } from './create-smart-patient-card.dto';

export class UpdateSmartPatientCardDto extends PartialType(
  CreateSmartPatientCardDto,
) {}
