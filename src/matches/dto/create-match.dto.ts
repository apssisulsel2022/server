import { IsNotEmpty, IsUUID, IsDateString, IsString, IsOptional, IsNumber, IsEnum, Min, IsArray } from 'class-validator';
import { MatchStatus } from '../entities/match.entity';

export class CreateMatchDto {
  @IsNotEmpty()
  @IsUUID()
  tournamentId: string;

  @IsNotEmpty()
  @IsUUID()
  homeTeamId: string;

  @IsNotEmpty()
  @IsUUID()
  awayTeamId: string;

  @IsNotEmpty()
  @IsDateString()
  matchDate: string;

  @IsNotEmpty()
  @IsString()
  venue: string;
}

export class UpdateMatchResultDto {
  @IsNotEmpty()
  @IsEnum(MatchStatus)
  status: MatchStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  homeScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  awayScore?: number;

  @IsOptional()
  @IsArray()
  goalScorers?: { playerId: string; minute: number; teamId: string }[];
}
