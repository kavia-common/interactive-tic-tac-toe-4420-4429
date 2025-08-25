import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tic Tac Toe — PvP",
  description: "A modern, responsive Tic Tac Toe game (player vs player) with session score tracking.",
  applicationName: "Tic Tac Toe",
  authors: [{ name: "Kavia Code Generation" }],
  themeColor: "#1E90FF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="container-app" role="application" aria-label="Tic Tac Toe Game">
          {children}
        </div>
      </body>
    </html>
  );
}
