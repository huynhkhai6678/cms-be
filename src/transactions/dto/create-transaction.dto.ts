import { IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTransactionDto {
    @IsInt()
    transaction_invoice_id: number;

    @IsString()
    receipt_number: string;

    @IsNumber()
    service_amount: number;

    @IsNumber()
    inventory_amount: number;

    @IsNumber()
    amount: number;

    @IsOptional()
    created_at?: Date;

    @IsOptional()
    updated_at?: Date;
}
