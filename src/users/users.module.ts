import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Course } from 'src/courses/entities/course.entity';
import { QrService } from './qr.service';
import { Notiforupdate } from 'src/notiforupdate/entities/notiforupdate.entity';
import { NotiforupdateService } from 'src/notiforupdate/notiforupdate.service';
import { EmailModule } from 'src/emails/emails.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Course, Notiforupdate]),
    EmailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, QrService, NotiforupdateService],
  exports: [UsersService],
})
export class UsersModule {}
