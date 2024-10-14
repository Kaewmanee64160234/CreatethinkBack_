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
  UseGuards,
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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/authorize/roles.guard';
import { Roles } from 'src/authorize/roles.decorator';
import { Role } from 'src/types/Role.enum';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: './assignment_images',
        filename: (req, file, cb) => {
          console.log('Received file:', file);

          const uniqueSuffix = `${Date.now()}-${uuid4()}${extname(file.originalname)}`;
          cb(null, uniqueSuffix);
        },
      }),
    }),
  )
  async create(
    @Body() createAssignmentDto: CreateAssignmentDto,
    @UploadedFiles() files: Array<Express.Multer.File> = [], // Default to empty array if no files are uploaded
  ) {
    console.log('Received data:', createAssignmentDto);
    console.log('Received files:', files);

    // Only map file names if files are provided
    if (files.length > 0) {
      createAssignmentDto.assignmentImages = files.map((file) => file.filename);
    } else {
      createAssignmentDto.assignmentImages = []; // Ensure it's an empty array if no files are uploaded
    }

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async update(
    @Param('id') id: number,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
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
