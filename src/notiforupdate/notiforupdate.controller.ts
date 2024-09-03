import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotiforupdateService } from './notiforupdate.service';
import { CreateNotiforupdateDto } from './dto/create-notiforupdate.dto';
import { UpdateNotiforupdateDto } from './dto/update-notiforupdate.dto';

@Controller('notiforupdate')
export class NotiforupdateController {
  constructor(private readonly notiforupdateService: NotiforupdateService) {}

  @Post()
  create(@Body() createNotiforupdateDto: CreateNotiforupdateDto) {
    return this.notiforupdateService.create(createNotiforupdateDto);
  }

  // @Post('notiforupdate')
  // async requestImageUpdate(@Body() notificationData: CreateNotiforupdateDto) {
  //   // This function would:
  //   // - Save the image and face descriptors to a temporary storage (not the user's profile yet)
  //   // - Create a notification entry in the database for the teacher to approve
  //   // - Trigger an email to the teacher informing them of the pending approval request

  //   await this.notiforupdateService.create(notificationData);

  //   // Notify the teacher
  //   await this.emailService.sendEmailToTeacher(notificationData.userId);

  //   return { message: 'Notification created and email sent to teacher' };
  // }

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notiforupdateService.remove(+id);
  }
}
