import { Injectable } from '@nestjs/common';
import { CreateMedicinePurchaseDto } from './dto/create-medicine-purchase.dto';
import { UpdateMedicinePurchaseDto } from './dto/update-medicine-purchase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseMedicine } from '../entites/purchase-medicines.entity';
import { Repository } from 'typeorm';
import { DatabaseService } from '../shared/database/database.service';
import { PurchasedMedicine } from '../entites/purchased-medicines.entity';
import { Label } from 'src/entites/label.entity';
import { Brand } from 'src/entites/brand.entity';

@Injectable()
export class MedicinePurchaseService {

  constructor(
    @InjectRepository(PurchaseMedicine)
    private readonly purchaseRepo: Repository<PurchaseMedicine>,
    @InjectRepository(PurchasedMedicine)
    private readonly purchasedRepo: Repository<PurchasedMedicine>,
    @InjectRepository(Label)
    private readonly labelRepo: Repository<Label>,
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
    private dataTable: DatabaseService,
  ) { }

  create(createMedicinePurchaseDto: CreateMedicinePurchaseDto) {
    return 'This action adds a new medicinePurchase';
  }

  async findAll(query) {
    return await this.dataTable.paginateAndSearch<PurchaseMedicine>({
      repository: this.purchaseRepo,
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

  findOne(id: number) {
    return `This action returns a #${id} medicinePurchase`;
  }

  update(id: number, updateMedicinePurchaseDto: UpdateMedicinePurchaseDto) {
    return `This action updates a #${id} medicinePurchase`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicinePurchase`;
  }

  async getAllSelect(clinicId : number) {
    const labels = await this.labelRepo.findBy({clinic_id : clinicId});
    const suppliers = await this.brandRepo.findBy({clinic_id : clinicId});

    return {
      labels : labels.map(label => { return {label: label.name, value: label.id}}),
      suppliers : suppliers.map(supplier => { return {label: supplier.name, value: supplier.id}})
    }
  }
}
