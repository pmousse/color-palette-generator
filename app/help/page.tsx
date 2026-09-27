"use client";

import { useRouter } from "next/navigation";
import HelpContent from "@/components/HelpContent";

export default function Help() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Help &amp; Guide</h1>

        <HelpContent />

        {/* Back to home */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Generator
          </button>
        </div>
      </div>
    </div>
  );
}
