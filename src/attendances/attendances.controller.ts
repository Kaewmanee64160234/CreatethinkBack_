import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Patch,
  Res,
  UploadedFiles,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { Role } from 'src/types/Role.enum';
import { Roles } from 'src/authorize/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/authorize/roles.guard';

@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher, Role.Student)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './attendance_image',
        filename: (req, file, cb) => {
          const tempFilename = uuidv4() + extname(file.originalname);
          cb(null, tempFilename);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createAttendanceDto: CreateAttendanceDto,
  ) {
    createAttendanceDto.attendanceImage = file ? file.filename : 'noimage.jpg';
    return this.attendancesService.create(createAttendanceDto);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher, Role.Student)
  @UseInterceptors(
    FilesInterceptor('images', 500, {
      storage: diskStorage({
        destination: './attendance_image',
        filename: (req, file, cb) => {
          const tempFilename = uuidv4() + extname(file.originalname);
          cb(null, tempFilename);
        },
      }),
    }),
  )
  async createMany(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('attendances') attendances: string,
  ) {
    try {
      // Parse the attendances JSON string
      const parsedAttendances: CreateAttendanceDto[] = JSON.parse(attendances);

      // Map the files to their corresponding attendance records
      parsedAttendances.forEach((attendance, index) => {
        attendance.attendanceImage = files[index]
          ? files[index].filename
          : 'noimage.jpg';
      });
      console.log(parsedAttendances);

      // Save the attendance records
      return this.attendancesService.createMany(parsedAttendances);
    } catch (error) {
      console.error('Error creating multiple attendances:', error);
      throw new BadRequestException('Failed to create attendances.');
    }
  }

  // revalidateAttendance
  @Get('revalidate/:assignmentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher, Role.Student)
  revalidateAttendance(@Param('assignmentId') assignmentId: string) {
    return this.attendancesService.revalidateAttendance(+assignmentId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher, Role.Student)
  findAll() {
    return this.attendancesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher, Role.Student)
  findOne(@Param('id') id: string) {
    return this.attendancesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher, Role.Student)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './attendance_image',
        filename: (req, file, cb) => {
          const tempFilename = uuidv4() + extname(file.originalname);
          cb(null, tempFilename);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // set the attributes image
    updateAttendanceDto.attendanceImage = file ? file.filename : 'noimage.jpg';
    console.log(updateAttendanceDto.attendanceImage);
    console.log(file.filename);

    return this.attendancesService.update(+id, updateAttendanceDto);
  }
  // updateByTeacher
  @Patch('teacher/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async updateByTeacher(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendancesService.updateByTeacher(+id, updateAttendanceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  remove(@Param('id') id: string) {
    return this.attendancesService.remove(+id);
  }

  @Get('/assignments/:assignmentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher, Role.Student)
  findByAssignmentId(@Param('assignmentId') assignmentId: string) {
    return this.attendancesService.getAttendanceByAssignmentId(+assignmentId);
  }
  // getAttendanceByStatusInAssignment
  @Get('/assignments/status/:assignmentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher, Role.Student)
  getAttendanceByStatusInAssignment(
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.attendancesService.getAttendanceByStatusInAssignment(
      +assignmentId,
    );
  }
  @Get('image/:imageFile')
  async getImageByFileName(
    @Param('imageFile') imageFile: string,
    @Res() res: Response,
  ) {
    res.sendFile(imageFile, { root: './attendance_image' });
  }

  //confirm attendance
  @Patch('confirm/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async confirmAttendance(@Param('id') id: string) {
    return this.attendancesService.confirmAttendance(+id);
  }
  //reject attendance
  @Patch('reject/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async rejectAttendance(@Param('id') id: string) {
    return this.attendancesService.rejectAttendance(+id);
  }
  // getAttendanceByCourseId
  @Get('/courses/:courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher, Role.Student)
  getAttendanceByCourseId(@Param('courseId') courseId: string) {
    return this.attendancesService.getAttendanceByCourseId(courseId);
  }
  // checkAllAttendance

  @Get('/checkAllAttendance/:assigmentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  checkAllAttendance(@Param('assigmentId') assigmentId: string) {
    return this.attendancesService.checkAllAttendance(+assigmentId);
  }

  // getAttendanceByAssignmentAndStudent
  @Get('/assignment/:assignmentId/student/:studentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher, Role.Student)
  getAttendanceByAssignmentAndStudent(
    @Param('assignmentId') assignmentId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.attendancesService.getAttendanceByAssignmentAndStudent(
      +assignmentId,
      studentId,
    );
  }
}
