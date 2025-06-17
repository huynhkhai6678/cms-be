import {
  IsDefined,
  IsString,
  Validate,
} from 'class-validator';
import { MatchValidator } from 'src/validators/match.validator';

export class ResetPasswordDto {
    @IsDefined()
    @IsString()
    token: string;

    @IsDefined()
    @IsString()
    password: string;

    @IsDefined()
    @IsString()
    @Validate(MatchValidator, ['password'])
    confirm_password: string;
}
