import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { Medicine } from '../entites/medicine.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Label } from '../entites/label.entity';
import { Category } from '../entites/category.entity';
import { Brand } from 'src/entites/brand.entity';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectRepository(Medicine)
    private readonly medicinRepo: Repository<Medicine>,
    @InjectRepository(Label)
    private readonly labelCateRepo: Repository<Label>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
  ) { }

  async create(createMedicineDto: CreateMedicineDto) {
    const medicine = this.medicinRepo.create(createMedicineDto);
    const brandIds = createMedicineDto.brand_ids?.split(',');

    if (brandIds && brandIds.length > 0) {
      // Sync brand id
      const newBrands = await this.brandRepo.findBy({
        id: In(brandIds),
      });
      medicine.brands = newBrands;
    }

    const categoryIds = createMedicineDto.category_ids?.split(',');
    if (categoryIds && categoryIds.length > 0) {
      // Sync category id
      const newCategory = await this.categoryRepo.findBy({
        id: In(categoryIds),
      });
      medicine.categories = newCategory;
    }
    return await this.medicinRepo.save(medicine);
  }

  async findAll(@Query() query) {
    const take = !isNaN(Number(query.limit)) && Number(query.limit) > 0 ? Number(query.limit) : 10;
    const page = !isNaN(Number(query.page)) && Number(query.page) > 0 ? Number(query.page) : 1;
    const skip = (page - 1) * take;

    const qb = this.medicinRepo.createQueryBuilder('medicine')
      .leftJoinAndSelect('medicine.brands', 'brand')
      .leftJoinAndSelect('medicine.categories', 'category');

    // Search functionality
    if (query.search) {
      qb.andWhere(
        '(medicine.name LIKE :search OR brand.name LIKE :search OR category.name LIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.clinic_id) {
      qb.andWhere('medicine.clinic_id = :clinicId', { clinicId: query.clinic_id });
    }

    if (query.active) {
      qb.andWhere('medicine.active = :active', { active: query.active });
    }

    const orderableFieldsMap = {
      name: 'medicine.name',
      first_expiration_date: 'medicine.first_expiration_date',
      available_quantity: 'medicine.available_quantity',
      brand_name: 'brand.name',
      category_name: 'category.name',
      active: 'medicine.active',
    };

    const orderByField =
      query.orderBy && orderableFieldsMap[query.orderBy]
        ? orderableFieldsMap[query.orderBy]
        : 'medicine.id'; // Default fallback

    const orderDirection =
      query.order && ['ASC', 'DESC'].includes(query.order.toUpperCase())
        ? query.order.toUpperCase()
        : 'DESC';

    qb.orderBy(orderByField, orderDirection as 'ASC' | 'DESC');

    // Apply pagination
    qb.skip(skip).take(take);

    // Fetch the results and total count
    const data = await qb.getMany(); // Use getMany() to get properly mapped entities
    const total = await qb.getCount();

    return {
      data,
      pagination: {
        page,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async getFormSelection(clinicId : number) {
    let categories : Category[] = [];
    let brands : Brand[] = [];
    let uoms : any[] = [];
    let frequencies : any[] = [];
    let purposes : any[] = [];

    if (clinicId) {
      categories = await this.categoryRepo.findBy({clinic_id : clinicId });
      brands = await this.brandRepo.findBy({clinic_id : clinicId });
      const labels = await this.labelCateRepo.findBy({clinic_id : clinicId });
      labels.forEach(label => {
        if (label.type === 1) {
          uoms.push({label : label.name, value: label.name});
        }
        if (label.type === 2) {
          frequencies.push({label : label.name, value: label.name});
        }
        if (label.type === 3) {
          purposes.push({label : label.name, value: label.name});
        }
      });
    }

    return {
      brands : brands.map(brand => {return {label: brand.name, value: brand.id}}),
      categories: categories.map(category => {return {label: category.name, value: category.id}}),
      uoms,
      frequencies,
      purposes
    }
  }

  async findOne(id: number) {
    const medicine = await this.medicinRepo.findOne({
      where : {
        id
      },
      relations : ['brands', 'categories']
    });

    const type = medicine?.type ? parseInt(medicine?.type) : null;

    return {
      data : {
        category_ids : medicine?.categories.map((category) => {
          return category.id;
        }),
        brand_ids : medicine?.brands.map((brand) => {
          return brand.id;
        }),
        ...medicine,
        type
      }
    }
  }

  async update(id: number, updateMedicineDto: UpdateMedicineDto) {
    const medicine = await this.medicinRepo.findOneBy({ id });
    if (!medicine) throw new NotFoundException('Medicine not found');

    Object.assign(medicine, updateMedicineDto);
    const brandIds = updateMedicineDto.brand_ids?.split(',');
    if (brandIds && brandIds.length > 0) {
      // Sync brand id
      const newBrands = await this.brandRepo.findBy({
        id: In(brandIds),
      });
      medicine.brands = newBrands;
    }

    const categoryIds = updateMedicineDto.category_ids?.split(',');
    if (categoryIds && categoryIds.length > 0) {
      // Sync category id
      const newCategory = await this.categoryRepo.findBy({
        id: In(categoryIds),
      });
      medicine.categories = newCategory;
    }

    return await this.medicinRepo.save(medicine);
  }

  async remove(id: number) {
    const medicine = await this.medicinRepo.findOneBy({ id });
    if (!medicine) throw new NotFoundException('Medicine not found');
    return await this.medicinRepo.remove(medicine);
  }

  async updateStatus(id: number, active : boolean) {
    const medicine = await this.medicinRepo.findOneBy({ id });
    if (!medicine) throw new NotFoundException('Medicine not found');

    medicine.active = active;
    return await this.medicinRepo.save(medicine);
  }
}
