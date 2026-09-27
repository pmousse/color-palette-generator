"use client";

import { useState } from "react";
import { helpSections } from "@/lib/help-data";

export default function HelpContent() {
  const [expandedFAQIndex, setExpandedFAQIndex] = useState<string | null>(null);
  const sectionColors = [
    "#1bc0b5",  // palette-1 - teal
    "#29bfe0",  // palette-2 - light blue
    "#1868a5",  // palette-3 - dark blue
    "#3b70e3",  // palette-4 - blue
    "#2d39e1",  // palette-5 - indigo
  ];

  return (
    <div className="space-y-16">
      {helpSections.map((section, sectionIndex) => {
        const color = sectionColors[sectionIndex % sectionColors.length];
        return (
        <section key={section.id} className="bg-white rounded-2xl shadow-lg p-8 border-l-4" style={{ borderLeftColor: color }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: color }}>{section.title}</h2>

          {section.type === "howto" && section.content && (
            <div className="space-y-4 text-gray-600">
              {section.content.map((paragraph, index) => {
                const boldMatch = paragraph.match(/^(\d+\..*?)(.*)/);
                if (boldMatch) {
                  return (
                    <p key={index}>
                      <strong className="text-gray-900">{boldMatch[1]}.</strong>
                      {boldMatch[2]}
                    </p>
                  );
                }
                return <p key={index}>{paragraph}</p>;
              })}
            </div>
          )}

          {section.type === "content" && section.content && (
            <div className="space-y-4 text-gray-600">
              {section.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}

          {section.type === "tips" && section.content && (
            <div className="space-y-4 text-gray-600">
              {section.content.map((tip, index) => {
                const parts = tip.split(". ");
                if (parts.length >= 2) {
                  return (
                    <p key={index}>
                      <strong className="text-gray-900">{parts[0]}.</strong> {parts.slice(1).join(". ")}
                      {tip.endsWith("context.") && (
                        <span className="text-sm text-gray-400 italic">
                          {" "}
                          — This tool gives helpful guidance, but it's not a substitute for testing in your specific design context.
                        </span>
                      )}
                    </p>
                  );
                }
                return <p key={index}>{tip}</p>;
              })}
            </div>
          )}

          {section.type === "faq" && section.items && (
            <div className="space-y-4">
              {section.items.map((item, index) => (
                <FAQItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  isOpen={expandedFAQIndex === `${section.id}-${index}`}
                  onToggle={() => setExpandedFAQIndex(expandedFAQIndex === `${section.id}-${index}` ? null : `${section.id}-${index}`)}
                />
              ))}
            </div>
          )}
        </section>
        );
      })}
    </div>
  );
}

function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200 pb-4 last:border-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-gray-900 pr-4">{question}</h3>
        <svg
          className={`w-6 h-6 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
}
