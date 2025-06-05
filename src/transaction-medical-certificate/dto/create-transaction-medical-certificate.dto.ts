import { IsDateString, IsNotEmpty, IsNumber, IsNumberString, IsOptional } from "class-validator";

export class CreateTransactionMedicalCertificateDto {
    @IsNumber()
    @IsNotEmpty()
    transaction_invoice_id: number;

    @IsNumberString()
    @IsNotEmpty()
    doctor_id: number;

    @IsDateString()
    @IsNotEmpty()
    start_date: string;

    @IsDateString()
    @IsNotEmpty()
    end_date: string;

    @IsOptional()
    type : number;

    @IsOptional()
    end_time : string;

    @IsOptional()
    start_time : string;

    @IsOptional()
    reason : string;

    @IsOptional()
    description : string;
}
