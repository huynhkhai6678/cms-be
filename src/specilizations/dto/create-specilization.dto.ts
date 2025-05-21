import { IsDefined, IsString } from "class-validator";

export class CreateSpecilizationDto {
    @IsDefined()
    @IsString()
    name: string;
}
