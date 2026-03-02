import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('public/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('tournaments')
  getTournaments() {
    return this.dashboardService.getTournaments();
  }

  @Get('tournaments/:id')
  getTournamentDetails(@Param('id') id: string) {
    return this.dashboardService.getTournamentDetails(id);
  }
}
