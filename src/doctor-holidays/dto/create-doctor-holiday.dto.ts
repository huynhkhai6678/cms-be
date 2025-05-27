import { IsDefined, IsNumberString, IsString } from "class-validator";

export class CreateDoctorHolidayDto {
    @IsDefined()
    @IsNumberString()
    doctor_id: number;

    @IsDefined()
    @IsString()
    date: string;

    @IsDefined()
    @IsString()
    name: string;

    @IsDefined()
    @IsNumberString()
    clinic_id: number;
}
