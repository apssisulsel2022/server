import { IsNotEmpty, IsUUID, IsNumber, IsEnum, Min, IsOptional, IsString } from 'class-validator';
import { PaymentStatus, PaymentMethod } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsUUID()
  tournamentId: string;

  @IsNotEmpty()
  @IsUUID()
  clubId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;
}

export class UpdatePaymentStatusDto {
  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}

export class UploadProofDto {
    @IsOptional()
    @IsString()
    proofUrl?: string;
}
