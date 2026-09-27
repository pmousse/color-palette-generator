/**
 * SEO metadata helpers.
 */

export const siteTitle = "Color Palette Generator | Create Beautiful Color Schemes";
export const siteDescription =
  "Generate beautiful color palettes for websites, brands, apps, and creative projects. Copy HEX, RGB, HSL, CSS variables, Tailwind config, and more.";

export function getMetadata() {
  return {
    title: siteTitle,
    description: siteDescription,
    keywords: [
      "color palette",
      "color generator",
      "color scheme",
      "hex color",
      "color picker",
      "tailwind colors",
      "css variables",
      "accessible colors",
      "brand colors",
      "design tool",
    ].join(", "),
  };
}

export const openGraph = {
  type: "website",
  locale: "en_US",
  siteName: "Color Palette Generator",
};

export const twitter = {
  card: "summary_large_image",
  site: "@colorpalettegen",
  creator: "@colorpalettegen",
};
