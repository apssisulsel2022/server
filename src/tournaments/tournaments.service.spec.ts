import { Test, TestingModule } from '@nestjs/testing';
import { TournamentsService } from './tournaments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tournament, TournamentStatus } from './entities/tournament.entity';
import { Group } from './entities/group.entity';
import { Club } from '../clubs/entities/club.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';

const mockTournament = {
  id: '1',
  name: 'Test Tournament',
  status: TournamentStatus.OPEN,
  clubs: [],
  groups: [],
};

const mockClub = {
  id: 'club1',
  name: 'Test Club',
};

describe('TournamentsService', () => {
  let service: TournamentsService;
  let tournamentRepo: Repository<Tournament>;
  let groupRepo: Repository<Group>;
  let clubRepo: Repository<Club>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentsService,
        {
          provide: getRepositoryToken(Tournament),
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((tournament) => Promise.resolve({ id: '1', ...tournament })),
            find: jest.fn().mockResolvedValue([mockTournament]),
            findOne: jest.fn().mockImplementation(({ where: { id } }) => {
                if (id === '1') return Promise.resolve({ ...mockTournament, clubs: [] });
                return Promise.resolve(null);
            }),
            update: jest.fn(),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: getRepositoryToken(Group),
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((group) => Promise.resolve({ id: 'g1', ...group })),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Club),
          useValue: {
            findOne: jest.fn().mockImplementation(({ where: { id } }) => {
                if (id === 'club1') return Promise.resolve(mockClub);
                return Promise.resolve(null);
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TournamentsService>(TournamentsService);
    tournamentRepo = module.get<Repository<Tournament>>(getRepositoryToken(Tournament));
    groupRepo = module.get<Repository<Group>>(getRepositoryToken(Group));
    clubRepo = module.get<Repository<Club>>(getRepositoryToken(Club));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tournament', async () => {
      const dto = { 
          name: 'New Tournament', 
          ageCategory: 'U-12', 
          startDate: '2023-01-01', 
          endDate: '2023-01-10', 
          location: 'Stadium', 
          registrationFee: 100 
      };
      expect(await service.create(dto)).toEqual({
        id: '1',
        ...dto,
      });
    });
  });

  describe('registerClub', () => {
      it('should register a club successfully', async () => {
          const result = await service.registerClub('1', 'club1');
          expect(result.clubs).toContainEqual(mockClub);
      });

      it('should throw if tournament not found', async () => {
          jest.spyOn(tournamentRepo, 'findOne').mockResolvedValueOnce(null);
          await expect(service.registerClub('999', 'club1')).rejects.toThrow(NotFoundException);
      });
  });
});
