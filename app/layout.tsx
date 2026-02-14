import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PitCrew - MCP Workflow Racer",
  description: "Secure, observable MCP workflow orchestration with Attack Lap security testing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
