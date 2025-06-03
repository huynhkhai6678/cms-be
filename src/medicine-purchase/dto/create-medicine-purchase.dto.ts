import { IsNotEmpty, IsNumber, Min, IsOptional, IsArray, ValidateNested, IsNumberString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePurchasedMedicineDTO } from './create-medicine.dto';

export class CreateMedicinePurchaseDto {
    @IsNotEmpty({ message: 'Clinic ID is required.' })
    clinic_id: number;

    @IsNumberString({}, { message: 'Total must be a number.' })
    total: number;

    @IsNumberString({}, { message: 'Tax must be a number.' })
    tax: number;

    @IsNumberString({}, { message: 'Net amount must be a number.' })
    net_amount: number;

    @IsOptional()
    @IsNumber({}, { message: 'Discount must be a number.' })
    discount?: number;

    @IsOptional()
    @IsNumber({}, { message: 'Shipping fee must be a number.' })
    shipping_fee?: number;

    @IsArray({ message: 'Medicines must be an array.' })
    @ValidateNested({ each: true })
    @Type(() => CreatePurchasedMedicineDTO)
    medicines: CreatePurchasedMedicineDTO[];

    @IsOptional()
    payment_type: number;

    @IsOptional()
    note?: string;

    @IsOptional()
    payment_note?: string;

    @IsOptional()
    brand_id?: number;
}
