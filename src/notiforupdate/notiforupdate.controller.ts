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
  NotFoundException,
  Res,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';
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
      // Log incoming data for debugging
      console.log('Files received in controller:', files);
      console.log('Data received in controller:', createNotiforupdateDto);

      // Check if files were uploaded
      if (!files || files.length === 0) {
        throw new BadRequestException('No files uploaded');
      }

      // Check if userId is provided
      if (!createNotiforupdateDto.userId) {
        console.error('No userId provided');
        throw new BadRequestException('User ID is required');
      }

      // Check for the correct number of files
      if (files.length < 5) {
        console.error('Insufficient files uploaded:', files.length);
        throw new BadRequestException('Insufficient number of files uploaded');
      }

      // Set notification images
      createNotiforupdateDto.image1 = files[0]?.filename || null;
      createNotiforupdateDto.image2 = files[1]?.filename || null;
      createNotiforupdateDto.image3 = files[2]?.filename || null;
      createNotiforupdateDto.image4 = files[3]?.filename || null;
      createNotiforupdateDto.image5 = files[4]?.filename || null;

      // Further log the DTO before saving
      console.log('Processed data to save:', createNotiforupdateDto);

      // Save the notification update
      return await this.notiforupdateService.create(createNotiforupdateDto);
    } catch (error) {
      console.error('Error during notification creation:', error.message);
      throw new BadRequestException('Invalid data provided');
    }
  }

  @Patch(':id/confirm')
  async confirm(@Param('id') id: string) {
    console.log(`Received confirm request for notification ID: ${id}`);
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
  @Get(':id/images')
  async getNotificationImages(@Param('id') id: string) {
    try {
      // Fetch the notification using the provided ID
      const notification = await this.notiforupdateService.findOne(+id);
      if (!notification) {
        throw new BadRequestException('Notification not found');
      }

      // Assuming the images are stored in the properties `image1`, `image2`, ..., `image5`
      const images = [];
      if (notification.image1) images.push(notification.image1);
      if (notification.image2) images.push(notification.image2);
      if (notification.image3) images.push(notification.image3);
      if (notification.image4) images.push(notification.image4);
      if (notification.image5) images.push(notification.image5);

      return { images };
    } catch (error) {
      console.error('Error fetching notification images:', error);
      throw new BadRequestException('Failed to fetch notification images');
    }
  }

  @Get('image/filename/:filename')
  getImage(@Param('filename') filename: string, @Res() res) {
    res.status(200).sendFile(filename, { root: './notiforupdate_images' });
  }
  // // get images user
  // @Get(':id/image/:imageKey')
  // async getImageById(
  //   @Param('id') id: string,
  //   @Param('imageKey') imageKey: string,
  //   @Res() res,
  // ) {
  //   const notification = await this.notiforupdateService.findOne(+id);

  //   // Fetch the specified image (image1, image2, ..., image5)
  //   const imagePath = notification[imageKey];
  //   if (!imagePath) {
  //     return res.status(404).send('Image not found');
  //   }

  //   res.status(200).sendFile(imagePath, { root: './notiforupdate_images' });
  // }
}
