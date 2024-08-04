import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Course } from 'src/courses/entities/course.entity';
import { QrService } from './qr.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Course])],
  controllers: [UsersController],
  providers: [UsersService, QrService],
  exports: [UsersService],
})
export class UsersModule {}
