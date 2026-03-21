"use client";

export default function LoadingSpinner({
  message = "Processing...",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full spinner"></div>
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
    </div>
  );
}
