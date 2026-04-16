"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-card px-4 py-4 text-center text-sm text-muted-foreground">
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-3">
        
        <span>
          Built by{" "}
          <span className="font-medium text-foreground">
            Ankit Agarwal
          </span>
        </span>

        <span className="hidden sm:inline">•</span>

        <Link
          href="https://github.com/ankit-agarwal-devx"
          target="_blank"
          className="transition-colors hover:text-foreground hover:underline"
        >
          GitHub
        </Link>

        <span className="hidden sm:inline">•</span>

        <Link
          href="https://www.linkedin.com/in/iankitagarwal/"
          target="_blank"
          className="transition-colors hover:text-foreground hover:underline"
        >
          LinkedIn
        </Link>

      </div>
    </footer>
  );
}