import { IsArray, IsDefined, IsNumberString, IsString } from "class-validator";

export class UpdateGenralDto {
    @IsDefined()
    @IsString()
    clinic_name: string;

    @IsDefined()
    @IsString()
    email: string;

    @IsDefined()
    @IsArray()
    specialities: [];

    @IsDefined()
    @IsString()
    front_color: number;

    @IsDefined()
    @IsArray()
    payment_gateways: [];
}
