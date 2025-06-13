import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicineInventoryUsage } from '../../entites/medicine-inventory-usage.entity';
import { MedicineInventory } from '../../entites/medicine-inventory.entity';
import { Medicine } from 'src/entites/medicine.entity';

@Injectable()
export class ShareMedicineService {
  constructor(
    @InjectRepository(Medicine)
    private readonly medicineRepo: Repository<Medicine>,
    @InjectRepository(MedicineInventory)
    private readonly medicineInvenRepo: Repository<MedicineInventory>,
    @InjectRepository(MedicineInventoryUsage)
    private readonly medicineInvenUsageRepo: Repository<MedicineInventoryUsage>,
  ) {}

  async calculateAvailableMedicine(id: number): Promise<void> {
    const medicine = await this.medicineRepo.findOne({
      where: { id },
      relations: ['inventories'],
    });

    if (!medicine) {
      throw new NotFoundException(`Medicine with ID ${id} not found`);
    }

    // Sum up available_quantity
    const availableQuantity = medicine.inventories.reduce(
      (sum, inventory) =>
        sum + parseInt(inventory.available_quantity.toString()),
      0,
    );

    // Find the earliest expiration_date
    const earliestInventory = await this.medicineInvenRepo.findOne({
      where: { medicine: { id } },
      order: { expiration_date: 'ASC' },
    });

    medicine.available_quantity = availableQuantity;
    medicine.first_expiration_date = earliestInventory?.expiration_date || null;

    await this.medicineRepo.save(medicine);
  }

  async calculateAvailableMedicineInventory(id: number): Promise<void> {
    const medicineInventory = await this.medicineInvenRepo.findOne({
      where: { id },
      relations: ['usages', 'medicine'],
    });

    if (!medicineInventory) {
      throw new NotFoundException(`MedicineInventory with ID ${id} not found`);
    }

    let availableQuantity =
      parseInt(medicineInventory.quantity.toString()) +
      parseInt(medicineInventory.bonus.toString());

    const totalUsage = medicineInventory.usages.reduce(
      (sum, usage) => sum + parseInt(usage.quantity.toString()),
      0,
    );

    availableQuantity += totalUsage;
    medicineInventory.available_quantity = availableQuantity;

    await this.medicineInvenRepo.save(medicineInventory);

    // Call method to update the parent medicine
    await this.calculateAvailableMedicine(medicineInventory.medicine.id);
  }
}
