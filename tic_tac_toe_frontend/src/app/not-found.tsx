"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center" aria-label="Page not found">
      <div className="card p-8 text-center">
        <h1 className="text-2xl font-extrabold mb-2">Page not found</h1>
        <p className="subtle mb-4">The page you are looking for does not exist.</p>
        <Link href="/" className="btn btn-primary">Go Home</Link>
      </div>
    </main>
  );
}
