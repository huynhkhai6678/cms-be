import { IsOptional, IsIn, IsString, IsNumber } from 'class-validator';

export class QueryParamsDto {
  @IsOptional()
  @IsIn(['ASC', 'DESC'], { message: 'order must be ASC or DESC' })
  order?: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  orderBy: string;

  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsNumber()
  page: number;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  clinic_id: number;

  @IsOptional()
  @IsString()
  start_date: string;

  @IsOptional()
  @IsString()
  end_date: string;

  @IsOptional()
  status: string;

  @IsOptional()
  active: number;

  @IsOptional()
  payment_type: number;
}
