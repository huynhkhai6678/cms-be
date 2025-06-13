import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicineInventoryDto } from './dto/create-medicine-inventory.dto';
import { UpdateMedicineInventoryDto } from './dto/update-medicine-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicineInventory } from '../entites/medicine-inventory.entity';
import { DatabaseService } from '../shared/database/database.service';
import * as moment from 'moment';
import { ShareMedicineService } from '../shared/share-medicine/share-medicine.service';

@Injectable()
export class MedicineInventoriesService {
  constructor(
    @InjectRepository(MedicineInventory)
    private readonly medicineInvenRepo: Repository<MedicineInventory>,
    private dataTable: DatabaseService,
    private shareMedicineService: ShareMedicineService,
  ) {}

  async create(createMedicineInventoryDto: CreateMedicineInventoryDto) {
    const dto = this.medicineInvenRepo.create(createMedicineInventoryDto);
    dto.expiration_date = moment(
      createMedicineInventoryDto.expiration_date,
      'DD/MM/YYYY',
    ).toDate();
    await this.medicineInvenRepo.save(dto);
    await this.shareMedicineService.calculateAvailableMedicine(dto.medicine_id);
    return true;
  }

  async findAll(query) {
    return await this.dataTable.paginateAndSearch<MedicineInventory>({
      repository: this.medicineInvenRepo,
      alias: 'medicine_inventory',
      query: {
        ...query,
      },
      searchFields: ['name', 'batch_number'],
      filterFields: ['medicine_id'],
      allowedOrderFields: ['name', 'batch_number'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields: [],
      relations: [],
    });
  }

  async findOne(id: number) {
    const data = await this.medicineInvenRepo.findOne({
      where: {
        id,
      },
      relations: ['medicine'],
    });
    return {
      data,
    };
  }

  async update(
    id: number,
    updateMedicineInventoryDto: UpdateMedicineInventoryDto,
  ) {
    const medicine = await this.medicineInvenRepo.findOneBy({ id });
    if (!medicine) throw new NotFoundException('Medicine Inventory not found');

    Object.assign(medicine, updateMedicineInventoryDto);
    medicine.expiration_date = moment(
      updateMedicineInventoryDto.expiration_date,
      'DD/MM/YYYY',
    ).toDate();
    await this.medicineInvenRepo.save(medicine);
    await this.shareMedicineService.calculateAvailableMedicine(
      medicine.medicine_id,
    );
    return true;
  }

  async remove(id: number) {
    const medicine = await this.medicineInvenRepo.findOneBy({ id });
    if (!medicine) throw new NotFoundException('Medicine Inventory not found');
    await this.medicineInvenRepo.remove(medicine);
    await this.shareMedicineService.calculateAvailableMedicine(
      medicine.medicine_id,
    );
    return true;
  }
}
