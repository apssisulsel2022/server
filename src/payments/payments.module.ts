import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payment.entity';
import { Club } from '../clubs/entities/club.entity';
import { Tournament } from '../tournaments/entities/tournament.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TournamentsModule } from '../tournaments/tournaments.module';
import { TournamentsService } from '../tournaments/tournaments.service';
import { Group } from '../tournaments/entities/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Club, Tournament, Group]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, TournamentsService],
})
export class PaymentsModule {}
