import { IsNotEmpty, IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class CreateTransactionServiceDTO {
    @IsNotEmpty({ message: 'Medicine ID is required.' })
    name: number;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNumber({}, { message: 'Purchase price must be a number.' })
    @Min(0, { message: 'Quantity price must be at least 0.' })
    quantity: number;

    @IsOptional()
    @IsNumber({}, { message: 'Quantity must be a number.' })
    discount: number;

    @IsNotEmpty()
    @IsString()
    type: number;

    @IsNotEmpty()
    service_id: number;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    dosage: string;

    @IsOptional()
    @IsString()
    frequency: string;

    @IsOptional()
    @IsString()
    administration: string;

    @IsOptional()
    @IsString()
    purpose: string;

    @IsNotEmpty()
    @IsNumber()
    sub_total
}