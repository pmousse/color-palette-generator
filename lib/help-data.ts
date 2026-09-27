export interface HelpSection {
  id: string;
  title: string;
  type: "content" | "howto" | "tips" | "faq";
  content?: string[];
  items?: Array<{ question: string; answer: string }>;
}

export const helpSections: HelpSection[] = [
  {
    id: "how-to-use",
    title: "How to use this color palette generator",
    type: "howto",
    content: [
      "1. Start with a random palette or enter a seed color. Click the color picker or type a HEX value to set your starting point.",
      "2. Choose a harmony mode. Select from options like Monochromatic, Analogous, Complementary, Triadic, Tetradic, Pastel, Vibrant, or Dark to control how colors relate to each other.",
      "3. Lock colors you like. Click the lock icon on any color card to keep it while regenerating the rest.",
      "4. Regenerate the rest. Click \"Generate palette\" to create new colors for your unlocked positions.",
      "5. Copy HEX, RGB, HSL, CSS, or Tailwind values. Click any color value to copy it, or use the Export panel for complete code snippets.",
      "6. Save or share your palette. Save palettes locally or share them via URL with anyone.",
    ],
  },
  {
    id: "why-colors-matter",
    title: "Why color palettes matter",
    type: "content",
    content: [
      "A well-chosen color palette is the foundation of any great design. Consistent colors make products feel more recognizable, polished, and easier to use. Whether you're building a website, designing an app, or creating brand materials, your color choices communicate emotions, establish hierarchy, and guide user attention.",
      "Good color palettes create visual harmony, improve readability, and help users navigate your content intuitively. They also build brand identity — think of how instantly you can recognize a brand by its colors alone.",
      "This tool helps you discover beautiful color combinations quickly, so you can focus on creating great experiences instead of spending hours guessing which colors work together.",
    ],
  },
  {
    id: "accessible-colors",
    title: "Tips for choosing accessible colors",
    type: "tips",
    content: [
      "Test text against backgrounds. Always check that text is readable on its background. This tool provides contrast guidance, but you should verify in your actual design context.",
      "Use high contrast for body text. Body text should have a contrast ratio of at least 4.5:1 against its background. This tool labels colors that meet this standard.",
      "Reserve low-contrast colors for decoration. Colors with poor contrast can work beautifully for decorative elements, backgrounds, or accents — just not for important text.",
      "Check colors in the actual design context. Colors can appear different depending on screen, lighting, and surrounding colors. Always test your final palette in the real interface.",
      "Don't rely on color alone. Use icons, labels, and patterns in addition to color to convey information, making your design accessible to everyone.",
    ],
  },
  {
    id: "faq",
    title: "Frequently asked questions",
    type: "faq",
    items: [
      {
        question: "What is a color palette generator?",
        answer: "A color palette generator is a tool that creates harmonious color combinations for your designs. It uses color theory principles to suggest colors that work well together, saving you time and helping you discover new color schemes.",
      },
      {
        question: "Can I use these palettes for commercial projects?",
        answer: "Yes! Generated color palettes are not exclusive intellectual property. You can use them for personal, commercial, or any type of project without restrictions.",
      },
      {
        question: "Are the generated palettes accessible?",
        answer: "This tool provides contrast guidance to help you choose accessible combinations. However, the accessibility labels are a helpful starting point, not a full audit. Always test your final color choices in your actual design context.",
      },
      {
        question: "What color formats does this tool support?",
        answer: "This tool displays colors in HEX, RGB, and HSL formats. You can export palettes as CSS variables, Tailwind config snippets, JSON, or SVG swatch strips.",
      },
      {
        question: "Can I save my palettes?",
        answer: "Yes! You can save palettes locally in your browser using localStorage. Your saved palettes stay on this device and are not uploaded to any server. Note that clearing your browser data may remove saved palettes.",
      },
      {
        question: "Can I use this with Tailwind CSS?",
        answer: "Absolutely! Use the Export panel to generate a Tailwind config snippet that you can copy directly into your project's tailwind.config.js or tailwind.config.ts file.",
      },
      {
        question: "Does this tool store my palettes online?",
        answer: "No. All palette generation happens in your browser, and saved palettes are stored locally using localStorage. No data is sent to any server.",
      },
      {
        question: "How many colors are in each palette?",
        answer: "Each palette contains exactly 5 colors. This is a versatile number that works well for most design projects — primary, secondary, accent, and neutral colors.",
      },
    ],
  },
];
