/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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
        relations: ['user'],
      });
      if (!attendances) {
        throw new NotFoundException('attendances not found');
      } else {
        console.log(attendances.length);
        return attendances;
      }
    } catch (error) {
      console.log(error);
    }
  }

  //update
  async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    try {
      console.log(id);

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
        attendance.attendanceStatus !== 'present' &&
        attendance.attendanceStatus !== 'absent'
      ) {
        // send nopermition exeption 403

        throw new HttpErrorByCode[403]('You do not have permission to update');
      } else {
        console.log('attendanceUpdate', updateAttendanceDto);

        const attendance_ = await this.attendanceRepository.findOne({
          where: {
            attendanceId: id,
            assignment: { assignmentId: +updateAttendanceDto.assignmentId },
            user: { studentId: updateAttendanceDto.studentId },
          },
        });
        console.log('attendance_', attendance_);

        attendance_.attendanceConfirmStatus =
          updateAttendanceDto.attendanceConfirmStatus;
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
        //'if in time' 15 min late set attendanceStatus to 'late'
        const currentDate = new Date();
        const assignmentDate = new Date(updateAttendanceDto.assignMentTime);
        const diff = Math.abs(currentDate.getTime() - assignmentDate.getTime());
        attendance_.attendanceStatus =
          Math.ceil(diff / (1000 * 60)) > 2 ? 'late' : 'present';

        const attSave = await this.attendanceRepository.save(attendance_);
        console.log('attSave', attSave);
        return attSave;
      }
    } catch (error) {
      console.log('--------------');
      console.log(error);
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
      console.log(assignmentId);
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
      attendance.attendanceStatus = 'present';

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
    attendance.attendanceConfirmStatus = 'confirmed';
    attendance.attendanceStatus = 'absent';
    attendance.attendanceImage = 'noimage.jpg';
    console.log(attendance);
    return this.attendanceRepository.save(attendance);
  }
  //get attendance by couse id
  async getAttendanceByCourseId(courseId: number) {
    try {
      const attendances = await this.attendanceRepository.find({
        where: { assignment: { course: { coursesId: String(courseId) } } },
        relations: ['user', 'assignment'],
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
