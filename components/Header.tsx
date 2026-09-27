"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* Simple color palette icon */}
          <svg
            className="w-8 h-8"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="16" r="8" fill="#4F46E5" />
            <circle cx="22" cy="16" r="8" fill="#EC4899" />
            <circle cx="16" cy="10" r="8" fill="#10B981" />
          </svg>
          <span className="text-lg font-bold text-gray-900">Color Palette Generator</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/help"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Help
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Terms
          </Link>
        </div>
      </nav>
    </header>
  );
}
