import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Club } from '../../clubs/entities/club.entity';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Club, (club) => club.tournaments)
  clubs: Club[];
}
