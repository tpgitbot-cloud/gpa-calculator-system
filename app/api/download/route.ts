import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

interface StudentResult {
  name: string;
  registerNumber: string;
  grades: { [subject: string]: string };
  gpa: number;
  creditsPerSubject: { [subject: string]: number };
}

interface DownloadRequest {
  students: StudentResult[];
  subjects: string[];
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as DownloadRequest;
    const { students, subjects } = body;

    if (!students || !Array.isArray(students)) {
      return NextResponse.json(
        { error: "Invalid student data" },
        { status: 400 }
      );
    }

    // Create worksheet data
    const wsData: Array<Record<string, unknown>> = [];

    // Add header row
    const headers: Record<string, unknown> = {
      "Student Name": "Student Name",
      "Register Number": "Register Number",
    };

    for (const subject of subjects) {
      headers[`${subject} (Grade)`] = `${subject} (Grade)`;
      headers[`${subject} (Credit)`] = `${subject} (Credit)`;
    }

    headers["GPA"] = "GPA";
    wsData.push(headers);

    // Add data rows
    for (const student of students) {
      const row: Record<string, unknown> = {
        "Student Name": student.name,
        "Register Number": student.registerNumber,
      };

      for (const subject of subjects) {
        row[`${subject} (Grade)`] = student.grades[subject] || "-";
        row[`${subject} (Credit)`] = student.creditsPerSubject[subject] || 0;
      }

      row["GPA"] = student.gpa;
      wsData.push(row);
    }

    // Create workbook
    const worksheet = XLSX.utils.json_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

    // Set column widths
    const maxWidth = 20;
    const colWidths = Array(Object.keys(headers).length).fill(maxWidth);
    worksheet["!cols"] = colWidths.map((w) => ({ wch: w }));

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="GPA_Result.xlsx"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to generate Excel file" },
      { status: 500 }
    );
  }
}
