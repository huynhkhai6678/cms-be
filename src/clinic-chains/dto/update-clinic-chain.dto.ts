import { PartialType } from '@nestjs/mapped-types';
import { CreateClinicChainDto } from './create-clinic-chain.dto';

export class UpdateClinicChainDto extends PartialType(CreateClinicChainDto) {}
