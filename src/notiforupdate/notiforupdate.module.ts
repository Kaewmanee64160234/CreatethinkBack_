import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotiforupdateService } from './notiforupdate.service';
import { NotiforupdateController } from './notiforupdate.controller';
import { Notiforupdate } from './entities/notiforupdate.entity';
import { User } from 'src/users/entities/user.entity';
import { EmailModule } from 'src/emails/emails.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notiforupdate, User]),
    EmailModule, // Import the EmailModule here
  ],
  providers: [NotiforupdateService],
  controllers: [NotiforupdateController],
  exports: [NotiforupdateService],
})
export class NotiforupdateModule {}
