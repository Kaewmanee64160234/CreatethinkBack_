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
  UploadedFile,
  UseGuards,
  // UsePipes,
  // ValidationPipe,
} from '@nestjs/common';
import { Role } from '../types/Role.enum';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/authorize/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/authorize/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //getUserpagination
  @Get('pagination')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getUserPagination(
    @Query('page') page: 1,
    @Query('limit') limit: 20,
  ): Promise<{ data: User[]; total: number }> {
    console.log('page: ', page);
    console.log('limit: ', limit);

    return this.usersService.getUserPagination(page, limit);
  }
  //paginate get student
  @Get('students/pagination')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getStudentPagination(
    @Query('page') page: 1,
    @Query('limit') limit: 20,
  ): Promise<{ data: User[]; total: number }> {
    console.log('page: ', page);
    console.log('limit: ', limit);

    return this.usersService.getStudentPagination(page, limit);
  }

  //getTeacher
  @Get('teachers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getTeacher(): Promise<User[]> {
    return this.usersService.getTeacher();
  }

  //paginate get teacher
  @Get('teachers/pagination')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getTeacherPagination(
    @Query('page') page: 1,
    @Query('limit') limit: 20,
  ): Promise<{ data: User[]; total: number }> {
    console.log('page: ', page);
    console.log('limit: ', limit);

    return this.usersService.getTeacherPagination(page, limit);
  }
  //paginate get admin
  @Get('admins/pagination')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getAdminPagination(
    @Query('page') page: 1,
    @Query('limit') limit: 20,
  ): Promise<{ data: User[]; total: number }> {
    console.log('page: ', page);
    console.log('limit: ', limit);

    return this.usersService.getAdminPagination(page, limit);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async searchUsers(@Query('search') search: string): Promise<User[]> {
    return this.usersService.searchUsers(search);
  }

  //search years
  @Get('search/year')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async searchYears(@Query('year') year: string): Promise<User[]> {
    return this.usersService.searchUsersYear(year);
  }

  // //searchStatusTeacher
  // @Get('search/statusTeacher')
  // async searchStatusTeacher(@Query('status') status: string): Promise<User[]> {
  //   return this.usersService.searchUsersStatusTeacher(status);
  // }

  //search status Teacher and Admin
  @Get('search/statusTeacherAdmin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async searchStatusTeacherAdmin(
    @Query('status') status: string,
  ): Promise<User[]> {
    return this.usersService.searchUsersStatusTeacherAdmin(status);
  }

  // //search majors
  // @Get('search/major')
  // async searchMajors(@Query('major') major: string): Promise<User[]> {
  //   return this.usersService.searchUsersMajor(major);
  // }

  //search majors paginate
  @Get('search/major/pagination')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async searchMajorsPagination(
    @Query('major') major: string,
    @Query('page') page: 1,
    @Query('limit') limit: 20,
  ): Promise<{ data: User[]; total: number }> {
    return this.usersService.searchUsersMajorPagination(major, page, limit);
  }

  //search status
  // @Get('search/status')
  // async searchStatus(@Query('status') status: string): Promise<User[]> {
  //   return this.usersService.searchUsersStatus(status);
  // }

  //searchUsersByMajorAndStatus pagination
  @Get('search/major-status/pagination')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async searchUsersByMajorAndStatusPagination(
    @Query('major') major: string,
    @Query('status') status: string,
    @Query('page') page: 1,
    @Query('limit') limit: 20,
  ): Promise<{ data: User[]; total: number }> {
    return this.usersService.searchUsersByMajorAndStatusPagination(
      major,
      status,
      page,
      limit,
    );
  }

  //search status paginate
  @Get('search/status/pagination')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async searchStatusPagination(
    @Query('status') status: string,
    @Query('page') page: 1,
    @Query('limit') limit: 20,
  ): Promise<{ data: User[]; total: number }> {
    return this.usersService.searchUsersStatusPagination(status, page, limit);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File not found');
    }
    return this.usersService.processFile(file);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './user_images',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${uuidv4()}${extname(file.originalname)}`;
          console.log('uniqueSuffix: ', file);

          cb(null, uniqueSuffix);
        },
      }),
    }),
  )
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (
      (!files || files.length === 0 || files.length > 5) &&
      createUserDto.role === 'นักเรียน'
    ) {
      throw new BadRequestException('Between 1 and 5 images are required.');
    }
    console.log('files: ', files);

    // console.log('Received data:', createUserDto);
    // console.log('Received files:', files);

    files.forEach((file, index) => {
      createUserDto[`image${index + 1}`] = file.filename;
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get('std/:id')
  findByStd(@Param('id') id: string) {
    return this.usersService.findOneByStudentId(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher, Role.Student)
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

    // if (updateUserDto.role === 'แอดมิน' || updateUserDto.role === 'อาจารย์') {
    //   if (!files || files.length === 0) {
    //     updateUserDto.image1 = 'no-image';
    //     console.log('updateUserDto: ', updateUserDto);
    //   } else {
    //     files.forEach((file, index) => {
    //       updateUserDto[`image${index + 1}`] = file.filename;
    //     });
    //     console.log('updateUserDto: ', updateUserDto.image1);
    //   }
    // } else if (
    //   updateUserDto.role === 'นิสิต' &&
    //   (!files || files.length === 0 || files.length > 5)
    // ) {
    //   throw new BadRequestException(
    //     'Between 1 and 5 images are required for students.',
    //   );
    // } else {
    //   files?.forEach((file, index) => {
    //     updateUserDto[`image${index + 1}`] = file
    //       ? file.filename
    //       : updateUserDto[`image${index + 1}`];
    //   });
    //   console.log('updateUserDto: ', updateUserDto.image1);
    // }
    files.forEach((file, index) => {
      updateUserDto[`image${index + 1}`] = file.filename;
    });

    try {
      const result = await this.usersService.update(+id, updateUserDto);
      return result;
      // return 'Hello';
    } catch (error) {
      console.error('Error during user update:', error);
      throw new BadRequestException(
        'Failed to update user due to invalid input',
      );
    }
  }
  @Patch(':id/register-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async updateRegisterStatus(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const result = await this.usersService.updateRegisterStatus(
        +id,
        updateUserDto,
      );
      return result;
    } catch (error) {
      console.error('Error during registerStatus update:', error);
      throw new BadRequestException(
        'Failed to update registerStatus due to invalid input',
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  // Login controller
  @Post('login')
  login(@Body() createUserDto: CreateUserDto) {
    return this.usersService.login(createUserDto);
  }

  // getUserByCourseId
  @Get('/course/:courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
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

  //get user images by userId
  @Get(':id/images')
  async getUserImages(@Param('id') id: string) {
    try {
      // Fetch the user using the provided ID
      const user = await this.usersService.findOne(+id);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Assuming the images are stored in the properties `image1`, `image2`, ..., `image5`
      const images = [];
      if (user.image1) images.push(user.image1);
      if (user.image2) images.push(user.image2);
      if (user.image3) images.push(user.image3);
      if (user.image4) images.push(user.image4);
      if (user.image5) images.push(user.image5);

      return { images };
    } catch (error) {
      console.error('Error fetching user images:', error);
      throw new BadRequestException('Failed to fetch user images');
    }
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Teacher, Role.Admin)
  @Get(':stdId/qr')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher, Role.Student)
  async generateQrCode(@Param('stdId') stdId: string): Promise<string> {
    const link = `http://localhost:5173/confirmRegister/${stdId}`;
    return await this.usersService.generateQrCodeForOrder(link);
  }

  @Get('email/:email')
  async checkEmailDuplicate(
    @Param('email') email: string,
    @Query('userId') userId: number,
  ) {
    return await this.usersService.checkEmailDuplicate(email, userId);
  }

  //check student Id duplicate
  @Get('studentId/:studentId')
  async checkStudentIdDuplicate(@Param('studentId') studentId: string) {
    return await this.usersService.checkStudentIdDuplicate(studentId);
  }
}
