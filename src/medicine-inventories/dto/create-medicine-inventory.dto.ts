import { IsNumber, IsOptional, IsPositive, IsString, IsDate, IsNotEmpty, IsNumberString, IsDefined } from 'class-validator';

export class CreateMedicineInventoryDto {
    
    // @IsNumber()
    // @IsPositive()
    @IsDefined()
    medicine_id: number;

    @IsDefined()
    quantity: number;

    @IsOptional()
    bonus?: number;

    @IsString()
    @IsOptional()
    uom?: string;

    @IsDefined()
    price: number;

    @IsOptional()
    cost_per_unit?: number;

    @IsNumber()
    @IsOptional()
    available_quantity?: number;

    @IsString()
    @IsOptional()
    batch_number?: string;

    @IsOptional()
    expiration_date?: string;

    @IsString()
    @IsOptional()
    description?: string;
}

