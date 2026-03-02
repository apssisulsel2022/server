import { Controller, Get, Post, Body, Patch, Param, UseGuards, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentStatusDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_MANAGER)
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_TOURNAMENT, UserRole.CLUB_MANAGER)
  findAll(@Query('clubId') clubId?: string) {
    return this.paymentsService.findAll(clubId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id/upload-proof')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_MANAGER)
  @UseInterceptors(FileInterceptor('proof'))
  uploadProof(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    const proofUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.paymentsService.uploadProof(id, { proofUrl });
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_TOURNAMENT)
  updateStatus(@Param('id') id: string, @Body() updatePaymentStatusDto: UpdatePaymentStatusDto) {
    return this.paymentsService.updateStatus(id, updatePaymentStatusDto);
  }
}
