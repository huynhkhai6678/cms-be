import { IsDefined, IsString } from 'class-validator';

export class CreateCurrencyDto {
  @IsDefined()
  @IsString()
  currency_name: string;

  @IsDefined()
  @IsString()
  currency_icon: string;

  @IsDefined()
  @IsString()
  currency_code: string;
}
