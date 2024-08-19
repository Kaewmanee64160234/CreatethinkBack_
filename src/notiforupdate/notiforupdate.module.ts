import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotiforupdateService } from './notiforupdate.service';
import { NotiforupdateController } from './notiforupdate.controller';
import { Notiforupdate } from './entities/notiforupdate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notiforupdate])], // Registering the entity
  providers: [NotiforupdateService],
  controllers: [NotiforupdateController],
})
export class NotiforupdateModule {}
