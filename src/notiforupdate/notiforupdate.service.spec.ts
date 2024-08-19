import { Test, TestingModule } from '@nestjs/testing';
import { NotiforupdateService } from './notiforupdate.service';

describe('NotiforupdateService', () => {
  let service: NotiforupdateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotiforupdateService],
    }).compile();

    service = module.get<NotiforupdateService>(NotiforupdateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
