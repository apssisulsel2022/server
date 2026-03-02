import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateClubDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  managerName: string;

  @IsNotEmpty()
  @IsString()
  contactInfo: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}
