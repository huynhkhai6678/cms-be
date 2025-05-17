import { IsArray, IsDefined, IsString } from 'class-validator';

export class CreateClinicChainDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsArray()
  clinic_ids: string[];
}
