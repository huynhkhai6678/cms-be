import { IsBoolean, IsDefined, IsString } from "class-validator";

export class CreateSmartPatientCardDto {
    @IsDefined()
    @IsString()
    template_name: string;

    @IsDefined()
    @IsString()
    header_color: string;

    @IsDefined()
    @IsBoolean()
    show_email : boolean;

    @IsDefined()
    @IsBoolean()
    show_address : boolean;

    @IsDefined()
    @IsBoolean()
    show_dob : boolean;

    @IsDefined()
    @IsBoolean()
    show_blood_group : boolean;

    @IsDefined()
    @IsBoolean()
    show_phone : boolean;

    @IsDefined()
    @IsBoolean()
    show_patient_unique_id : boolean;
}
