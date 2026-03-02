import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Club } from '../../clubs/entities/club.entity';
import { Tournament } from '../../tournaments/entities/tournament.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REJECTED = 'rejected',
}

export enum PaymentMethod {
  MANUAL = 'manual',
  GATEWAY = 'gateway',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tournament, { onDelete: 'CASCADE' })
  tournament: Tournament;

  @ManyToOne(() => Club, { onDelete: 'CASCADE' })
  club: Club;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.MANUAL,
  })
  method: PaymentMethod;

  @Column({ nullable: true })
  proofUrl: string;

  @Column({ nullable: true })
  transactionId: string; // For Payment Gateway

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
