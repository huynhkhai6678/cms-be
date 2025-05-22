import { IsDefined, IsNumberString, IsString } from 'class-validator';

export class UpdateCmDto {
  about_image_1: any;
  about_image_2: any;
  about_image_3: any;

  @IsDefined()
  @IsString()
  about_title: string;

  @IsDefined()
  @IsNumberString()
  about_experience: string;

  @IsDefined()
  @IsString()
  about_short_description: string;

  @IsDefined()
  @IsString()
  terms_conditions: string;

  @IsDefined()
  @IsString()
  privacy_policy: string;
}
