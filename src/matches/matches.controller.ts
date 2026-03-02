import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto, UpdateMatchResultDto } from './dto/create-match.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_TOURNAMENT)
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

  @Get()
  findAll(@Query('tournamentId') tournamentId?: string) {
    return this.matchesService.findAll(tournamentId);
  }

  @Get('standings/:tournamentId')
  getStandings(@Param('tournamentId') tournamentId: string) {
      return this.matchesService.getStandings(tournamentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(id);
  }

  @Patch(':id/result')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_TOURNAMENT)
  updateResult(@Param('id') id: string, @Body() updateMatchResultDto: UpdateMatchResultDto) {
    return this.matchesService.updateResult(id, updateMatchResultDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_TOURNAMENT)
  remove(@Param('id') id: string) {
    return this.matchesService.remove(id);
  }
}
