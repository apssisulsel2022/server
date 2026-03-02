import { IsNotEmpty, IsString, IsInt, IsUUID, IsDateString, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlayerDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @IsNotEmpty()
  @IsString()
  position: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(99)
  jerseyNumber: number;

  @IsNotEmpty()
  @IsUUID()
  clubId: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}
