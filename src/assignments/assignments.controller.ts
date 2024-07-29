import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
// impoet uuid from
import { v4 as uuid4 } from 'uuid';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './assignment_images',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${uuid4()}${extname(file.originalname)}`;
          cb(null, uniqueSuffix);
        },
      }),
    }),
  )
  async create(
    @Body() createAssignmentDto: CreateAssignmentDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!files || files.length === 0 || files.length > 5) {
      throw new BadRequestException('Between 1 and 5 images are required.');
    }

    console.log('Received data:', createAssignmentDto);
    console.log('Received files:', files);

    // Map the file names to the DTO
    createAssignmentDto.assignmentImages = files.map((file) => file.filename);

    try {
      const result = await this.assignmentsService.create(createAssignmentDto);
      return result;
    } catch (error) {
      console.error('Error during assignment creation:', error);
      throw new BadRequestException(
        'Failed to create assignment due to invalid input',
      );
    }
  }

  @Get()
  findAll() {
    return this.assignmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this.assignmentsService.update(+id, updateAssignmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(+id);
  }
  //getAssignmentByCourseId
  @Get('course/:id')
  getAssignmentByCourseId(@Param('id') id: string) {
    return this.assignmentsService.getAssignmentByCourseId(id);
  }
}
