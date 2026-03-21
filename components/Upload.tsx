"use client";

import React, { useState } from "react";

interface UploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export default function Upload({ onFileUpload, isLoading }: UploadProps) {
  const [dragActive, setDragActive] = useState(false);

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
      if (file.name.endsWith(".xlsx")) {
        onFileUpload(file);
      } else {
        alert("Please upload a .xlsx file");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith(".xlsx")) {
        onFileUpload(file);
      } else {
        alert("Please upload a .xlsx file");
      }
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
        dragActive ? "drag-active" : "border-gray-300 bg-white"
      } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div className="flex flex-col items-center gap-3">
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>

        <div>
          <p className="text-lg font-semibold text-gray-700">
            Drag and drop your Excel file here
          </p>
          <p className="text-sm text-gray-500 mt-1">or click to browse</p>
        </div>

        <input
          type="file"
          accept=".xlsx"
          onChange={handleChange}
          className="hidden"
          id="file-upload"
          disabled={isLoading}
        />

        <label
          htmlFor="file-upload"
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Select File"}
        </label>

        <p className="text-xs text-gray-400 mt-2">
          Supported format: .xlsx (Microsoft Excel)
        </p>
      </div>
    </div>
  );
}
