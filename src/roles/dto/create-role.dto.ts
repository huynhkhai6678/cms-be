import { IsArray, IsDefined, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsDefined()
  @IsString()
  display_name: string;

  @IsDefined()
  @IsArray()
  permission_ids: string[];
}
