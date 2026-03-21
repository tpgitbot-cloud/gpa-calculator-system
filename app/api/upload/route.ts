import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

interface StudentRow {
  [key: string]: string | number;
}

interface ProcessedStudent {
  name: string;
  registerNumber: string;
  grades: { [subject: string]: string };
  gpa: number;
  hasFail: boolean;
}

interface UploadResponse {
  success: boolean;
  data?: {
    students: ProcessedStudent[];
    subjects: string[];
    totalStudents: number;
  };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    if (!file.name.endsWith(".xlsx")) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Please upload .xlsx file" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<StudentRow>(worksheet);

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, error: "No data found in Excel file" },
        { status: 400 }
      );
    }

    // Detect columns
    const headers = Object.keys(data[0]);
    let nameColumn = "";
    let registerColumn = "";
    const subjectColumns: string[] = [];

    // Try to find Name and Register Number columns
    for (const header of headers) {
      const lowerHeader = header.toLowerCase();
      if (lowerHeader.includes("name") || lowerHeader === "student name") {
        nameColumn = header;
      } else if (
        lowerHeader.includes("register") ||
        lowerHeader.includes("registration") ||
        lowerHeader.includes("roll")
      ) {
        registerColumn = header;
      }
    }

    // If not found, use first two columns
    if (!nameColumn && headers.length > 0) {
      nameColumn = headers[0];
    }
    if (!registerColumn && headers.length > 1) {
      registerColumn = headers[1];
    }

    // Remaining columns are subjects
    for (const header of headers) {
      if (header !== nameColumn && header !== registerColumn) {
        subjectColumns.push(header);
      }
    }

    if (subjectColumns.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No subject columns found. Expected columns after Name and Register Number",
        },
        { status: 400 }
      );
    }

    // Process students
    const students: ProcessedStudent[] = [];

    for (const row of data) {
      const name = String(row[nameColumn] || "").trim();
      const registerNumber = String(row[registerColumn] || "").trim();

      if (!name || !registerNumber) {
        continue;
      }

      const grades: { [subject: string]: string } = {};
      let hasFail = false;

      for (const subject of subjectColumns) {
        const grade = String(row[subject] || "").trim().toUpperCase();
        if (grade) {
          grades[subject] = grade;

          // Check for U grade (fail)
          if (grade === "U") {
            hasFail = true;
          }
        }
      }

      students.push({
        name,
        registerNumber,
        grades,
        gpa: 0,
        hasFail,
      });
    }

    if (students.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid student records found" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          students,
          subjects: subjectColumns,
          totalStudents: students.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process file" },
      { status: 500 }
    );
  }
}
