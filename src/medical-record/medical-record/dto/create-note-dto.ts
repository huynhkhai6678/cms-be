import { IsDefined, IsNumberString, IsString } from "class-validator";

export class CreateNoteDto {
    @IsDefined()
    @IsNumberString()
    patient_medical_record_id: number;

    @IsDefined()
    @IsString()
    notes: number;
    
    @IsDefined()
    @IsString()
    diagnosis: number;
}