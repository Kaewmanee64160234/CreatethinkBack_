import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CourseClassroomService } from './course-classroom.service';
import { CreateCourseClassroomDto } from './dto/create-course-classroom.dto';
import { UpdateCourseClassroomDto } from './dto/update-course-classroom.dto';

@Controller('course-classroom')
export class CourseClassroomController {
  constructor(
    private readonly courseClassroomService: CourseClassroomService,
  ) {}

  @Post()
  create(@Body() createCourseClassroomDto: CreateCourseClassroomDto) {
    return this.courseClassroomService.create(createCourseClassroomDto);
  }

  @Get()
  findAll() {
    return this.courseClassroomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseClassroomService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseClassroomDto: UpdateCourseClassroomDto,
  ) {
    return this.courseClassroomService.update(+id, updateCourseClassroomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseClassroomService.remove(+id);
  }
}
