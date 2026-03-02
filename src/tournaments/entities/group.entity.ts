import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Tournament } from './tournament.entity';
import { Club } from '../../clubs/entities/club.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Group A, Group B, etc.

  @ManyToOne(() => Tournament, (tournament) => tournament.groups, { onDelete: 'CASCADE' })
  tournament: Tournament;

  @ManyToMany(() => Club)
  @JoinTable()
  clubs: Club[];
}
