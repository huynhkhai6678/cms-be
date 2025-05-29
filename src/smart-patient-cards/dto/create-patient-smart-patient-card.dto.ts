import { IsBoolean, IsDefined, IsNumber, IsNumberString, IsString } from "class-validator";

export class CreatePatientSmartPatientCardDto {
    @IsDefined()
    @IsNumberString()
    template_id: number;

    @IsDefined()
    @IsNumberString()
    clinic_id: number;

    patient_id: number;

    @IsDefined()
    @IsNumber()
    type : number;
}
