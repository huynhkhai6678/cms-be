import { IsDefined, IsString, Validate } from 'class-validator';
import { MatchValidator } from 'src/validators/match.validator';

export class ChangePasswordDto {
  @IsDefined()
  @IsString()
  current_password: string;

  @IsDefined()
  @IsString()
  new_password: string;

  @IsDefined()
  @IsString()
  @Validate(MatchValidator, ['new_password'])
  confirm_password: string;
}
