import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  // UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
// import { RolesGuard } from 'src/authorize/roles.guard';
// import { Roles } from 'src/authorize/roles.decorator';
// import { Role } from 'src/types/Role.enum';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      // Now expecting 5 files
      storage: diskStorage({
        destination: './user_images',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueSuffix);
        },
      }),
    }),
  )
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (files.length !== 5) {
      throw new BadRequestException('Exactly 5 images are required.');
    }
    console.log('Received data:', createUserDto);
    console.log('Received files:', files);
    files.forEach((file, index) => {
      createUserDto[`image${index + 1}`] = file.filename;
      createUserDto[`faceDescription${index + 1}`] =
        createUserDto[`faceDescription${index + 1}`];
    });

    try {
      const result = await this.usersService.create(createUserDto);
      return result;
    } catch (error) {
      console.error('Error during user creation:', error);
      throw new BadRequestException(
        'Failed to create user due to invalid input',
      );
    }
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  // @Roles(Role.Teacher)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './user_image',
        filename: (req, file, cb) => {
          const studentId = req.body.user.studentId;
          const name = `${studentId}`;
          const filename = name + extname(file.originalname);
          return cb(null, filename);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const studentId = updateUserDto.studentId;
    updateUserDto.image1 = `${studentId}` + extname(file.originalname);
    updateUserDto.image2 = `${studentId}` + extname(file.originalname);
    updateUserDto.image3 = `${studentId}` + extname(file.originalname);
    updateUserDto.image4 = `${studentId}` + extname(file.originalname);
    updateUserDto.image5 = `${studentId}` + extname(file.originalname);
    return this.usersService.update(+id, updateUserDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
  //login controller
  @Post('login')
  login(@Body() createUserDto: CreateUserDto) {
    return this.usersService.login(createUserDto);
  }

  // getUserByCourseId
  @Get('/course/:courseId')
  getUserByCourseId(@Param('courseId') courseId: string) {
    return this.usersService.getUserByCourseId(courseId);
  }
}
