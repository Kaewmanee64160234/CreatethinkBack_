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
} from '@nestjs/common';

import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FileInterceptor } from '@nestjs/platform-express';

// import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imageFile')) // 'imageFile' is the name of the file input in the form
  create(
    @Body() createAttendanceDto: CreateAttendanceDto,
    @UploadedFile() imageFile: Express.Multer.File,
  ) {
    return this.attendancesService.create(createAttendanceDto, imageFile);
  }

  @Get()
  findAll() {
    return this.attendancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendancesService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateAttendanceDto: UpdateAttendanceDto,
  // ) {
  //   return this.attendancesService.update(+id, updateAttendanceDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendancesService.remove(+id);
  }
}
