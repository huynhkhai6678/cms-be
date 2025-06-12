import { IsDefined, IsNumber, IsNumberString, IsString } from "class-validator";

export class CreateDocumentDto {
    @IsDefined()
    @IsNumberString()
    patient_medical_record_id: number;

    @IsDefined()
    @IsString()
    path: string;

    @IsDefined()
    @IsString()
    file_name: string;

    @IsDefined()
    @IsString()
    type: string;

    @IsDefined()
    @IsNumber()
    category_id: number;
}
