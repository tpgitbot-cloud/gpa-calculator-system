"use client";

import React, { useState, useEffect, useMemo } from "react";
import { findCreditsForSubject } from "./eceCreditsData";

interface CreditsFormProps {
  subjects: string[];
  onSubmit: (credits: { [subject: string]: number }) => void;
  isLoading: boolean;
}

export default function CreditsForm({
  subjects,
  onSubmit,
  isLoading,
}: CreditsFormProps) {
  const [credits, setCredits] = useState<{ [subject: string]: number }>({});
  const [showAutoMatched, setShowAutoMatched] = useState(false);

  // Try to auto-match credits from the ECE PDF data
  const { autoMatched, unmatched } = useMemo(() => {
    const autoMatched: { subject: string; credit: number }[] = [];
    const unmatched: string[] = [];

    for (const subject of subjects) {
      const credit = findCreditsForSubject(subject);
      if (credit !== undefined) {
        autoMatched.push({ subject, credit });
      } else {
        unmatched.push(subject);
      }
    }

    return { autoMatched, unmatched };
  }, [subjects]);

  // Pre-fill auto-matched credits on mount
  useEffect(() => {
    const autoCredits: { [subject: string]: number } = {};
    for (const { subject, credit } of autoMatched) {
      autoCredits[subject] = credit;
    }
    setCredits((prev) => ({ ...autoCredits, ...prev }));
  }, [autoMatched]);

  const handleCreditsChange = (subject: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCredits({
      ...credits,
      [subject]: Math.max(0, numValue),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that all subjects have credits > 0
    for (const subject of subjects) {
      if (!credits[subject] || credits[subject] <= 0) {
        alert(`Please enter valid credits for ${subject}`);
        return;
      }
    }

    onSubmit(credits);
  };

  const allAutoMatched = unmatched.length === 0;
  const autoMatchedCount = autoMatched.length;
  const totalSubjects = subjects.length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Subject Credits
      </h2>

      {/* Auto-match status banner */}
      {autoMatchedCount > 0 && (
        <div className={`mb-6 rounded-lg p-4 ${allAutoMatched ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
          <div className="flex items-center gap-3">
            <svg
              className={`w-6 h-6 flex-shrink-0 ${allAutoMatched ? 'text-green-600' : 'text-blue-600'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              {allAutoMatched ? (
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              )}
            </svg>
            <div>
              <p className={`font-semibold ${allAutoMatched ? 'text-green-800' : 'text-blue-800'}`}>
                {allAutoMatched
                  ? `✅ All ${autoMatchedCount} subjects matched from B.E. ECE curriculum!`
                  : `📋 ${autoMatchedCount} of ${totalSubjects} subjects auto-matched from B.E. ECE curriculum`}
              </p>
              {!allAutoMatched && (
                <p className="text-blue-700 text-sm mt-1">
                  Please enter credits for the {unmatched.length} unmatched subject{unmatched.length > 1 ? 's' : ''} below.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Unmatched subjects (need manual entry) */}
        {unmatched.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Enter Credits Manually ({unmatched.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unmatched.map((subject) => (
                <div key={subject} className="border border-red-200 rounded-lg p-3 bg-red-50">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {subject}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="e.g., 3 or 4"
                    value={credits[subject] || ""}
                    onChange={(e) => handleCreditsChange(subject, e.target.value)}
                    className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Auto-matched subjects (collapsed by default) */}
        {autoMatchedCount > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowAutoMatched(!showAutoMatched)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mb-3"
            >
              <svg
                className={`w-4 h-4 transition-transform ${showAutoMatched ? 'rotate-90' : ''}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {showAutoMatched ? 'Hide' : 'Show'} Auto-Matched Credits ({autoMatchedCount} subjects)
            </button>

            {showAutoMatched && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {autoMatched.map(({ subject, credit }) => (
                  <div key={subject} className="border border-green-200 rounded-lg p-3 bg-green-50">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {subject}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={credits[subject] || credit}
                      onChange={(e) => handleCreditsChange(subject, e.target.value)}
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-green-600 mt-1">✓ Auto-matched from PDF</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors text-lg"
          >
            {isLoading ? "Calculating..." : "Calculate GPA"}
          </button>
        </div>
      </form>
    </div>
  );
}
