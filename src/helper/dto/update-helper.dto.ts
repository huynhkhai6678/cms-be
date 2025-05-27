import { PartialType } from '@nestjs/mapped-types';
import { CreateHelperDto } from './create-helper.dto';

export class UpdateHelperDto extends PartialType(CreateHelperDto) {}
