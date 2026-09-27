"use client";

import { helpSections } from "@/lib/help-data";

export default function HelpContent() {
  return (
    <div className="space-y-16">
      {helpSections.map((section) => (
        <section key={section.id} className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>

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
            <div className="space-y-6">
              {section.items.map((item, index) => (
                <FAQItem key={index} question={item.question} answer={item.answer} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-gray-100 pb-6 last:border-0">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
}
