export interface SeoSection {
  id: string;
  title: string;
  type: "content";
  content?: string[];
}

export const seoSections: SeoSection[] = [
  {
    id: "seo-intro",
    title: "Color Palette Generator - Create Beautiful, Accessible Color Schemes",
    type: "content",
    content: [
      "Our free color palette generator helps designers and developers create beautiful, accessible color combinations in seconds. Whether you're working on a website, mobile app, brand identity, or creative project, our tool uses color theory principles to generate harmonious palettes that make your designs stand out.",
      "With multiple harmony modes including Monochromatic, Analogous, Complementary, Triadic, Tetradic, Pastel, Vibrant, and Dark, you'll find the perfect color scheme for any project. Lock your favorite colors, export in multiple formats (CSS variables, Tailwind config, JSON, SVG), and ensure accessibility with built-in WCAG contrast checking.",
    ],
  },
];
