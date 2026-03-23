"use client";

import React, { useState, useCallback } from "react";

interface ScreenshotUploadProps {
  onResultParsed: (result: {
    grades: { [subject: string]: string };
    studentName?: string;
    registerNumber?: string;
  }) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
}

export default function ScreenshotUpload({
  onResultParsed,
  isProcessing,
  setIsProcessing,
}: ScreenshotUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setError(null);
      setProgress(0);
      setStatusText("Loading OCR engine...");

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      try {
        // Dynamic import of tesseract.js for client-side OCR
        const Tesseract = await import("tesseract.js");

        setProgress(10);
        setStatusText("Initializing text recognition...");

        const result = await Tesseract.recognize(file, "eng", {
          logger: (m: { status: string; progress: number }) => {
            if (m.status === "recognizing text") {
              setProgress(10 + Math.round(m.progress * 80));
              setStatusText("Recognizing text from screenshot...");
            } else if (m.status === "loading language traineddata") {
              setProgress(5);
              setStatusText("Loading language data...");
            }
          },
        });

        setProgress(90);
        setStatusText("Parsing grades from text...");

        const extractedText = result.data.text;
        console.log("OCR Extracted Text:", extractedText);

        // Parse the text to extract grades
        const parsed = parseResultText(extractedText);

        if (Object.keys(parsed.grades).length === 0) {
          setError(
            "Could not detect any grades from the screenshot. Please make sure the screenshot clearly shows subject codes/names and grades (O, A+, A, B+, B, C, U)."
          );
          setIsProcessing(false);
          return;
        }

        setProgress(100);
        setStatusText(
          `Found ${Object.keys(parsed.grades).length} subjects!`
        );

        // Small delay to show completion
        setTimeout(() => {
          onResultParsed(parsed);
          setIsProcessing(false);
        }, 500);
      } catch (err) {
        console.error("OCR Error:", err);
        setError(
          "Failed to process the screenshot. Please try again with a clearer image."
        );
        setIsProcessing(false);
      }
    },
    [onResultParsed, setIsProcessing]
  );

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        processImage(file);
      } else {
        setError("Please upload an image file (PNG, JPG, etc.)");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        processImage(file);
      } else {
        setError("Please upload an image file (PNG, JPG, etc.)");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? "border-purple-500 bg-purple-50 scale-[1.02]"
            : "border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50/30"
        } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-700">
              Drop your result screenshot here
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Upload a screenshot of your Anna University result page
            </p>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            id="screenshot-upload"
            disabled={isProcessing}
          />

          <label
            htmlFor="screenshot-upload"
            className="mt-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all cursor-pointer shadow-md hover:shadow-lg"
          >
            📷 Select Screenshot
          </label>

          <p className="text-xs text-gray-400 mt-1">
            Supports: PNG, JPG, JPEG, WebP
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
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

      {/* Processing progress */}
      {isProcessing && (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="spinner w-6 h-6 border-3 border-purple-200 border-t-purple-600 rounded-full"></div>
            <span className="font-medium text-gray-700">{statusText}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 text-right">{progress}%</p>
        </div>
      )}

      {/* Preview of uploaded image */}
      {preview && !isProcessing && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-sm font-medium text-gray-600 mb-2">
            Uploaded Screenshot:
          </p>
          <img
            src={preview}
            alt="Uploaded screenshot"
            className="max-w-full max-h-64 mx-auto rounded-lg border border-gray-200"
          />
        </div>
      )}

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          Tips for best results
        </h4>
        <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
          <li>Take a clear, full-screen screenshot of your result page</li>
          <li>Make sure subject codes and grades are clearly visible</li>
          <li>Avoid cropping important information</li>
          <li>Use high resolution screenshots for better accuracy</li>
          <li>
            The system recognizes grades: O, A+, A, B+, B, C, U
          </li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Parse OCR text to extract subject codes and grades
 */
function parseResultText(text: string): {
  grades: { [subject: string]: string };
  studentName?: string;
  registerNumber?: string;
} {
  const grades: { [subject: string]: string } = {};
  let studentName: string | undefined;
  let registerNumber: string | undefined;

  // Normalize the text
  const lines = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const validGrades = ["O", "A+", "A", "B+", "B", "C", "U"];

  // Try to extract register number
  for (const line of lines) {
    const regMatch = line.match(
      /(?:register|reg\.?\s*(?:no|number)|registration)\s*[:\-]?\s*(\d{6,15})/i
    );
    if (regMatch) {
      registerNumber = regMatch[1];
    }

    // Try to find name
    const nameMatch = line.match(
      /(?:name|student\s*name)\s*[:\-]?\s*([A-Za-z\s.]+)/i
    );
    if (nameMatch && nameMatch[1].trim().length > 2) {
      studentName = nameMatch[1].trim();
    }
  }

  // Strategy 1: Look for course code + grade patterns
  // Common patterns: "MA3151 O", "EC3251 A+", "CS3353 B+"
  const codeGradePattern =
    /([A-Z]{2,3}\d{4})\s*[:\-]?\s*(O|A\+|A|B\+|B|C|U)\b/gi;
  let match;
  while ((match = codeGradePattern.exec(text)) !== null) {
    const code = match[1].toUpperCase();
    const grade = match[2].toUpperCase();
    if (validGrades.includes(grade)) {
      grades[code] = grade;
    }
  }

  // Strategy 2: Look for grade followed by code (some results show grade first)
  const gradeCodePattern =
    /\b(O|A\+|A|B\+|B|C|U)\s+([A-Z]{2,3}\d{4})\b/gi;
  while ((match = gradeCodePattern.exec(text)) !== null) {
    const grade = match[1].toUpperCase();
    const code = match[2].toUpperCase();
    if (validGrades.includes(grade) && !grades[code]) {
      grades[code] = grade;
    }
  }

  // Strategy 3: Look for subject code anywhere near a grade on the same line
  for (const line of lines) {
    const codes = line.match(/[A-Z]{2,3}\d{4}/g);
    const gradeMatches = line.match(/\b(O|A\+|A|B\+|B|C|U)\b/g);

    if (codes && gradeMatches) {
      // If there's exactly one code and one grade on the line, match them
      if (codes.length === 1 && gradeMatches.length === 1) {
        const code = codes[0].toUpperCase();
        const grade = gradeMatches[0].toUpperCase();
        if (validGrades.includes(grade) && !grades[code]) {
          grades[code] = grade;
        }
      }
      // If there are equal numbers of codes and grades, match them in order
      else if (codes.length === gradeMatches.length) {
        for (let i = 0; i < codes.length; i++) {
          const code = codes[i].toUpperCase();
          const grade = gradeMatches[i].toUpperCase();
          if (validGrades.includes(grade) && !grades[code]) {
            grades[code] = grade;
          }
        }
      }
    }
  }

  // Strategy 4: Look in table-like structures
  // Some OCR results have structured rows with code, title, and grade
  for (const line of lines) {
    const tableMatch = line.match(
      /([A-Z]{2,3}\d{4})\s+.*?\s+(O|A\+|A|B\+|B|C|U)\s*$/i
    );
    if (tableMatch) {
      const code = tableMatch[1].toUpperCase();
      const grade = tableMatch[2].toUpperCase();
      if (validGrades.includes(grade) && !grades[code]) {
        grades[code] = grade;
      }
    }
  }

  return { grades, studentName, registerNumber };
}
