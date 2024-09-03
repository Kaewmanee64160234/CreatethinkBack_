import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotiforupdateService } from './notiforupdate.service';
import { NotiforupdateController } from './notiforupdate.controller';
import { Notiforupdate } from './entities/notiforupdate.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notiforupdate, User])], // Registering the entity
  providers: [NotiforupdateService],
  controllers: [NotiforupdateController],
})
export class NotiforupdateModule {}
