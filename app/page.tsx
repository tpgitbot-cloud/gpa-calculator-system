"use client";

import React, { useState } from "react";
import Upload from "@/components/Upload";
import ScreenshotUpload from "@/components/ScreenshotUpload";
import CreditsForm from "@/components/CreditsForm";
import ResultsTable from "@/components/ResultsTable";
import LoadingSpinner from "@/components/LoadingSpinner";


interface StudentData {
  name: string;
  registerNumber: string;
  grades: { [subject: string]: string };
  gpa: number;
  hasFail: boolean;
  creditsPerSubject?: { [subject: string]: number };
}

interface TopStudent {
  name: string;
  registerNumber: string;
  gpa: number;
}

type AppState = "upload" | "credits" | "results";
type UploadMode = "excel" | "screenshot";


export default function Home() {
  const [appState, setAppState] = useState<AppState>("upload");
  const [uploadMode, setUploadMode] = useState<UploadMode>("excel");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingScreenshot, setIsProcessingScreenshot] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);


  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to upload file");
      }

      setStudents(data.data.students);
      setSubjects(data.data.subjects);
      setAppState("credits");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Upload error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OCR result from screenshot
  const handleOCRResult = (result: {
    grades: { [subject: string]: string };
    studentName?: string;
    registerNumber?: string;
  }) => {
    const student: StudentData = {
      name: result.studentName || "Extracted Student",
      registerNumber: result.registerNumber || "N/A",
      grades: result.grades,
      gpa: 0,
      hasFail: Object.values(result.grades).includes("U"),
    };

    setStudents([student]);
    setSubjects(Object.keys(result.grades));
    setAppState("credits");
  };


  // Handle credits submission
  const handleCreditsSubmit = async (
    credits: { [subject: string]: number }
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Update students with credits
      const studentsWithCredits = students.map((student) => ({
        ...student,
        credits,
      }));

      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          students: studentsWithCredits,
          subjects,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to calculate GPA");
      }

      setStudents(data.data.students);
      setTopStudents(data.data.topStudents);
      setAppState("results");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Calculation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle download
  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          students: students as Array<StudentData & { creditsPerSubject: { [subject: string]: number } }>,
          subjects,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "GPA_Result.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Download error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Reset to upload
  const handleReset = () => {
    setAppState("upload");
    setStudents([]);
    setSubjects([]);
    setTopStudents([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h1 className="text-4xl font-bold text-gray-800">
              GPA Calculator System
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Calculate student GPA using Anna University standards
          </p>
        </header>

        {/* Progress indicator */}
        {appState !== "upload" && (
          <div className="mb-8 flex items-center justify-center gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                appState === "credits" || appState === "results"
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              ✓
            </div>
            <div className="w-12 h-1 bg-gray-300"></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                appState === "results"
                  ? "bg-green-600 text-white"
                  : appState === "credits"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-700"
              }`}
            >
              {appState === "results" ? "✓" : "2"}
            </div>
            <div className="w-12 h-1 bg-gray-300"></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                appState === "results"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              3
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-6">
          {appState === "upload" && (
            <div className="space-y-6">
              {/* Tab Selector */}
              <div className="flex justify-center mb-8">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex pointer-events-auto">
                  <button
                    onClick={() => setUploadMode("excel")}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      uploadMode === "excel"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Excel File Upload
                  </button>
                  <button
                    onClick={() => setUploadMode("screenshot")}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      uploadMode === "screenshot"
                        ? "bg-purple-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Instant Screenshot
                  </button>
                </div>
              </div>

              {uploadMode === "excel" ? (
                <Upload onFileUpload={handleFileUpload} isLoading={isLoading} />
              ) : (
                <ScreenshotUpload 
                  onResultParsed={handleOCRResult} 
                  isProcessing={isProcessingScreenshot}
                  setIsProcessing={setIsProcessingScreenshot}
                />
              )}
            </div>
          )}


          {appState === "credits" && (
            <>
              {isLoading ? (
                <LoadingSpinner message="Processing Excel file..." />
              ) : (
                <CreditsForm
                  subjects={subjects}
                  onSubmit={handleCreditsSubmit}
                  isLoading={isLoading}
                />
              )}
            </>
          )}

          {appState === "results" && (
            <>
              {isLoading ? (
                <LoadingSpinner message="Calculating GPA..." />
              ) : (
                <ResultsTable
                  students={students as Array<StudentData & { creditsPerSubject: { [subject: string]: number } }>}
                  subjects={subjects}
                  topStudents={topStudents}
                  onDownload={handleDownload}
                  isDownloading={isDownloading}
                />
              )}
            </>
          )}
        </div>

        {/* Action buttons */}
        {appState !== "upload" && !isLoading && (
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              ← Start Over
            </button>

            {appState === "credits" && (
              <button
                onClick={() => setAppState("upload")}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition-colors"
              >
                Back to Upload
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>
            © 2026 GPA Calculator System | Anna University Standards | Vercel
            Ready
          </p>
        </footer>
      </div>
    </div>
  );
}
