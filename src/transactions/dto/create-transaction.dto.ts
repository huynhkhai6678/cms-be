import { IsArray, IsDateString, IsInt, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";
import { CreateTransactionServiceDTO } from "./create-transaction-service.dto";

export class CreateTransactionDto {
    @IsOptional()
    @IsNumberString()
    clinic_id?: number;

    @IsNumberString()
    @IsNotEmpty()
    doctor_id: number;

    @IsNumberString()
    @IsNotEmpty()
    user_id: number;

    @IsNumberString()
    @IsOptional()
    visit_id: number;

    @IsOptional()
    @IsString()
    service_id?: string;

    @IsOptional()
    @IsString()
    important_notes?: string;

    @IsString()
    @IsNotEmpty()
    invoice_number: string;

    @IsDateString()
    @IsNotEmpty()
    bill_date: string;

    @IsOptional()
    @IsInt()
    status?: number = 0;

    @IsArray()
    services: CreateTransactionServiceDTO[];

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsString()
    payment_note?: string;

    @IsOptional()
    @IsNumber()
    payment_type?: number;

    @IsOptional()
    @IsNumber()
    tax?: number;

    @IsOptional()
    @IsNumber()
    total?: number;

    @IsOptional()
    @IsNumber()
    net_amount?: number;

    @IsOptional()
    @IsNumber()
    discount?: number;
}
