import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Club } from '../../clubs/entities/club.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  position: string;

  @Column()
  jerseyNumber: number;

  @Column({ nullable: true })
  photoUrl: string;

  @ManyToOne(() => Club, (club) => club.players, { onDelete: 'CASCADE' })
  club: Club;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
