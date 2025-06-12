import { PartialType } from '@nestjs/mapped-types';
import { CreatePulseRateDto } from './create-pulse-rate.dto';

export class UpdatePulseRateDto extends PartialType(CreatePulseRateDto) {}
