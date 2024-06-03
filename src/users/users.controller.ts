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
  // UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
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
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './user_images',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueSuffix);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log('Received data:', updateUserDto);
    console.log('Received files:', files);
    files.forEach((file, index) => {
      updateUserDto[`image${index + 1}`] = file.filename;
      updateUserDto[`faceDescription${index + 1}`] =
        updateUserDto[`faceDescription${index + 1}`];
    });

    try {
      const result = await this.usersService.update(+id, updateUserDto);
      return result;
    } catch (error) {
      console.error('Error during user update:', error);
      throw new BadRequestException(
        'Failed to update user due to invalid input',
      );
    }
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

  @Get(':id/image')
  async getImage(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findOne(+id);
    res.sendFile(user.image1, { root: './user_images' });
  }

  @Get('image/filename/:filename')
  async serveImage(@Param('filename') filename: string, @Res() res: Response) {
    res.status(200).sendFile(filename, { root: './user_images' });
  }
}
