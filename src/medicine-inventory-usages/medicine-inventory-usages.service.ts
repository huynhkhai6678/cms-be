import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicineInventoryUsageDto } from './dto/create-medicine-inventory-usage.dto';
import { UpdateMedicineInventoryUsageDto } from './dto/update-medicine-inventory-usage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicineInventoryUsage } from '../entites/medicine-inventory-usage.entity';
import { Repository } from 'typeorm';
import { DatabaseService } from '../shared/database/database.service';
import { ShareMedicineService } from '../shared/share-medicine/share-medicine.service';

@Injectable()
export class MedicineInventoryUsagesService {
  constructor(
    @InjectRepository(MedicineInventoryUsage)
    private readonly medicineInvenUsageRepo: Repository<MedicineInventoryUsage>,
    private dataTable: DatabaseService,
    private shareMedicineService: ShareMedicineService,
  ) {}

  async create(
    createMedicineInventoryUsageDto: CreateMedicineInventoryUsageDto,
  ) {
    const dto = this.medicineInvenUsageRepo.create(
      createMedicineInventoryUsageDto,
    );
    await this.medicineInvenUsageRepo.save(dto);
    await this.shareMedicineService.calculateAvailableMedicineInventory(
      dto.medicine_inventory_id,
    );
    return true;
  }

  async findAll(query) {
    return await this.dataTable.paginateAndSearch<MedicineInventoryUsage>({
      repository: this.medicineInvenUsageRepo,
      alias: 'medicine_inventory_usage',
      query: {
        ...query,
      },
      searchFields: ['name', 'description'],
      filterFields: [],
      allowedOrderFields: ['name', 'description'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields: [],
      relations: [],
    });
  }

  async findOne(id: number) {
    return {
      data: await this.medicineInvenUsageRepo.findOneBy({ id }),
    };
  }

  async update(
    id: number,
    updateMedicineInventoryUsageDto: UpdateMedicineInventoryUsageDto,
  ) {
    const medicine = await this.medicineInvenUsageRepo.findOneBy({ id });
    if (!medicine)
      throw new NotFoundException('Medicine Inventory Usage not found');

    Object.assign(medicine, updateMedicineInventoryUsageDto);
    await this.medicineInvenUsageRepo.save(medicine);
    await this.shareMedicineService.calculateAvailableMedicineInventory(
      medicine.medicine_inventory_id,
    );
    return true;
  }

  async remove(id: number) {
    const medicine = await this.medicineInvenUsageRepo.findOneBy({ id });
    if (!medicine)
      throw new NotFoundException('Medicine Inventory Usage not found');
    await this.medicineInvenUsageRepo.remove(medicine);
    await this.shareMedicineService.calculateAvailableMedicineInventory(
      medicine.medicine_inventory_id,
    );
    return true;
  }
}
