import { Test, TestingModule } from '@nestjs/testing';
import { CourseClassroomService } from './course-classroom.service';

describe('CourseClassroomService', () => {
  let service: CourseClassroomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseClassroomService],
    }).compile();

    service = module.get<CourseClassroomService>(CourseClassroomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
