import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Course } from 'src/courses/entities/course.entity';
import { QrService } from './qr.service';
import { EmailModule } from 'src/emails/emails.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Course]), EmailModule],
  controllers: [UsersController],
  providers: [UsersService, QrService],
  exports: [UsersService],
})
export class UsersModule {}
