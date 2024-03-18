import { Test, TestingModule } from '@nestjs/testing';
import { CourseClassroomController } from './course-classroom.controller';
import { CourseClassroomService } from './course-classroom.service';

describe('CourseClassroomController', () => {
  let controller: CourseClassroomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseClassroomController],
      providers: [CourseClassroomService],
    }).compile();

    controller = module.get<CourseClassroomController>(
      CourseClassroomController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
