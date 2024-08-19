import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
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
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.notiforupdateService.remove(+id);
  }
}
