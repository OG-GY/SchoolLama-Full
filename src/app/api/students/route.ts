import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    console.log('Received body:', request.json);
    const body = await request.json();

    const {
      id,
      username,
      name,
      surname,
      email,
      phone,
      address,
      img,
      bloodType,
      sex,
      parentId,
      classId,
      gradeId,
      birthday
    } = body;

    const newStudent = await prisma.student.create({
      data: {
        id,
        username,
        name,
        surname,
        email,
        phone,
        address,
        img: img || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",  // <-- default if no img
        bloodType,
        sex,
        parentId,
        classId,
        gradeId,
        birthday: new Date(birthday),
      } as Prisma.StudentUncheckedCreateInput,
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}


export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        class: true,
        grade: true,
        parent: true,
      },
    });

    const formattedStudents = students.map((student, index) => ({
      id: index + 1,
      studentId: student.id,
      name: `${student.name} ${student.surname}`,
      email: student.email,
      photo: student.img || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      phone: student.phone || "N/A",
      grade: student.grade?.level ?? null,
      class: student.class?.name ?? null,
      address: student.address,
    }));

    return NextResponse.json(formattedStudents);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students.' }, { status: 500 });
  }
}


