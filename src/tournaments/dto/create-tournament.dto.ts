import { IsNotEmpty, IsString, IsDateString, IsNumber, IsEnum, Min, IsOptional } from 'class-validator';
import { TournamentStatus } from '../entities/tournament.entity';
import { Type } from 'class-transformer';

export class CreateTournamentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  ageCategory: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  registrationFee: number;

  @IsOptional()
  @IsEnum(TournamentStatus)
  status?: TournamentStatus;
}
