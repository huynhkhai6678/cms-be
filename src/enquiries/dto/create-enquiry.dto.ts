import { IsDefined, IsEmail, IsNumberString, IsString } from "class-validator";

export class CreateEnquiryDto {
    @IsDefined()
    @IsString()
    name: string;

    @IsDefined()
    @IsString()
    @IsEmail()
    email: string;

    @IsDefined()
    @IsString()
    message: string;

    @IsDefined()
    @IsNumberString()
    phone: string;

    @IsDefined()
    @IsNumberString()
    clinic_id: string;
}
