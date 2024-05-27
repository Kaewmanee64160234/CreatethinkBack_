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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { renameSync } from 'fs';
import { RolesGuard } from 'src/authorize/roles.guard';
import { Roles } from 'src/authorize/roles.decorator';
import { Role } from 'src/types/Role.enum';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './user_image',
        filename: (req, file, cb) => {
          // Temp filename just to save the file initially
          const tempFilename = uuidv4() + extname(file.originalname);
          cb(null, tempFilename);
        },
      }),
    }),
  )
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const studentId = createUserDto.studentId;
    const intendedFilename = `${studentId}${extname(file.originalname)}`;

    const oldPath = join('./user_image', file.filename);
    const newPath = join('./user_image', intendedFilename);
    renameSync(oldPath, newPath);

    createUserDto.image1 = intendedFilename;
    createUserDto.image2 = intendedFilename;
    createUserDto.image3 = intendedFilename;
    createUserDto.image4 = intendedFilename;
    createUserDto.image5 = intendedFilename;
    console.log(intendedFilename);

    return this.usersService.create(createUserDto, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.Teacher)
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
}
