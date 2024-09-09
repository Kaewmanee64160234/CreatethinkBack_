import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Patch,
  Param,
  Get,
  Body,
  Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { NotiforupdateService } from './notiforupdate.service';
import { UpdateNotiforupdateDto } from './dto/update-notiforupdate.dto';

@Controller('notiforupdates')
export class NotiforupdateController {
  constructor(private readonly notiforupdateService: NotiforupdateService) {}
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './notiforupdate_images',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueSuffix);
        },
      }),
    }),
  )
  async create(
    @Body() createNotiforupdateDto: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      console.log('Files received in controller:', files); // files contain the uploaded images
      console.log(
        'Data received in controller:',
        createNotiforupdateDto.userId,
      ); // createNotiforupdateDto contains the other data

      if (!files || files.length === 0) {
        throw new BadRequestException('No files uploaded');
      }
      // set notification image
      createNotiforupdateDto.image1 = files[0].filename;
      createNotiforupdateDto.image2 = files[1].filename;
      createNotiforupdateDto.image3 = files[2].filename;
      createNotiforupdateDto.image4 = files[3].filename;
      createNotiforupdateDto.image5 = files[4].filename;

      return await this.notiforupdateService.create(createNotiforupdateDto);
    } catch (error) {
      console.error('Error during notification creation:', error);
      throw new BadRequestException('Invalid data provided');
    }
  }

  @Patch(':id/confirm')
  confirm(@Param('id') id: string) {
    return this.notiforupdateService.confirmNotification(+id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.notiforupdateService.rejectNotification(+id);
  }

  @Get()
  findAll() {
    return this.notiforupdateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notiforupdateService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotiforupdateDto: UpdateNotiforupdateDto,
  ) {
    return this.notiforupdateService.update(+id, updateNotiforupdateDto);
  }
  //getNotificationByUserReceive
  @Get('userReceive/:id')
  getNotificationByUserReceive(@Param('id') id: string) {
    return this.notiforupdateService.getNotificationByUserReceive(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notiforupdateService.remove(+id);
  }
}
