import { Entity, ManyToOne, JoinColumn, Index, PrimaryColumn } from 'typeorm';
import { Doctor } from './doctor.entity';
import { Specialization } from './specilization.entity';

@Entity('doctor_specialization')
@Index('doctor_specialization_doctor_id_foreign', ['doctor_id'])
@Index('doctor_specialization_specialization_id_foreign', ['specialization_id'])
export class DoctorSpecialization {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  doctor_id: string;

  @PrimaryColumn({ type: 'bigint', unsigned: true })
  specialization_id: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.doctorSpecializations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ManyToOne(
    () => Specialization,
    (specialization) => specialization.doctorSpecializations,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'specialization_id' })
  specialization: Specialization;
}
