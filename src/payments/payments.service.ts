import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentDto, UpdatePaymentStatusDto, UploadProofDto } from './dto/create-payment.dto';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Club } from '../clubs/entities/club.entity';
import { Tournament } from '../tournaments/entities/tournament.entity';
import { TournamentsService } from '../tournaments/tournaments.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Club)
    private clubsRepository: Repository<Club>,
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
    private tournamentsService: TournamentsService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const tournament = await this.tournamentsRepository.findOne({ 
        where: { id: createPaymentDto.tournamentId },
        relations: ['clubs']
    });
    if (!tournament) throw new NotFoundException('Tournament not found');

    const club = await this.clubsRepository.findOne({ where: { id: createPaymentDto.clubId } });
    if (!club) throw new NotFoundException('Club not found');

    // Check if already registered
    if (tournament.clubs.some(c => c.id === club.id)) {
        throw new ConflictException('Club already registered for this tournament');
    }

    // Check if pending payment exists
    const existingPayment = await this.paymentsRepository.findOne({
        where: {
            tournament: { id: tournament.id },
            club: { id: club.id },
            status: PaymentStatus.PENDING,
        }
    });

    if (existingPayment) {
        return existingPayment;
    }

    const payment = this.paymentsRepository.create({
      ...createPaymentDto,
      tournament,
      club,
      status: PaymentStatus.PENDING,
    });

    return this.paymentsRepository.save(payment);
  }

  async findAll(clubId?: string) {
    const query = this.paymentsRepository.createQueryBuilder('payment')
        .leftJoinAndSelect('payment.tournament', 'tournament')
        .leftJoinAndSelect('payment.club', 'club')
        .orderBy('payment.createdAt', 'DESC');

    if (clubId) {
        query.where('payment.clubId = :clubId', { clubId });
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['tournament', 'club'],
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async uploadProof(id: string, uploadProofDto: UploadProofDto) {
      const payment = await this.findOne(id);
      if (payment.status !== PaymentStatus.PENDING) {
          throw new BadRequestException('Payment is not pending');
      }
      
      payment.proofUrl = uploadProofDto.proofUrl;
      // You might want to introduce a 'WAITING_VERIFICATION' status, but for now PENDING with proofUrl implies it
      return this.paymentsRepository.save(payment);
  }

  async updateStatus(id: string, updatePaymentStatusDto: UpdatePaymentStatusDto) {
    const payment = await this.findOne(id);
    
    if (payment.status === PaymentStatus.PAID) {
        throw new BadRequestException('Payment already processed');
    }

    payment.status = updatePaymentStatusDto.status;
    await this.paymentsRepository.save(payment);

    if (payment.status === PaymentStatus.PAID) {
        // Register club to tournament
        await this.tournamentsService.registerClub(payment.tournament.id, payment.club.id);
    }

    return payment;
  }
}
