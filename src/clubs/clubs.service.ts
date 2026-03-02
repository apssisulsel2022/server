import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club } from './entities/club.entity';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private clubsRepository: Repository<Club>,
  ) {}

  create(createClubDto: CreateClubDto) {
    const club = this.clubsRepository.create(createClubDto);
    return this.clubsRepository.save(club);
  }

  findAll() {
    return this.clubsRepository.find();
  }

  async findOne(id: string) {
    const club = await this.clubsRepository.findOne({ where: { id }, relations: ['players', 'tournaments'] });
    if (!club) {
        throw new NotFoundException(`Club with ID ${id} not found`);
    }
    return club;
  }

  async update(id: string, updateClubDto: UpdateClubDto) {
    await this.clubsRepository.update(id, updateClubDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.clubsRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException(`Club with ID ${id} not found`);
    }
  }
}
