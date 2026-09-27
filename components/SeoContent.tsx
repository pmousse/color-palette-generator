"use client";

import { seoSections } from "@/lib/seo-data";

export default function SeoContent() {
  const sectionColors = [
    "#1bc0b5",  // palette-1 - teal
    "#29bfe0",  // palette-2 - light blue
    "#1868a5",  // palette-3 - dark blue
    "#3b70e3",  // palette-4 - blue
    "#2d39e1",  // palette-5 - indigo
  ];

  return (
    <div className="space-y-16">
      {seoSections.map((section, sectionIndex) => {
        const color = sectionColors[sectionIndex % sectionColors.length];
        return (
        <section key={section.id} className="bg-white rounded-2xl shadow-lg p-8 border-l-4" style={{ borderLeftColor: color }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: color }}>{section.title}</h2>

          {section.content && (
            <div className="space-y-4 text-gray-600">
              {section.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </section>
        );
      })}
    </div>
  );
}
