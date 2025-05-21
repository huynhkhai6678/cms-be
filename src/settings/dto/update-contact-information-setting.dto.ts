import { IsDefined, IsNumberString, IsString } from "class-validator";

export class UpdateContactInformationDto {
    @IsDefined()
    @IsString()
    address_one: string;

    @IsDefined()
    @IsString()
    address_two: string;

    @IsDefined()
    @IsNumberString()
    country_id: number;

    @IsDefined()
    @IsNumberString()
    state_id: number;

    @IsDefined()
    @IsNumberString()
    city_id: number;

    @IsDefined()
    @IsString()
    postal_code: string;
}
