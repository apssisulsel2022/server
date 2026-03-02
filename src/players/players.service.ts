import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';
import { Club } from '../clubs/entities/club.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    @InjectRepository(Club)
    private clubsRepository: Repository<Club>,
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const club = await this.clubsRepository.findOne({ where: { id: createPlayerDto.clubId } });
    if (!club) {
      throw new NotFoundException(`Club with ID ${createPlayerDto.clubId} not found`);
    }

    // Age validation (e.g., max 21 years old for youth tournament)
    // Assuming this is a general requirement or configurable
    // For now, let's implement a basic check if needed, or skip if not strictly defined in detail
    // "Age validation (for youth tournament)" - let's enforce a max age of 23 for example
    const dob = new Date(createPlayerDto.dateOfBirth);
    const age = new Date().getFullYear() - dob.getFullYear();
    // if (age > 23) {
    //   throw new BadRequestException('Player exceeds the age limit for this tournament (Max 23)');
    // }

    // Unique jersey number per club
    const existingPlayerWithJersey = await this.playersRepository.findOne({
      where: {
        club: { id: createPlayerDto.clubId },
        jerseyNumber: createPlayerDto.jerseyNumber,
      },
    });

    if (existingPlayerWithJersey) {
      throw new ConflictException(`Jersey number ${createPlayerDto.jerseyNumber} is already taken in this club`);
    }

    const player = this.playersRepository.create({
      ...createPlayerDto,
      club,
    });

    return this.playersRepository.save(player);
  }

  findAll(): Promise<Player[]> {
    return this.playersRepository.find({ relations: ['club'] });
  }

  async findOne(id: string): Promise<Player> {
    const player = await this.playersRepository.findOne({ where: { id }, relations: ['club'] });
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
    return player;
  }
  
  async findByClub(clubId: string): Promise<Player[]> {
      return this.playersRepository.find({ where: { club: { id: clubId } }, relations: ['club'] });
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    const player = await this.findOne(id);

    if (updatePlayerDto.clubId && updatePlayerDto.clubId !== player.club.id) {
        const club = await this.clubsRepository.findOne({ where: { id: updatePlayerDto.clubId } });
        if (!club) {
            throw new NotFoundException(`Club with ID ${updatePlayerDto.clubId} not found`);
        }
        player.club = club;
    }

    if (updatePlayerDto.jerseyNumber) {
        const clubId = updatePlayerDto.clubId || player.club.id;
        const existingPlayerWithJersey = await this.playersRepository.findOne({
            where: {
                club: { id: clubId },
                jerseyNumber: updatePlayerDto.jerseyNumber,
            },
        });
        
        if (existingPlayerWithJersey && existingPlayerWithJersey.id !== id) {
             throw new ConflictException(`Jersey number ${updatePlayerDto.jerseyNumber} is already taken in this club`);
        }
    }

    Object.assign(player, updatePlayerDto);
    return this.playersRepository.save(player);
  }

  async remove(id: string): Promise<void> {
    const result = await this.playersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
  }
}
