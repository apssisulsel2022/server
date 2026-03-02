import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { Tournament } from './entities/tournament.entity';
import { Group } from './entities/group.entity';
import { Club } from '../clubs/entities/club.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament, Group, Club]),
  ],
  controllers: [TournamentsController],
  providers: [TournamentsService],
})
export class TournamentsModule {}
