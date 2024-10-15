import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { Roles } from 'src/authorize/roles.decorator';
import { Role } from 'src/types/Role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/authorize/roles.guard';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @Get('userReceive/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher, Role.Student)
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher, Role.Student)
  findAll() {
    return this.enrollmentsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher, Role.Student)
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentsService.update(+id, updateEnrollmentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student, Role.Teacher)
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(+id);
  }
  @Get('/student/:studentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  async findCoursesByStudentId(@Param('studentId') studentId: string) {
    return this.enrollmentsService.findCoursesByStudentId(studentId);
  }

  @Get('/course/:courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student, Role.Teacher)
  async findStdByCourseId(@Param('courseId') courseId: string) {
    return this.enrollmentsService.findStdByCourseId(courseId);
  }
}
