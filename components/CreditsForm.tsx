"use client";

import React, { useState } from "react";

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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Enter Subject Credits
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <div key={subject}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {subject}
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="e.g., 4.0"
                value={credits[subject] || ""}
                onChange={(e) => handleCreditsChange(subject, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
          ))}
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Calculating..." : "Calculate GPA"}
          </button>
        </div>
      </form>
    </div>
  );
}
