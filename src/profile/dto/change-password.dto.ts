import { IsDefined, IsString, Matches } from "class-validator";

export class ChangePasswordDto {
    @IsDefined()
    @IsString()
    current_password

    @IsDefined()
    @IsString()
    new_password

    @IsDefined()
    @IsString()
    @Matches('password')
    confirm_password
}
