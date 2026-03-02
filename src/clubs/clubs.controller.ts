import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CLUB_MANAGER)
  @UseInterceptors(FileInterceptor('logo'))
  create(@Body() createClubDto: CreateClubDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
        createClubDto.logoUrl = `/uploads/${file.filename}`;
    }
    return this.clubsService.create(createClubDto);
  }

  @Get()
  findAll() {
    return this.clubsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CLUB_MANAGER)
  @UseInterceptors(FileInterceptor('logo'))
  update(@Param('id') id: string, @Body() updateClubDto: UpdateClubDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
        updateClubDto.logoUrl = `/uploads/${file.filename}`;
    }
    return this.clubsService.update(id, updateClubDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CLUB_MANAGER)
  remove(@Param('id') id: string) {
    return this.clubsService.remove(id);
  }
}
