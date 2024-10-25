/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { Buffer } from 'buffer';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import path, { extname, join } from 'path';
import { promises as fsPromises, renameSync } from 'fs';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { EmailService } from 'src/emails/emails.service';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    private emailService: EmailService,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    try {
      console.log('Received DTO:', createAttendanceDto);
      const assignment = await this.assignmentRepository.findOne({
        where: { assignmentId: createAttendanceDto.assignmentId },
        relations: ['course'],
      });

      if (!assignment) {
        throw new Error('Assignment not found');
      }

      const newAttendance = new Attendance();
      newAttendance.user =
        createAttendanceDto.user === null
          ? null
          : await this.userRepository.findOne({
              where: { studentId: createAttendanceDto.studentId + '' },
            });
      newAttendance.attendanceDate = new Date();
      newAttendance.attendanceImage =
        createAttendanceDto.attendanceImage || 'default-image.jpg';
      newAttendance.attendanceConfirmStatus =
        createAttendanceDto.attendanceConfirmStatus;
      newAttendance.attendanceScore = createAttendanceDto.attendanceScore;

      const currentDate = new Date();
      const assignmentDate = new Date(assignment.assignMentTime);
      newAttendance.attendanceStatus = createAttendanceDto.attendanceStatus;
      newAttendance.assignment = assignment;
      // if imageis default-image.jpg sen email
      // if (newAttendance.attendanceImage === 'noimage.jpg') {
      //   console.log(newAttendance.user.email);

      //   const email = newAttendance.user.email; // Replace this with the actual fetching logic
      //   const subject = 'แจ้งเตือนไม่มีรูปภาพของคุณ';
      //   const htmlContent = `
      //     <p>เรียนคุณ ${newAttendance.user.firstName} ${newAttendance.user.lastName},</p>
      //     <p>การเข้าร่วมของคุณสำหรับวิชา "${assignment.course.nameCourses}" และการบ้าน "${assignment.nameAssignment}" ได้ถูกสร้างเรียบร้อยแล้ว</p>
      //     <p>ระบบไม่พบหน้าของคุณในการเช็คชื่อครั้งนี้หากคุณมาเรียนกรุณาเข้ามาเพิ่มภาพของท่านหรือแจ้งอาจารย์ผู้สอน</p>
      //     <p>กรุณาเข้าไปตรวจสอบหรือทำการยืนยันใหม่อีกครั้งที่: http://localhost:5173/mappingForStudent/course/12123233/assignment/${assignment.assignmentId}</p>
      //     <p>ด้วยความเคารพ,</p>
      //     <p><strong>ระบบการเช็คชื่อเถื่อน</strong></p>
      //   `;
      //   await this.emailService.sendEmail(email, subject, htmlContent);
      // }

      return this.attendanceRepository.save(newAttendance);
    } catch (error) {
      console.error('Error in create attendance:', error);
      throw new Error('Error creating attendance');
    }
  }

  async createMany(
    createAttendanceDtos: CreateAttendanceDto[],
  ): Promise<Attendance[]> {
    try {
      // console.log('Received DTOs:', createAttendanceDtos);

      const newAttendances: Attendance[] = [];

      // Iterate over the array of attendance DTOs
      console.log('createAttendanceDtos', createAttendanceDtos[0]);

      for (const createAttendanceDto of createAttendanceDtos) {
        // console.log('Received DTO:', createAttendanceDto);

        // Find the assignment related to the current attendance
        const assignment = await this.assignmentRepository.findOne({
          where: { assignmentId: createAttendanceDto.assignmentId },
          relations: ['course'],
        });

        if (!assignment) {
          throw new Error(
            `Assignment with ID ${createAttendanceDto.assignmentId} not found`,
          );
        }

        // Create a new Attendance object
        const newAttendance = new Attendance();

        // Fetch the user (or set to null if the user is not found)
        newAttendance.user =
          createAttendanceDto.user === null
            ? null
            : await this.userRepository.findOne({
                where: { studentId: createAttendanceDto.studentId + '' },
              });

        newAttendance.attendanceDate = new Date();
        newAttendance.attendanceImage =
          createAttendanceDto.attendanceImage || 'noimage.jpg';
        newAttendance.attendanceConfirmStatus =
          createAttendanceDto.attendanceConfirmStatus;
        newAttendance.attendanceScore =
          createAttendanceDto.attendanceScore * 100;

        const currentDate = new Date();
        const assignmentDate = new Date(assignment.assignMentTime);
        newAttendance.attendanceStatus = createAttendanceDto.attendanceStatus;
        newAttendance.assignment = assignment;

        // Add the new attendance to the array
        newAttendances.push(newAttendance);

        // Optionally send an email if there is no image
        if (newAttendance.attendanceImage === 'noimage.jpg') {
          // const email = newAttendance.user?.email; // Make sure user is defined and has an email
          // if (email) {
          //   const subject = 'แจ้งเตือนไม่มีรูปภาพของคุณ';
          //   const htmlContent = `
          //     <p>เรียนคุณ ${newAttendance.user.firstName} ${newAttendance.user.lastName},</p>
          //     <p>การเข้าร่วมของคุณสำหรับวิชา "${assignment.course.nameCourses}" และการบ้าน "${assignment.nameAssignment}" ได้ถูกสร้างเรียบร้อยแล้ว</p>
          //     <p>ระบบไม่พบหน้าของคุณในการเช็คชื่อครั้งนี้หากคุณมาเรียนกรุณาเข้ามาเพิ่มภาพของท่านหรือแจ้งอาจารย์ผู้สอน</p>
          //     <p>กรุณาเข้าไปตรวจสอบหรือทำการยืนยันใหม่อีกครั้งที่: http://localhost:5173/mappingForStudent/course/12123233/assignment/${assignment.assignmentId}</p>
          //     <p>ด้วยความเคารพ,</p>
          //     <p><strong>ระบบการเช็คชื่อเถื่อน</strong></p>
          //   `;
          //   await this.emailService.sendEmail(email, subject, htmlContent);
          // }
        }
      }

      // Save all new attendance records in the database at once
      return this.attendanceRepository.save(newAttendances);
    } catch (error) {
      console.error('Error in createMany attendances:', error);
      throw new Error('Error creating multiple attendances');
    }
  }

  findAll() {
    return this.attendanceRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: number) {
    const attendance = await this.attendanceRepository.findOneBy({
      attendanceId: id,
    });
    if (!attendance) {
      throw new NotFoundException('attendance not found');
    } else {
      return attendance;
    }
  }

  async markAttendance(
    user: User,
    courseName: string,
    assignmentName: string,
    imagePath: string,
    assignmentId: string,
  ) {
    try {
      // Check if the image file exists
      const fileExists = await this.checkFileExists(imagePath);
      console.log('fileExists', fileExists);

      if (!fileExists) {
        console.error(`ไม่พบไฟล์ภาพที่เส้นทาง: ${imagePath}`);
        throw new Error('ไม่พบไฟล์แนบที่ใช้ในอีเมล.');
      }

      // Fetch user's email from the database based on userId
      // const email = user.email;
      // console.log('email', email);

      // const subject = 'ยืนยันการเข้าร่วมด้วยภาพถ่าย';
      // const htmlContent = `
      //   <p>เรียนคุณ ${user.firstName} ${user.lastName},</p>
      //   <p>การเข้าร่วมของคุณสำหรับวิชา "${courseName}" และการบ้าน "${assignmentName}" ได้ถูกสร้างเรียบร้อยแล้ว</p>
      //   <p>กรุณาตรวจสอบภาพที่แนบมานี้เพื่อยืนยันว่าคุณได้เข้าร่วม เนื่องจากอาจารย์ได้ปฎิเสธรูปที่คาดว่าจะเป็นคุณ</p>
      //    <p>ที่คือรูปที่ถูกปฏิเสธ</p><br/>
      //   <img src="cid:attendanceImage" alt="Attendance Image" /><br/>
      //   <p>กรุณาเข้าไปตรวจสอบหรือทำการยืนยันใหม่อีกครั้งที่: http://localhost:5173/mappingForStudent/course/12123233/assignment/${assignmentId}</p>
      //   <p>ด้วยความเคารพ,</p>
      //   <p><strong>ระบบการเช็คชื่อเถื่อน</strong></p>
      // `;

      // await this.emailService.sendEmailWithEmbeddedImage(
      //   email,
      //   subject,
      //   htmlContent,
      //   imagePath,
      // );
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการส่งอีเมลยืนยันการเข้าร่วม:', error);
    }
  }

  async checkFileExists(filePath: string) {
    try {
      await fsPromises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async remove(id: number) {
    const attendance = await this.attendanceRepository.findOne({
      where: { attendanceId: id },
      relations: ['user', 'assignment', 'assignment.course'],
    });

    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    const attendDelete = await this.attendanceRepository.softRemove(attendance);

    // Get all users who have attendance for this assignment
    const usersInAttendance = await this.attendanceRepository.find({
      where: {
        assignment: { assignmentId: attendance.assignment.assignmentId },
      },
      relations: ['user'],
    });
    // console.log(usersInAttendance);

    // Extract user IDs from the attendance records
    const usersInAttendanceIds = new Set(
      usersInAttendance.map((a) => a.user.userId),
    );

    // Get all users enrolled in the course
    const usersInCourse = await this.enrollmentRepository.find({
      where: { course: { coursesId: attendance.assignment.course.coursesId } },
      relations: ['user'],
    });

    // Extract user objects from the enrollment records
    const usersInCourseList = usersInCourse.map(
      (enrollment) => enrollment.user,
    );

    // Find users who are in the course but not in the attendance records
    const usersToCreateAttendance = usersInCourseList.filter(
      (user) => !usersInAttendanceIds.has(user.userId),
    );
    // Remove image
    const imagePath = join('./', 'attendance_image');
    const image = attendance.attendanceImage;
    const imageFullPath = join(imagePath, image);
    console.log('usersToCreateAttendance', usersToCreateAttendance);
    console.log('attdent', attendDelete);

    attendDelete.user.countingRejection += 1;
    const userCounting = await this.userRepository.save(attendDelete.user);
    console.log('userCounting', userCounting);

    if (userCounting.countingRejection >= 3) {
      await this.markAttendance(
        attendDelete.user,
        attendance.assignment.course.nameCourses,
        attendance.assignment.nameAssignment,
        imageFullPath,
        attendance.assignment.assignmentId + '',
      );
      userCounting.countingRejection = 0;
      await this.userRepository.save(userCounting);
    }

    // Create attendance records for users without existing records
    for (const user of usersToCreateAttendance) {
      // console.log('id', id);

      const newAttendance = new Attendance();
      newAttendance.user = user;
      newAttendance.assignment = attendance.assignment;
      newAttendance.attendanceDate = new Date();
      newAttendance.attendanceStatus = 'absent';
      newAttendance.attendanceConfirmStatus = 'notconfirm';
      newAttendance.attendanceImage = 'noimage.jpg';

      await this.attendanceRepository.save(newAttendance);
    }

    try {
      await fsPromises.unlink(imageFullPath);
    } catch (error) {
      console.error('Error removing image:', error);
    }
    return attendDelete;
  }

  //getAttendanceBy AssignmentId
  async getAttendanceByAssignmentId(assignmentId: number) {
    try {
      const attendances = await this.attendanceRepository.find({
        where: { assignment: { assignmentId: assignmentId } },
        relations: ['user', 'assignment', 'assignment.course'],
      });
      if (!attendances) {
        throw new NotFoundException('attendances not found');
      } else {
        // console.log(attendances.length);
        return attendances;
      }
    } catch (error) {
      console.log(error);
    }
  }

  //update
  async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    try {
      console.log(updateAttendanceDto);

      const user = await this.userRepository.findOne({
        where: { studentId: updateAttendanceDto.studentId },
      });
      const attendance = await this.attendanceRepository.findOne({
        where: {
          attendanceId: id,
        },
      });
      if (
        attendance != null &&
        attendance.attendanceConfirmStatus === 'confirmed'
      ) {
        // send 403
        throw new InternalServerErrorException(
          'This attendance has already been confirmed',
        );
      } else {
        console.log('attendanceUpdate', updateAttendanceDto);

        const attendance_ = await this.attendanceRepository.findOne({
          where: {
            attendanceId: id,
            assignment: { assignmentId: +updateAttendanceDto.assignmentId },
            user: { studentId: updateAttendanceDto.studentId },
          },
          relations: ['assignment'],
        });
        console.log('attendance_', attendance_);
        if (attendance_.attendanceStatus === 'absent') {
          // check time
          const currentDate = new Date();
          const assignmentDate = new Date(
            attendance_.assignment.assignMentTime,
          );
          const diffMs = currentDate.getTime() - assignmentDate.getTime();
          const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
          if (diffMins > 15) {
            attendance_.attendanceStatus = 'late';
          } else {
            attendance_.attendanceStatus = 'present';
          }
          attendance_.attendanceConfirmStatus = 'recheck';
        } else {
          attendance_.attendanceConfirmStatus =
            updateAttendanceDto.attendanceConfirmStatus;
        }

        attendance_.attendanceStatus = updateAttendanceDto.attendanceStatus;
        if (attendance_.attendanceImage === 'noimage.jpg') {
          attendance_.attendanceImage = updateAttendanceDto.attendanceImage;
        }
        if (
          attendance_.attendanceImage !== 'noimage.jpg' &&
          updateAttendanceDto.attendanceImage !== attendance_.attendanceImage
        ) {
          attendance_.attendanceImage = updateAttendanceDto.attendanceImage;
        }
        attendance_.attendanceScore = updateAttendanceDto.attendanceScore;

        attendance_.user = user;

        attendance_.attendanceStatus = updateAttendanceDto.attendanceStatus;
        attendance_.attendanceConfirmStatus =
          updateAttendanceDto.attendanceConfirmStatus;
        console.log('attendance_', attendance_);

        const attSave = await this.attendanceRepository.save(attendance_);
        console.log('attSave', attSave);
        return attSave;
      }
    } catch (error) {
      console.log('--------------');
      console.log(error);
      throw new InternalServerErrorException('Error updating attendance');
    }

    // console.log(updateAttendanceDto);
  }

  // update by teacher
  async updateByTeacher(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { userId: updateAttendanceDto.user.userId },
      });
      const attendance = await this.attendanceRepository.findOne({
        where: {
          user: { studentId: user.studentId },
          assignment: {
            assignmentId: updateAttendanceDto.assignment.assignmentId,
          },
        },
      });

      const attendance_ = await this.attendanceRepository.findOne({
        where: {
          assignment: { assignmentId: updateAttendanceDto.assignmentId },
          attendanceId: id,
        },
      });
      attendance_.attendanceConfirmStatus =
        updateAttendanceDto.attendanceConfirmStatus;
      attendance_.attendanceStatus = updateAttendanceDto.attendanceStatus;
      attendance_.user = user;
      attendance_.attendanceScore = updateAttendanceDto.attendanceScore;
      //'if in time' 15 min late set attendanceStatus to 'late'

      return this.attendanceRepository.save(attendance_);
    } catch (error) {
      console.log('--------------');
      console.log(error);
    }
  }

  //get attendance by status
  async getAttendanceByStatusInAssignment(assignmentId: number) {
    try {
      // console.log(assignmentId);
      const attendances = await this.attendanceRepository.find({
        where: {
          attendanceConfirmStatus: In(['recheck']),
          assignment: { assignmentId: assignmentId },
        },
        relations: ['user'],
      });
      if (!attendances) {
        throw new NotFoundException('attendances not found');
      } else {
        return attendances;
      }
    } catch (error) {
      console.log(error);
    }
  }

  //  confirmAttendance
  async confirmAttendance(id: number) {
    try {
      const attendance = await this.attendanceRepository.findOne({
        where: { attendanceId: id },
        relations: ['assignment'],
      });
      if (!attendance) {
        throw new NotFoundException('attendance not found');
      }
      attendance.attendanceConfirmStatus = 'confirmed';
      if (attendance.attendanceStatus === 'absent') {
        // check timestamp late morethan 15 minutes ago
        const currentDate = new Date();
        const assignmentDate = new Date(attendance.assignment.assignMentTime);
        const diffMs = currentDate.getTime() - assignmentDate.getTime();
        const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
        if (diffMins > 15) {
          attendance.attendanceStatus = 'late';
        } else {
          attendance.attendanceStatus = 'present';
        }
      }
      return this.attendanceRepository.save(attendance);
    } catch (error) {
      console.log(error);
    }
  }
  //rejectAttendance
  async rejectAttendance(id: number) {
    const attendance = await this.attendanceRepository.findOne({
      where: { attendanceId: id },
      relations: ['assignment'],
    });
    if (!attendance) {
      throw new NotFoundException('attendance not found');
    }
    attendance.attendanceConfirmStatus = 'notconfirm';
    attendance.attendanceStatus = 'absent';
    attendance.attendanceImage = 'noimage.jpg';
    attendance.attendanceScore = 0;
    // console.log(attendance);
    return this.attendanceRepository.save(attendance);
  }
  //get attendance by couse id
  async getAttendanceByCourseId(courseId: string) {
    try {
      const attendances = await this.attendanceRepository.find({
        where: { assignment: { course: { coursesId: String(courseId) } } },
        relations: ['user', 'assignment'],
      });
      // console.log(attendances);

      if (!attendances) {
        throw new NotFoundException('attendances not found');
      } else {
        return attendances;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async revalidateAttendance(assignmentId: number) {
    try {
      const attendances = await this.attendanceRepository.find({
        where: { assignment: { assignmentId: assignmentId } },
        relations: ['user', 'assignment', 'assignment.course'],
      });

      // console.log(attendances);

      if (!attendances) {
        throw new NotFoundException('Attendances not found');
      }

      // Extract user IDs from the attendance records, skipping null users
      const usersInAttendanceIds = new Set(
        attendances
          .filter((a) => a.user) // Filter out attendances with null or undefined users
          .map((a) => a.user.userId),
      );

      // Get all users enrolled in the course
      const usersInCourse = await this.enrollmentRepository.find({
        where: {
          course: { coursesId: attendances[0].assignment.course.coursesId },
        },
        relations: ['user', 'course', 'user.attendance'],
      });

      const usersInCourseList = usersInCourse.map(
        (enrollment) => enrollment.user,
      );

      // Find users who are in the course but not in the attendance records
      const usersToCreateAttendance = usersInCourseList.filter(
        (user) => !usersInAttendanceIds.has(user.userId),
      );

      // Group attendances by userId to find duplicates, skip null users
      const groupedAttendances = attendances.reduce((group, att) => {
        if (!att.user) {
          return group; // Skip records where the user is null or undefined
        }

        const userId = att.user.userId;
        if (!group[userId]) {
          group[userId] = [];
        }
        group[userId].push(att);
        return group;
      }, {});

      // Process duplicate attendances
      for (const userId in groupedAttendances) {
        const userAttendances = groupedAttendances[userId];
        if (userAttendances.length > 1) {
          // Sort attendances by score (assuming attendanceScore exists)
          userAttendances.sort((a, b) => b.attendanceScore - a.attendanceScore);
          const bestAttendance = userAttendances[0];

          // Remove all duplicate attendances except the one with the highest score
          for (let i = 1; i < userAttendances.length; i++) {
            await this.attendanceRepository.remove(userAttendances[i]);
          }

          // Update the best attendance if necessary (optional)
          bestAttendance.attendanceConfirmStatus = 'notconfirm';
          await this.attendanceRepository.save(bestAttendance);
        }
      }

      // Remove image if it exists
      const imagePath = join('./', 'attendance_image');
      const image = attendances[0].attendanceImage;
      const imageFullPath = join(imagePath, image);

      try {
        await fsPromises.unlink(imageFullPath);
      } catch (error) {
        console.error('Error removing image:', error);
      }

      // Create attendance records for users without existing records
      for (const user of usersToCreateAttendance) {
        const newAttendance = new Attendance();
        newAttendance.user = user;
        newAttendance.assignment = attendances[0].assignment;
        newAttendance.attendanceDate = new Date();
        newAttendance.attendanceStatus = 'absent';
        newAttendance.attendanceConfirmStatus = 'notconfirm';
        newAttendance.attendanceImage = 'noimage.jpg';

        await this.attendanceRepository.save(newAttendance);
      }

      return 'Attendance revalidated';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error revalidating attendance');
    }
  }

  //check all attendance
  async checkAllAttendance(assignmentId: number) {
    // Fetch the assignment and its related course
    const assignment = await this.assignmentRepository.findOne({
      where: { assignmentId: assignmentId },
      relations: ['course'],
    });
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const course = assignment.course;

    // Fetch the enrollments for the course
    const enrollments = await this.enrollmentRepository.find({
      where: { course: { coursesId: course.coursesId } },
      relations: ['user'],
    });

    if (!enrollments.length) {
      throw new NotFoundException('No enrollments found for this course');
    }

    // Loop through the enrolled students and create or update attendance records
    for (const enrollment of enrollments) {
      const student = enrollment.user;

      let attendance = await this.attendanceRepository.findOne({
        where: { user: student, assignment: assignment },
      });

      if (!attendance) {
        // Create new attendance record if not found
        attendance = new Attendance();
        attendance.user = student;
        attendance.assignment = assignment;
        attendance.attendanceDate = new Date();
        attendance.attendanceStatus = 'absent';
        attendance.attendanceConfirmStatus = 'not confirmed';
      }
      if (
        attendance.attendanceStatus === 'present' ||
        attendance.attendanceStatus === 'present'
      ) {
        // Update attendance status if it is 'present'
        attendance.attendanceStatus = 'present';
        attendance.attendanceConfirmStatus = 'confirmed';
      }

      await this.attendanceRepository.save(attendance);
    }

    console.log('All student attendance checked');
    return 'All student attendance checked';
  }

  // get attdent by assigment and student enrollment
  async getAttendanceByAssignmentAndStudent(
    assignmentId: number,
    studentId: string,
  ) {
    try {
      const attendance = await this.attendanceRepository.findOne({
        where: {
          assignment: { assignmentId: assignmentId },
          user: { studentId: studentId },
        },
        relations: ['user', 'assignment'],
      });

      if (!attendance) {
        throw new NotFoundException('attendance not found');
      } else {
        return attendance;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
