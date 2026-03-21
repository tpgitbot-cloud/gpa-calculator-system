import { NextRequest, NextResponse } from "next/server";

interface StudentData {
  name: string;
  registerNumber: string;
  grades: { [subject: string]: string };
  credits: { [subject: string]: number };
}

interface CalculationResponse {
  success: boolean;
  data?: {
    students: Array<{
      name: string;
      registerNumber: string;
      grades: { [subject: string]: string };
      gpa: number;
      hasFail: boolean;
      creditsPerSubject: { [subject: string]: number };
    }>;
    subjects: string[];
    topStudents: Array<{
      name: string;
      registerNumber: string;
      gpa: number;
    }>;
  };
  error?: string;
}

const gradeToPoint: { [key: string]: number } = {
  O: 10,
  "A+": 9,
  A: 8,
  "B+": 7,
  B: 6,
  C: 5,
  U: 0,
};

function calculateGPA(
  grades: { [subject: string]: string },
  credits: { [subject: string]: number }
): number {
  let totalPoints = 0;
  let totalCredits = 0;

  for (const [subject, grade] of Object.entries(grades)) {
    const point = gradeToPoint[grade] ?? 0;
    const credit = credits[subject] || 0;
    totalPoints += point * credit;
    totalCredits += credit;
  }

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

export async function POST(request: NextRequest): Promise<NextResponse<CalculationResponse>> {
  try {
    const body = await request.json() as {
      students: StudentData[];
      subjects: string[];
    };
    const { students, subjects } = body;

    if (!students || !Array.isArray(students)) {
      return NextResponse.json(
        { success: false, error: "Invalid student data" },
        { status: 400 }
      );
    }

    const processedStudents = students.map((student) => {
      const gpa = calculateGPA(student.grades, student.credits);
      const hasFail = Object.values(student.grades).includes("U");

      return {
        name: student.name,
        registerNumber: student.registerNumber,
        grades: student.grades,
        gpa: Math.round(gpa * 100) / 100,
        hasFail,
        creditsPerSubject: student.credits,
      };
    });

    // Sort by GPA descending and get top 10
    const topStudents = [...processedStudents]
      .sort((a, b) => b.gpa - a.gpa)
      .slice(0, 10)
      .map((s) => ({
        name: s.name,
        registerNumber: s.registerNumber,
        gpa: s.gpa,
      }));

    return NextResponse.json(
      {
        success: true,
        data: {
          students: processedStudents,
          subjects,
          topStudents,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Calculation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to calculate GPA" },
      { status: 500 }
    );
  }
}
