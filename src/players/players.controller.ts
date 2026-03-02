import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CLUB_MANAGER)
  @UseInterceptors(FileInterceptor('photo'))
  create(@Body() createPlayerDto: CreatePlayerDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
        createPlayerDto.photoUrl = `/uploads/${file.filename}`;
    }
    // Ensure numeric types are correctly parsed from FormData
    if (typeof createPlayerDto.jerseyNumber === 'string') {
        createPlayerDto.jerseyNumber = parseInt(createPlayerDto.jerseyNumber, 10);
    }
    return this.playersService.create(createPlayerDto);
  }

  @Get()
  findAll(@Query('clubId') clubId?: string) {
    if (clubId) {
        return this.playersService.findByClub(clubId);
    }
    return this.playersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CLUB_MANAGER)
  @UseInterceptors(FileInterceptor('photo'))
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
        updatePlayerDto.photoUrl = `/uploads/${file.filename}`;
    }
    if (updatePlayerDto.jerseyNumber && typeof updatePlayerDto.jerseyNumber === 'string') {
        updatePlayerDto.jerseyNumber = parseInt(updatePlayerDto.jerseyNumber, 10);
    }
    return this.playersService.update(id, updatePlayerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CLUB_MANAGER)
  remove(@Param('id') id: string) {
    return this.playersService.remove(id);
  }
}
