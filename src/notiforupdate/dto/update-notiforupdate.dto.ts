import { PartialType } from '@nestjs/swagger';
import { CreateNotiforupdateDto } from './create-notiforupdate.dto';

export class UpdateNotiforupdateDto extends PartialType(
  CreateNotiforupdateDto,
) {}
