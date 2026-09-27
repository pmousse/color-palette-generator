"use client";

import { seoSections } from "@/lib/seo-data";

export default function SeoContent() {
  return (
    <div className="space-y-16">
      {seoSections.map((section) => (
        <section key={section.id} className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>

          {section.content && (
            <div className="space-y-4 text-gray-600">
              {section.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
