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
  Res,
  Query,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
// impoet uuid from
import { v4 as uuid4 } from 'uuid';
import { Response } from 'express';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 20, {
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
    if (!files || files.length === 0 || files.length > 20) {
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

  @Get('image/filename/:filename')
  async serveImage(@Param('filename') filename: string, @Res() res: Response) {
    res.status(200).sendFile(filename, { root: './assignment_images' });
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
  async update(
    @Param('id') id: number,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Delete(':id')
  async deleteAssignment(@Param('id') id: number) {
    return await this.assignmentsService.remove(id);
  }

  //getAssignmentByCourseId
  @Get('course/:id')
  getAssignmentByCourseId(@Param('id') id: string) {
    return this.assignmentsService.getAssignmentByCourseId(id);
  }
  // getAssignmentByCourseIdPaginate query params paginate
  @Get('course/:id/paginate')
  getAssignmentByCourseIdPaginate(
    @Param('id') id: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.assignmentsService.getAssignmentByCourseIdPaginate(
      id,
      +page,
      +limit,
    );
  }

  // get image files getImageFiles by assigment id
  @Get('images/course/:id')
  getAssignmentImages(@Param('id') id: string) {
    return this.assignmentsService.getImageFiles(id);
  }
}
