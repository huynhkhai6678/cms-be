import { IsNotEmpty, IsNumber, Min, IsOptional, IsNumberString } from 'class-validator';

export class CreatePurchasedMedicineDTO {
  @IsNotEmpty({ message: 'Medicine ID is required.' })
  medicine_id: number;

  @IsNotEmpty({ message: 'Label ID is required.' })
  label_id: number;

  @IsNumber({}, { message: 'Purchase price must be a number.' })
  @Min(0, { message: 'Purchase price must be at least 0.' })
  purchase_price: number;

  @IsNumber({}, { message: 'Quantity must be a number.' })
  @Min(1, { message: 'Quantity must be at least 1.' })
  quantity: number;

  @IsOptional()
  @IsNumber({}, { message: 'Tax must be a number.' })
  tax_medicine?: number;

  @IsOptional()
  @IsNumberString({}, { message: 'Amount must be a number.' })
  amount?: number;
}