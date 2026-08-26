import type { ReactNode } from "react";
import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PageFieldType = "text" | "textarea" | "image";

export type PageField = {
  key: string;
  label: string;
  type: PageFieldType;
  hint?: string;
  fallback?: string;
};

export type PageSectionDef = {
  name: string;
  fields: PageField[];
};

export type PageDef = {
  path: string;
  title: string;
  sections: PageSectionDef[];
};

const heroSection = (
  eyebrow: string,
  title: string,
  intro: string,
): PageSectionDef => ({
  name: "Hero",
  fields: [
    { key: "hero_eyebrow", label: "Eyebrow", type: "text", fallback: eyebrow },
    {
      key: "hero_title",
      label: "Title",
      type: "textarea",
      hint: "Each new line becomes a line break.",
      fallback: title,
    },
    { key: "hero_intro", label: "Intro paragraph", type: "textarea", fallback: intro },
  ],
});

export const PAGE_CONTENT: PageDef[] = [
  {
    path: "/",
    title: "Home",
    sections: [
      {
        name: "Hero",
        fields: [
          {
            key: "hero_eyebrow",
            label: "Eyebrow",
            type: "text",
            fallback: "Dressy Clothing LTD Kathgara, Ashulia, Dhaka Bangladesh",
          },
          { key: "hero_title_1", label: "Title (white part)", type: "text", fallback: "Stitching With" },
          { key: "hero_title_2", label: "Title (yellow part)", type: "text", fallback: "Care & Love" },
          {
            key: "hero_intro",
            label: "Intro paragraph",
            type: "textarea",
            fallback:
              "Design development, sourcing and garment manufacturing from Bangladesh to global fashion markets.",
          },
        ],
      },
    ],
  },
  {
    path: "/capabilities",
    title: "Capabilities",
    sections: [
      heroSection(
        "01 / Capabilities",
        "One Partner.\nEvery Step.",
        "From concept to container, we handle every step with precision, transparency and a relentless focus on quality.",
      ),
      {
        name: "In-House Services",
        fields: [
          { key: "services_image", label: "Section image", type: "image" },
        ],
      },
    ],
  },
  {
    path: "/products",
    title: "Products",
    sections: [
      heroSection(
        "02 / Products",
        "Built to\nYour Spec.",
        "Knit, woven, outerwear and workwear programmes — developed, sampled and produced in-house.",
      ),
    ],
  },
  {
    path: "/factory",
    title: "Factory",
    sections: [
      heroSection(
        "03 / Our Factory",
        "Built for\nProduction.",
        "A state-of-the-art facility in Dhaka, Bangladesh, built to handle quality at scale — from fabric in to carton out.",
      ),
      {
        name: "Facility Photos",
        fields: [
          { key: "gallery_image_1", label: "Left photo", type: "image" },
          { key: "gallery_image_2", label: "Right photo", type: "image" },
        ],
      },
    ],
  },
  {
    path: "/compliance",
    title: "Compliance",
    sections: [
      heroSection(
        "04 / Responsibility",
        "Responsibility\nIs Part of\nProduction.",
        "Audited, certified and transparent. Compliance is not a certificate on the wall — it is how the floor runs every day.",
      ),
    ],
  },
  {
    path: "/about",
    title: "About",
    sections: [
      heroSection(
        "05 / About Dressy",
        "Made Here.\nWorn Everywhere.",
        "Dressy Clothing Ltd is a Dhaka-based manufacturer partnering with fashion brands that need reliable quality, honest timelines and clear communication.",
      ),
      {
        name: "Our Story",
        fields: [{ key: "story_image", label: "Story image", type: "image" }],
      },
    ],
  },
  {
    path: "/contact",
    title: "Contact",
    sections: [
      heroSection(
        "06 / Let's Make Something Great",
        "Connect With Us",
        "Send us your tech pack, reference piece or concept. Our merchandising team replies within one business day.",
      ),
    ],
  },
];

export const pageContentKey = (path: string, key: string) => `page:${path}:${key}`;

export async function fetchPageContent(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("key,value")
    .like("key", "page:%");
  if (error) throw error;
  const map: Record<string, string> = {};
  (data ?? []).forEach((row) => {
    map[row.key] = row.value ?? "";
  });
  return map;
}

export function usePageContentMap() {
  return useQuery({
    queryKey: ["page-content"],
    queryFn: fetchPageContent,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}

/** Returns a getter: c("hero_title", fallback) */
export function usePageContent(path: string) {
  const { data } = usePageContentMap();
  return (key: string, fallback = "") => {
    const value = data?.[pageContentKey(path, key)];
    return value && value.trim() ? value : fallback;
  };
}

export function Multiline({ value }: { value: string }) {
  const lines = value.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={`${line}-${i}`}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}

/** Use the stored value (with line breaks) when set, otherwise the coded JSX. */
export function renderRichText(value: string, fallback: ReactNode): ReactNode {
  return value && value.trim() ? <Multiline value={value} /> : fallback;
}
