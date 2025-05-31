import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { Medicine } from './medicine.entity';

@Entity('medicines_categories')
export class MedicineCategory {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  medicine_id: number;

  @PrimaryColumn({ type: 'bigint', unsigned: true })
  category_id: number;

  @ManyToOne(() => Medicine, (medicine) => medicine.categories)
  @JoinColumn({ name: 'medicine_id', referencedColumnName: 'id' })
  medicine: Medicine;

  @ManyToOne(() => Category, (category) => category.medicines)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: Category;
}
