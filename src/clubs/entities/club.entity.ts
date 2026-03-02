import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Player } from '../../players/entities/player.entity';
import { Tournament } from '../../tournaments/entities/tournament.entity';

@Entity()
export class Club {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column()
  managerName: string;

  @Column()
  contactInfo: string;

  @OneToMany(() => Player, (player) => player.club)
  players: Player[];

  @ManyToMany(() => Tournament, (tournament) => tournament.clubs)
  @JoinTable()
  tournaments: Tournament[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
