export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: "website" | "article";
}

const DEFAULT_TITLE = "Dressy Clothing Ltd. — Premium Garment Manufacturer";
const DEFAULT_DESCRIPTION =
  "Dressy is a leading garment manufacturer based in Dhaka, Bangladesh, providing full-package production and sourcing for global fashion brands.";
const SITE_URL = "https://dressyltd.com";

export function getSEOMetadata({ title, description, image, url, type = "website" }: SEOProps) {
  const fullTitle = `${title} | Dressy`;
  const fullUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;

  const meta = [
    { title: fullTitle },
    { name: "description", content: description || DEFAULT_DESCRIPTION },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description || DEFAULT_DESCRIPTION },
    { property: "og:type", content: type },
    { property: "og:url", content: fullUrl },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description || DEFAULT_DESCRIPTION },
  ];

  if (image) {
    const fullImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;
    meta.push({ property: "og:image", content: fullImage });
    meta.push({ name: "twitter:image", content: fullImage });
  }

  return {
    meta,
    links: [{ rel: "canonical", href: fullUrl }],
  };
}
