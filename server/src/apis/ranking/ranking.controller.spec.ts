import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import * as request from 'supertest'; // supertest 임포트

describe('RankingController', () => {
  let app: INestApplication;
  let rankingService: RankingService;

  const mockRankingService = {
    getRanking: jest.fn().mockResolvedValue([
      { id: 1, nickname: 'user1', point: 100, rank: 1 },
      { id: 2, nickname: 'user2', point: 90, rank: 2 },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingController],
      providers: [
        {
          provide: RankingService,
          useValue: mockRankingService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    rankingService = module.get<RankingService>(RankingService);
  });

  it('사용자 랭킹을 배열 형태로 리턴하나?', async () => {
    const response = await request(app.getHttpServer()).get('/ranking').expect(HttpStatus.OK); // supertest를 사용하여 HTTP GET 요청 보내기

    expect(response.body).toEqual([
      { id: 1, nickname: 'user1', point: 100, rank: 1 },
      { id: 2, nickname: 'user2', point: 90, rank: 2 },
    ]);
    expect(rankingService.getRanking).toHaveBeenCalled();
  });

  afterAll(async () => {
    await app.close();
  });
});
