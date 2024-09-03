import { Test, TestingModule } from '@nestjs/testing';
import { NotiforupdateController } from './notiforupdate.controller';
import { NotiforupdateService } from './notiforupdate.service';

describe('NotiforupdateController', () => {
  let controller: NotiforupdateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotiforupdateController],
      providers: [NotiforupdateService],
    }).compile();

    controller = module.get<NotiforupdateController>(NotiforupdateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
