import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GPA Calculator System",
  description:
    "Calculate student GPA using Excel file upload with Anna University standards",
  keywords: ["GPA", "Calculator", "Excel", "Students"],
  authors: [{ name: "GPA Calculator" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
