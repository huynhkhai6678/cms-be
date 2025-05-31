import { IsDefined, IsNumber, IsString } from "class-validator";

export class CreateMedicineInventoryUsageDto {
    @IsDefined()
    @IsNumber()
    quantity: number;

    @IsDefined()
    @IsNumber()
    type: number;

    @IsDefined()
    @IsString()
    description: string;

    @IsDefined()
    medicine_inventory_id: number;
}
