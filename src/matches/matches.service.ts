import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchDto, UpdateMatchResultDto } from './dto/create-match.dto';
import { Match, MatchStatus } from './entities/match.entity';
import { Club } from '../clubs/entities/club.entity';
import { Tournament } from '../tournaments/entities/tournament.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(Club)
    private clubsRepository: Repository<Club>,
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    const tournament = await this.tournamentsRepository.findOne({ where: { id: createMatchDto.tournamentId } });
    if (!tournament) throw new NotFoundException('Tournament not found');

    const homeTeam = await this.clubsRepository.findOne({ where: { id: createMatchDto.homeTeamId } });
    if (!homeTeam) throw new NotFoundException('Home team not found');

    const awayTeam = await this.clubsRepository.findOne({ where: { id: createMatchDto.awayTeamId } });
    if (!awayTeam) throw new NotFoundException('Away team not found');

    if (homeTeam.id === awayTeam.id) {
        throw new BadRequestException('Home and away teams cannot be the same');
    }

    const match = this.matchesRepository.create({
      ...createMatchDto,
      tournament,
      homeTeam,
      awayTeam,
      status: MatchStatus.SCHEDULED,
    });

    return this.matchesRepository.save(match);
  }

  findAll(tournamentId?: string) {
    const query = this.matchesRepository.createQueryBuilder('match')
        .leftJoinAndSelect('match.homeTeam', 'homeTeam')
        .leftJoinAndSelect('match.awayTeam', 'awayTeam')
        .leftJoinAndSelect('match.tournament', 'tournament')
        .orderBy('match.matchDate', 'ASC');

    if (tournamentId) {
        query.where('match.tournamentId = :tournamentId', { tournamentId });
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const match = await this.matchesRepository.findOne({
      where: { id },
      relations: ['homeTeam', 'awayTeam', 'tournament'],
    });
    if (!match) throw new NotFoundException('Match not found');
    return match;
  }

  async updateResult(id: string, updateMatchResultDto: UpdateMatchResultDto) {
    const match = await this.findOne(id);
    
    // Here we could add logic to update standings if status changes to FINISHED
    // For now, just update the match result
    
    Object.assign(match, updateMatchResultDto);
    
    return this.matchesRepository.save(match);
  }

  async remove(id: string) {
    const result = await this.matchesRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Match not found');
  }

  async getStandings(tournamentId: string) {
      const matches = await this.matchesRepository.find({
          where: { tournament: { id: tournamentId }, status: MatchStatus.FINISHED },
          relations: ['homeTeam', 'awayTeam']
      });

      const standings: Record<string, any> = {};

      // Initialize standings for all clubs in the tournament (fetch from tournament clubs if needed)
      // For simplicity, we build it from played matches, but ideally we should initialize with all registered clubs
      // Let's just process played matches for now.
      
      const processMatch = (team: Club, goalsFor: number, goalsAgainst: number) => {
          if (!standings[team.id]) {
              standings[team.id] = {
                  clubId: team.id,
                  clubName: team.name,
                  played: 0,
                  won: 0,
                  drawn: 0,
                  lost: 0,
                  goalsFor: 0,
                  goalsAgainst: 0,
                  points: 0,
              };
          }
          const stats = standings[team.id];
          stats.played++;
          stats.goalsFor += goalsFor;
          stats.goalsAgainst += goalsAgainst;
          
          if (goalsFor > goalsAgainst) {
              stats.won++;
              stats.points += 3;
          } else if (goalsFor === goalsAgainst) {
              stats.drawn++;
              stats.points += 1;
          } else {
              stats.lost++;
          }
      };

      for (const match of matches) {
          if (match.homeScore !== null && match.awayScore !== null) {
              processMatch(match.homeTeam, match.homeScore, match.awayScore);
              processMatch(match.awayTeam, match.awayScore, match.homeScore);
          }
      }

      return Object.values(standings).sort((a: any, b: any) => {
          if (b.points !== a.points) return b.points - a.points;
          const gdA = a.goalsFor - a.goalsAgainst;
          const gdB = b.goalsFor - b.goalsAgainst;
          return gdB - gdA;
      });
  }
}
