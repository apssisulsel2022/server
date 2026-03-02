import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Club } from '../../clubs/entities/club.entity';
import { Tournament } from '../../tournaments/entities/tournament.entity';

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  FINISHED = 'finished',
}

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tournament, { onDelete: 'CASCADE' })
  tournament: Tournament;

  @ManyToOne(() => Club, { onDelete: 'CASCADE' })
  homeTeam: Club;

  @ManyToOne(() => Club, { onDelete: 'CASCADE' })
  awayTeam: Club;

  @Column()
  matchDate: Date;

  @Column()
  venue: string;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.SCHEDULED,
  })
  status: MatchStatus;

  @Column({ nullable: true })
  homeScore: number;

  @Column({ nullable: true })
  awayScore: number;

  @Column('jsonb', { nullable: true })
  goalScorers: { playerId: string; minute: number; teamId: string }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
