import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Club } from '../../clubs/entities/club.entity';
import { Group } from './group.entity';

export enum TournamentStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  ONGOING = 'ongoing',
  FINISHED = 'finished',
}

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  ageCategory: string; // e.g., "U-12", "Senior"

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  location: string;

  @Column('decimal', { precision: 10, scale: 2 })
  registrationFee: number;

  @Column({
    type: 'enum',
    enum: TournamentStatus,
    default: TournamentStatus.DRAFT,
  })
  status: TournamentStatus;

  @ManyToMany(() => Club, (club) => club.tournaments)
  @JoinTable()
  clubs: Club[];

  @OneToMany(() => Group, (group) => group.tournament)
  groups: Group[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
