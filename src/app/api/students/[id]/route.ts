import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: number | string } }
) {
  const studentId = parseInt(params.id as string, 10);

  if (isNaN(studentId)) {
    return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 });
  }

  try {
    // First, check if student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Delete related results
    await prisma.result.deleteMany({
      where: { studentId },
    });

    // Delete related attendances
    await prisma.attendance.deleteMany({
      where: { studentId },
    });

    // Finally, delete the student
    await prisma.student.delete({
      where: { id: studentId },
    });

    return NextResponse.json(
      { message: 'Student and related data deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting student and related data:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
export async function PATCH(
  request: Request,
  { params }: { params: { id: string | number } }
) {
  const studentId = parseInt(params.id as string, 10);

  if (isNaN(studentId)) {
    return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
  }

  const {
    username,
    name,
    surname,
    email,
    phone,
    address,
    bloodType,
    sex,
    parentId,
    classId,
    gradeId,
    birthday,
  } = await request.json();

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const updated = await prisma.student.update({
      where: { id: studentId },
      data: {
        ...(username && { username }),
        ...(name && { name }),
        ...(surname && { surname }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(address && { address }),
        ...(bloodType && { bloodType }),
        ...(sex && { sex }),
        ...(parentId && { parentId }),
        ...(classId && { classId }),
        ...(gradeId && { gradeId }),
        ...(birthday && { birthday: new Date(birthday) }),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("Update failed:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}



export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const studentId = parseInt(params.id, 10);

  if (isNaN(studentId)) {
    return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 });
  }

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        class: true,
        grade: true,
        parent: true,
        attendances: true,
        results: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch student:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
