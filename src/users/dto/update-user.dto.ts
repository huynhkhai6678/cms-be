import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsDefined, IsEmail, IsNumber, IsNumberString, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsDefined()
    @IsString()
    first_name: string;
    
    @IsDefined()
    @IsString()
    last_name: string;

    @IsDefined()
    @IsEmail()
    @IsString()
    email: string;

    @IsDefined()
    phone: {
        e164Number: string;
        dialCode: string;
    };
    
    @IsDefined()
    @IsArray()
    clinic_ids: number[];

    @IsDefined()
    @IsNumberString()
    clinic_chain_id: number;
}
