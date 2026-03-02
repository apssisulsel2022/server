import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { Match } from './entities/match.entity';
import { Club } from '../clubs/entities/club.entity';
import { Tournament } from '../tournaments/entities/tournament.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, Club, Tournament]),
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
