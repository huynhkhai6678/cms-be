import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicinePurchaseDto } from './create-medicine-purchase.dto';

export class UpdateMedicinePurchaseDto extends PartialType(CreateMedicinePurchaseDto) {}
