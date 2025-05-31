import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { Medicine } from './medicine.entity';
import { Brand } from './brand.entity';

@Entity('medicines_brands')
export class MedicineBrand {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  medicine_id: number;

  @PrimaryColumn({ type: 'bigint', unsigned: true })
  brand_id: number;

  @ManyToOne(() => Medicine, (medicine) => medicine.categories)
  @JoinColumn({ name: 'medicine_id', referencedColumnName: 'id' })
  medicine: Medicine;

  @ManyToOne(() => Brand, (brand) => brand.medicines)
  @JoinColumn({ name: 'brand_id', referencedColumnName: 'id',  })
  brand: Brand;
}
