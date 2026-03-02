import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../tournaments/entities/tournament.entity';
import { Match, MatchStatus } from '../matches/entities/match.entity';
import { Player } from '../players/entities/player.entity';
import { MatchesService } from '../matches/matches.service';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    private matchesService: MatchesService,
  ) {}

  async getTournaments() {
    return this.tournamentsRepository.find({
        order: { startDate: 'DESC' },
        where: { status: 'ongoing' } // Or open/finished too, maybe filter by query
    });
  }

  async getTournamentDetails(id: string) {
      const tournament = await this.tournamentsRepository.findOne({ where: { id } });
      const standings = await this.matchesService.getStandings(id);
      
      const matches = await this.matchesRepository.find({
          where: { tournament: { id } },
          relations: ['homeTeam', 'awayTeam'],
          order: { matchDate: 'ASC' }
      });

      // Top Scorers Logic
      const allMatches = await this.matchesRepository.find({
          where: { tournament: { id }, status: MatchStatus.FINISHED }
      });
      
      const scorerMap = new Map<string, { player: any, goals: number }>();
      
      for (const match of allMatches) {
          if (match.goalScorers) {
              for (const goal of match.goalScorers) {
                  if (!scorerMap.has(goal.playerId)) {
                      // Fetch player details (optimized: ideally fetch all involved players once)
                      const player = await this.playersRepository.findOne({ 
                          where: { id: goal.playerId },
                          relations: ['club']
                      });
                      if (player) {
                          scorerMap.set(goal.playerId, { player, goals: 0 });
                      }
                  }
                  
                  if (scorerMap.has(goal.playerId)) {
                      scorerMap.get(goal.playerId)!.goals++;
                  }
              }
          }
      }

      const topScorers = Array.from(scorerMap.values())
          .sort((a, b) => b.goals - a.goals)
          .slice(0, 5); // Top 5

      return {
          tournament,
          standings,
          matches,
          topScorers
      };
  }
}
