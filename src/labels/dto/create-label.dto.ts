import { IsDefined, IsNumber, IsNumberString, IsString } from "class-validator";

export class CreateLabelDto {
    @IsDefined()
    @IsString()
    name: string;

    @IsDefined()
    @IsNumber()
    type: number;

    @IsDefined()
    @IsNumberString()
    clinic_id: number;
}
