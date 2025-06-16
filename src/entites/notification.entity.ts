// notification.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn({ unsigned: true, type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  type?: string;

  @Column({ type: 'timestamp', nullable: true, precision: 0 })
  read_at?: Date;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  user_id?: number;

  @CreateDateColumn({ type: 'timestamp', precision: 0 })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 0 })
  updated_at?: Date;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
