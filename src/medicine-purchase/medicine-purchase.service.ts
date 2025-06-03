import { Injectable } from '@nestjs/common';
import { CreateMedicinePurchaseDto } from './dto/create-medicine-purchase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseMedicine } from '../entites/purchase-medicines.entity';
import { EntityManager, Repository } from 'typeorm';
import { DatabaseService } from '../shared/database/database.service';
import { PurchasedMedicine } from '../entites/purchased-medicines.entity';
import { Label } from 'src/entites/label.entity';
import { Brand } from 'src/entites/brand.entity';

@Injectable()
export class MedicinePurchaseService {
  constructor(
    @InjectRepository(PurchaseMedicine)
    private readonly purchaseMedicineRepository: Repository<PurchaseMedicine>,
    @InjectRepository(PurchasedMedicine)
    private readonly purchasedMedicineRepository: Repository<PurchasedMedicine>,
    @InjectRepository(Label)
    private readonly labelRepo: Repository<Label>,
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
    private dataTable: DatabaseService,
  ) { }

  async create(createMedicinePurchaseDto: CreateMedicinePurchaseDto): Promise<PurchaseMedicine> {
    return await this.purchaseMedicineRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        // 1. Create PurchaseMedicine record
        const purchaseMedicine = this.purchaseMedicineRepository.create(createMedicinePurchaseDto);
        purchaseMedicine.purchase_no = await this.generateUniquePurchaseNumber();
        const savedPurchaseMedicine = await transactionalEntityManager.save(purchaseMedicine);

        // 2. Create PurchasedMedicines records and associate with the created PurchaseMedicine
        const purchasedMedicinesPromises = createMedicinePurchaseDto.medicines.map((medicineDTO) => {
          const purchasedMedicine = this.purchasedMedicineRepository.create({
            ...medicineDTO,
            purchase_medicines_id: savedPurchaseMedicine.id,
          });
          return transactionalEntityManager.save(purchasedMedicine);
        });

        await Promise.all(purchasedMedicinesPromises);
        return savedPurchaseMedicine;
      }
    );
  }

  async findAll(query) {
    return await this.dataTable.paginateAndSearch<PurchaseMedicine>({
      repository: this.purchaseMedicineRepository,
      alias: 'purchase_medicine',
      query: {
        ...query,
      },
      searchFields: ['created_at', 'brand.name', 'purchase_no', 'tax', 'total', 'net_amount', 'discount'],
      filterFields: ['clinic_id'],
      allowedOrderFields: ['created_at', 'brand.name','purchase_no', 'tax', 'total', 'net_amount', 'discount'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields: [],
      relations: ['brand'],
    });
  }

  async findOne(id: number) {
    const purchaseMedicine = await this.purchaseMedicineRepository.findOne({
      where: { id },
      relations: ['brand', 'purchased_medicines', 'purchased_medicines.label', 'purchased_medicines.medicine'],
    });

    return {
      data : purchaseMedicine
    };
  }

  async remove(id: number) {
    await this.purchaseMedicineRepository.manager.transaction(async (transactionalEntityManager: EntityManager) => {
      
      const purchaseMedicine = await transactionalEntityManager.findOne(PurchaseMedicine, {
        where: { id },
        relations: ['purchased_medicines'],
      });

      if (!purchaseMedicine) {
        throw new Error('PurchaseMedicine record not found');
      }

      if (purchaseMedicine.purchased_medicines.length > 0) {
        await transactionalEntityManager.delete(PurchasedMedicine, {
          purchase_medicines_id: id,
        });
      }

      await transactionalEntityManager.delete(PurchaseMedicine, id);
    });
  }

  async getMedicineForExport(clinicId : number) {
    const medicines = await this.purchaseMedicineRepository.find({
      where : {
        clinic_id: clinicId
      }
    });
    return medicines;
  }

  async getAllSelect(clinicId : number) {
    const labels = await this.labelRepo.findBy({clinic_id : clinicId});
    const suppliers = await this.brandRepo.findBy({clinic_id : clinicId});

    return {
      labels : labels.map(label => { return {label: label.name, value: label.id}}),
      suppliers : suppliers.map(supplier => { return {label: supplier.name, value: supplier.id}})
    }
  }

  async generateUniquePurchaseNumber() {
    let code: number = 0;
    let isUnique = false;

    while (!isUnique) {
      code = Math.floor(Math.random() * 900000) + 100000;

      const existingPurchase = await this.purchaseMedicineRepository.findOne({
        where: { purchase_no: code },
      });

      if (!existingPurchase) {
        isUnique = true;
      }
    }
    return code;
  }
}
