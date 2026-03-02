import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Tournament } from '../tournaments/entities/tournament.entity';
import { Match } from '../matches/entities/match.entity';
import { Player } from '../players/entities/player.entity';
import { MatchesService } from '../matches/matches.service';
import { Club } from '../clubs/entities/club.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament, Match, Player, Club]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService, MatchesService],
})
export class DashboardModule {}
