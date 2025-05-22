import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Clinic } from './clinic.entity';

@Entity('user_clinics')
export class UserClinic {
  @PrimaryColumn({ name: 'user_id', type: 'bigint', unsigned: true })
  user_id: number;

  @PrimaryColumn({ name: 'clinic_id', type: 'bigint', unsigned: true })
  clinic_id: number;

  @ManyToOne(() => User, (user) => user.clinics, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Clinic, (clinic) => clinic.users, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'clinic_id', referencedColumnName: 'id' })
  clinic: Clinic;
}
