import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Appointment } from './appointment.entitty';
import { Visit } from './visit.entity';
import { TransactionInvoice } from './transaction-invoice.entity';
import { Review } from './review.entity';
import { PatientMedicalRecord } from './patient-medical-record.entity';
import { SmartPatientCard } from './smart-patient-card.entity';
import { Address } from './address.entity';

@Entity('patients')
@Index('patients_template_id_foreign', ['template_id'])
@Index('patients_user_id_foreign', ['user_id'])
export class Patient {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'patient_unique_id', type: 'varchar', length: 191 })
  patient_unique_id: string;

  @Column({ name: 'patient_mrn', type: 'varchar', length: 255 })
  patient_mrn: string;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  user_id: number;

  @Column({
    name: 'template_id',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  template_id?: number | null;

  @Column({ name: 'qr_code', type: 'varchar', length: 255, nullable: true })
  qr_code?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    precision: 0,
    nullable: true,
  })
  created_at?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    precision: 0,
    nullable: true,
  })
  updated_at?: Date;

  // Relationships
  @OneToOne(() => User, (user) => user.patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @OneToMany(() => Visit, (visit) => visit.patient)
  visits: Visit[];

  @OneToMany(() => TransactionInvoice, (tran) => tran.patient)
  transactions: TransactionInvoice[];

  @OneToMany(() => Review, (review) => review.patient)
  reviews: Review[];

  @OneToOne(() => PatientMedicalRecord, (record) => record.patient)
  medical_record: PatientMedicalRecord;

  @ManyToOne(() => SmartPatientCard, (smartCard) => smartCard.patients)
  @JoinColumn({ name: 'template_id', referencedColumnName: 'id' })
  smart_patient_card: SmartPatientCard;

  address: Address | null;
}
