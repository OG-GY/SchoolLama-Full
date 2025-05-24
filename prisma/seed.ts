// const { PrismaClient, UserSex, Day } = require('@prisma/client');
// const prisma = new PrismaClient();

// async function main() {
//   // Create Grades
//   const grade = await prisma.grade.create({
//     data: { level: 1 },
//   });

//   // Create Parent
//   const parent = await prisma.parent.create({
//     data: {
//       username: 'parent1',
//       name: 'Ali',
//       surname: 'Khan',
//       email: 'ali.khan@example.com',
//       phone: '03001234567',
//       address: 'Lahore, Pakistan',
//     },
//   });

//   // Create Teacher
//   const teacher = await prisma.teacher.create({
//     data: {
//       id: 1,
//       username: 'teacher1',
//       name: 'Sara',
//       surname: 'Malik',
//       email: 'sara.malik@example.com',
//       phone: '03111234567',
//       address: 'Islamabad, Pakistan',
//       bloodType: 'A+',
//       sex: UserSex.FEMALE,
//       birthday: new Date('1990-05-15'),
//     },
//   });

//   // Create Class
//   const class1 = await prisma.class.create({
//     data: {
//       name: 'Class A',
//       capacity: 30,
//       gradeId: grade.id,
//       supervisorId: teacher.id,
//     },
//   });

//   // Create Student
//   const student = await prisma.student.create({
//     data: {
//       username: 'student1',
//       name: 'Ahmed',
//       surname: 'Raza',
//       email: 'ahmed.raza@example.com',
//       phone: '03211234567',
//       address: 'Karachi, Pakistan',
//       bloodType: 'B+',
//       sex: UserSex.MALE,
//       birthday: new Date('2005-01-10'),
//       classId: class1.id,
//       gradeId: grade.id,
//       parentId: parent.id,
//     },
//   });

//   // Create Subject
//   const subject = await prisma.subject.create({
//     data: {
//       name: 'Mathematics',
//       teachers: {
//         connect: { id: teacher.id },
//       },
//     },
//   });

//   // Create Lesson
//   const lesson = await prisma.lesson.create({
//     data: {
//       name: 'Algebra',
//       day: Day.MONDAY,
//       startTime: new Date('2024-06-01T08:00:00Z'),
//       endTime: new Date('2024-06-01T09:00:00Z'),
//       subjectId: subject.id,
//       classId: class1.id,
//       teacherId: teacher.id,
//     },
//   });

//   // Create Attendance
//   await prisma.attendance.create({
//     data: {
//       date: new Date(),
//       present: true,
//       studentId: student.id,
//       lessonId: lesson.id,
//     },
//   });

//   // Create Result
//   await prisma.result.create({
//     data: {
//       score: 88,
//       studentId: student.id,
//     },
//   });

//   console.log('✅ Data seeded successfully!');
// }

// main()
//   .catch((e) => {
//     console.error('❌ Error while seeding data:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
