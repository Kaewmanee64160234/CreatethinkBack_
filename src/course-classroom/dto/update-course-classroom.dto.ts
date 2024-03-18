import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseClassroomDto } from './create-course-classroom.dto';

export class UpdateCourseClassroomDto extends PartialType(
  CreateCourseClassroomDto,
) {}
