import { IsDefined, IsString } from "class-validator";

export class UpdateClinicDocumentSettingDto {
    @IsDefined()
    @IsString()
    header: string;

    @IsDefined()
    @IsString()
    transaction_receipt_template: string;

    @IsDefined()
    @IsString()
    medical_certificate_template: string;

    @IsDefined()
    @IsString()
    transaction_invoice_template: string;
}
