"use client";

import React, { useState, useMemo } from "react";

interface StudentResult {
  name: string;
  registerNumber: string;
  grades: { [subject: string]: string };
  gpa: number;
  hasFail: boolean;
  creditsPerSubject: { [subject: string]: number };
}

interface ResultsTableProps {
  students: StudentResult[];
  subjects: string[];
  topStudents: Array<{ name: string; registerNumber: string; gpa: number }>;
  onDownload: () => void;
  isDownloading: boolean;
}

export default function ResultsTable({
  students,
  subjects,
  topStudents,
  onDownload,
  isDownloading,
}: ResultsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"gpa" | "name">("gpa");
  const [showTopOnly, setShowTopOnly] = useState(false);

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter((student) =>
      student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (showTopOnly) {
      filtered = filtered.filter((s) =>
        topStudents.some((t) => t.registerNumber === s.registerNumber)
      );
    }

    return filtered.sort((a, b) => {
      if (sortBy === "gpa") {
        return b.gpa - a.gpa;
      }
      return a.name.localeCompare(b.name);
    });
  }, [students, searchTerm, sortBy, showTopOnly, topStudents]);

  const failedCount = students.filter((s) => s.hasFail).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold text-blue-600">{students.length}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Failed (U Grade)</p>
          <p className="text-2xl font-bold text-red-600">{failedCount}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Top 10 Students</p>
          <p className="text-2xl font-bold text-green-600">{topStudents.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Passed Students</p>
          <p className="text-2xl font-bold text-purple-600">
            {students.length - failedCount}
          </p>
        </div>
      </div>

      {/* Top 10 Students */}
      {topStudents.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Top 10 Students</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {topStudents.map((student, index) => (
              <div key={index} className="bg-white rounded p-3 shadow-sm">
                <p className="text-sm text-gray-600">#{index + 1}</p>
                <p className="font-semibold text-gray-800 truncate">
                  {student.name}
                </p>
                <p className="text-xs text-gray-500">{student.registerNumber}</p>
                <p className="text-lg font-bold text-green-600">{student.gpa}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search by Register Number
          </label>
          <input
            type="text"
            placeholder="Enter register number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "gpa" | "name")}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="gpa">GPA (High to Low)</option>
            <option value="name">Name (A to Z)</option>
          </select>
        </div>

        <button
          onClick={() => setShowTopOnly(!showTopOnly)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showTopOnly
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {showTopOnly ? "Showing Top 10" : "Show All"}
        </button>

        <button
          onClick={onDownload}
          disabled={isDownloading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {isDownloading ? (
            <>
              <span className="spinner w-4 h-4 border-2 border-white border-t-green-600" />
              Downloading...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Excel
            </>
          )}
        </button>
      </div>

      {/* Results Table */}
      <div className="table-sticky-header">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white sticky top-0 z-10">
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Register No.</th>
              {subjects.map((subject) => (
                <th key={subject} className="px-4 py-3 text-center font-semibold">
                  {subject}
                </th>
              ))}
              <th className="px-4 py-3 text-center font-semibold">GPA</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedStudents.map((student, index) => {
              const isTopStudent = topStudents.some(
                (t) => t.registerNumber === student.registerNumber
              );
              const rowClass = student.hasFail
                ? "failed-student"
                : isTopStudent
                  ? "top-student"
                  : "";

              return (
                <tr key={index} className={`border-b hover:bg-gray-50 ${rowClass}`}>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {student.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {student.registerNumber}
                  </td>
                  {subjects.map((subject) => (
                    <td key={subject} className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded font-semibold ${
                          student.grades[subject] === "U"
                            ? "bg-red-100 text-red-800"
                            : student.grades[subject] === "O"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {student.grades[subject] || "-"}
                      </span>
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded font-bold ${
                        student.gpa >= 8.5
                          ? "bg-green-100 text-green-800"
                          : student.gpa >= 7
                            ? "bg-blue-100 text-blue-800"
                            : student.gpa >= 5
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.gpa.toFixed(2)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredAndSortedStudents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No students found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
