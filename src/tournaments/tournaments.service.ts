import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Tournament, TournamentStatus } from './entities/tournament.entity';
import { Group } from './entities/group.entity';
import { Club } from '../clubs/entities/club.entity';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(Club)
    private clubsRepository: Repository<Club>,
  ) {}

  create(createTournamentDto: CreateTournamentDto) {
    const tournament = this.tournamentsRepository.create(createTournamentDto);
    return this.tournamentsRepository.save(tournament);
  }

  findAll() {
    return this.tournamentsRepository.find({
        order: { startDate: 'DESC' },
    });
  }

  async findOne(id: string) {
    const tournament = await this.tournamentsRepository.findOne({ 
        where: { id },
        relations: ['clubs', 'groups', 'groups.clubs'] 
    });
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }
    return tournament;
  }

  async update(id: string, updateTournamentDto: UpdateTournamentDto) {
    await this.tournamentsRepository.update(id, updateTournamentDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.tournamentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }
  }

  async registerClub(tournamentId: string, clubId: string) {
      const tournament = await this.findOne(tournamentId);
      const club = await this.clubsRepository.findOne({ where: { id: clubId } });

      if (!club) {
          throw new NotFoundException(`Club with ID ${clubId} not found`);
      }

      // Check if already registered
      if (tournament.clubs.some(c => c.id === club.id)) {
          throw new ConflictException('Club already registered for this tournament');
      }

      if (tournament.status !== TournamentStatus.OPEN && tournament.status !== TournamentStatus.DRAFT) {
          throw new BadRequestException('Tournament registration is closed');
      }

      tournament.clubs.push(club);
      return this.tournamentsRepository.save(tournament);
  }

  async generateGroups(tournamentId: string, numberOfGroups: number) {
      const tournament = await this.findOne(tournamentId);
      
      if (tournament.clubs.length < numberOfGroups) {
          throw new BadRequestException('Not enough clubs to generate groups');
      }

      // Clear existing groups
      await this.groupsRepository.delete({ tournament: { id: tournamentId } });

      // Create new groups
      const groups: Group[] = [];
      for (let i = 0; i < numberOfGroups; i++) {
          const group = this.groupsRepository.create({
              name: `Group ${String.fromCharCode(65 + i)}`, // Group A, Group B...
              tournament: tournament,
              clubs: [],
          });
          groups.push(await this.groupsRepository.save(group));
      }

      // Distribute clubs (Round Robin distribution)
      const shuffledClubs = [...tournament.clubs].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < shuffledClubs.length; i++) {
          const groupIndex = i % numberOfGroups;
          groups[groupIndex].clubs.push(shuffledClubs[i]);
      }

      // Save groups with assigned clubs
      for (const group of groups) {
          await this.groupsRepository.save(group);
      }

      return this.findOne(tournamentId);
  }
}
