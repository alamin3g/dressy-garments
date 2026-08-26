import type { ReactNode } from "react";
import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PageFieldType = "text" | "textarea" | "image" | "list";

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

/* ------------------------------------------------------------------ */
/* list helpers: one item per line, columns separated by " | "         */
/* ------------------------------------------------------------------ */

export function listFallback(rows: string[][]): string {
  return rows.map((r) => r.join(" | ")).join("\n");
}

export function mergeList<T>(
  value: string,
  fallback: T[],
  apply: (parts: string[], fb: T) => T,
): T[] {
  const lines = value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return fallback;
  return lines.map((line, i) =>
    apply(
      line.split("|").map((p) => p.trim()),
      fallback[i] ?? fallback[fallback.length - 1]!,
    ),
  );
}

const LIST_HINT = "One item per line. Separate columns with |";

const list = (key: string, label: string, rows: string[][], hint = LIST_HINT): PageField => ({
  key,
  label,
  type: "list",
  hint,
  fallback: listFallback(rows),
});

const text = (key: string, label: string, fallback: string): PageField => ({
  key,
  label,
  type: "text",
  fallback,
});

const area = (key: string, label: string, fallback: string, hint?: string): PageField => ({
  key,
  label,
  type: "textarea",
  fallback,
  hint,
});

const heroSection = (eyebrow: string, title: string, intro: string): PageSectionDef => ({
  name: "Hero",
  fields: [
    text("hero_eyebrow", "Eyebrow", eyebrow),
    area("hero_title", "Title", title, "Each new line becomes a line break."),
    area("hero_intro", "Intro paragraph", intro),
  ],
});

/* ------------------------------------------------------------------ */
/* Default copy shared between the public pages and the admin editor   */
/* ------------------------------------------------------------------ */

export const DEFAULTS = {
  home: {
    steps: ["Research", "Development", "Sourcing", "Production", "Quality", "Delivery"],
    capabilities: [
      "Cutting",
      "Sewing",
      "Finishing",
      "Print & Embellishment",
      "Sample & CAD",
      "Quality Control",
      "Commercial",
    ],
    certs: ["BSCI", "OEKO-TEX® STANDARD 100", "Sedex", "Global Recycled Standard"],
    welfare: [
      "Worker Safety",
      "No Child Labour",
      "Fire Safety",
      "Medical Facility",
      "Worker Welfare",
    ],
    markets: ["North America", "Europe", "South Africa", "Australia"],
  },
  capabilities: {
    steps: [
      ["Research", "Trend, fabric and market research to shape a range that sells."],
      ["Development", "Tech packs, CAD, patterns, fit sessions and pre-production samples."],
      ["Sourcing", "Vetted mills and trims suppliers with nominated or open sourcing."],
      ["Production", "Seven balanced lines with hourly output tracking and line audits."],
      ["Quality", "AQL 2.5 inline and final inspection with metal detection."],
      ["Delivery", "Consolidated shipments by sea and air from Chattogram and Dhaka."],
    ],
    services: [
      ["Cutting", "Auto-spreading and CAD-driven cutting for minimal fabric waste."],
      ["Sewing", "7 lines, 1000+ operators, dedicated lines per product type."],
      ["Finishing", "Wash, press, tag, fold and pack to retail-ready standards."],
      ["Print & Embellishment", "Screen, DTG, embroidery, heat transfer and applique."],
      ["Sample & CAD", "In-house sample room turning tech packs around in 7–10 days."],
      ["Quality Control", "Independent QA team reporting outside of production."],
      ["Commercial", "Costing, L/C handling, documentation and export logistics."],
    ],
  },
  factory: {
    stats: [
      ["500+", "People"],
      ["6M+", "PCS / Year"],
      ["7", "Production Lines"],
      ["120k", "Sq. Ft. Floor"],
    ],
    floors: [
      ["Cutting Floor", "Auto-spreaders, CAD marker making and fabric relaxation area."],
      ["Sewing Floor", "Seven balanced lines with hourly output boards and line supervisors."],
      ["Print & Embroidery", "Screen print tables, DTG units and 12-head embroidery machines."],
      ["Sample Room", "Dedicated pattern and sample team with 7–10 day turnaround."],
      ["Finishing & Packing", "Steam tunnels, needle detection, carton packing and shipment staging."],
      ["QA Lab", "Fabric inspection, shrinkage and colourfastness checks before bulk."],
    ],
  },
  compliance: {
    certs: [
      ["BSCI", "Amfori BSCI social audit, renewed annually."],
      ["OEKO-TEX® STANDARD 100", "Tested for harmful substances across fabric and trims."],
      ["Sedex", "SMETA 4-pillar audited and Sedex member."],
      ["Global Recycled Standard", "Certified chain of custody for recycled fibre programmes."],
    ],
    welfare: [
      ["Worker Safety", "Structural, electrical and machine-guard safety checks."],
      ["No Child Labour", "Age verification at hiring with zero-tolerance policy."],
      ["Fire Safety", "Fire doors, drills every month and trained response team."],
      ["Medical Facility", "On-site clinic with a full-time nurse and visiting doctor."],
      ["Worker Welfare", "Daycare, subsidised canteen and grievance committee."],
    ],
    sustain: [
      ["Recycled Fibres", "GRS-certified recycled polyester and cotton programmes."],
      ["Water Stewardship", "ETP-treated effluent and reduced-water wash processes."],
      ["Energy", "Rooftop solar and LED retrofit across the production floor."],
    ],
  },
  about: {
    story_title: "Our Story",
    story_p1:
      "Dressy Clothing started as a buying house under the profound guidance of our Managing Director. With 25 years of expertise in the garment industry, our company has achieved tremendous success and goodwill. Our team is led by the Managing Director, who has a wealth of expertise and knowledge. With the Managing Director’s vision, the company expanded to a manufacturing wing named Dressy Clothing.",
    story_p2:
      "Dressy Clothing is a 100% export-oriented readymade Garments Industry. Our product is made with high-quality yarn sourced from just the best sources across the world. We are committed to providing goods and services on time and at affordable prices. We offer to our clients a fabulous collection of woven and custom wears for men’s, women’s, boys, girls and kids.",
    global_label: "Global Distribution",
    global_title: "Dressy Delivering Quality Worldwide",
    global_body:
      "From our 100% export-oriented manufacturing facility in Dhaka, Bangladesh, Dressy Clothing ships high-quality readymade garments to leading global fashion brands and retail partners across Europe, North America, Middle East, and Asia-Pacific.",
    countries: [
      "Greece",
      "Spain",
      "Italy",
      "UK",
      "France",
      "Germany",
      "Singapore",
      "New Zealand",
      "USA",
      "Saudi Arabia",
    ],
    leadership: [
      ["SM Khairul Islam", "Managing Director"],
      ["Tariq Ali", "Director Technical"],
      ["Mehadul Hossain Sumon", "General Manager"],
      ["MD Jahangir Alam", "Assistant General Manager"],
    ],
  },
} as const;

export const PAGE_CONTENT: PageDef[] = [
  {
    path: "/",
    title: "Home",
    sections: [
      {
        name: "Hero",
        fields: [
          text(
            "hero_eyebrow",
            "Eyebrow",
            "Dressy Clothing LTD Kathgara, Ashulia, Dhaka Bangladesh",
          ),
          text("hero_title_1", "Title (white part)", "Stitching With"),
          text("hero_title_2", "Title (yellow part)", "Care & Love"),
          area(
            "hero_intro",
            "Intro paragraph",
            "Design development, sourcing and garment manufacturing from Bangladesh to global fashion markets.",
          ),
        ],
      },
      {
        name: "01 / What We Do",
        fields: [
          text("wwd_label", "Section label", "01 / What We Do"),
          area("wwd_title", "Heading", "One Partner.\nEvery Step."),
          area(
            "wwd_body",
            "Paragraph",
            "From concept to container, we handle every step with precision, transparency and a relentless focus on quality.",
          ),
          text("wwd_cta", "Link text", "View All Capabilities"),
          list("wwd_steps", "Process steps", DEFAULTS.home.steps.map((s) => [s]), "One step per line."),
        ],
      },
      {
        name: "02 / Our Products",
        fields: [text("products_label", "Section label", "02 / Our Products")],
      },
      {
        name: "03 / Our Factory",
        fields: [
          text("factory_label", "Section label", "03 / Our Factory"),
          area("factory_title", "Heading", "Built for\nProduction."),
          area(
            "factory_body",
            "Paragraph",
            "State-of-the-art facility in Dhaka, Bangladesh. Built to handle quality at scale.",
          ),
          text("factory_cta", "Link text", "Take a Tour"),
          { key: "factory_image", label: "Factory photo", type: "image" },
          list(
            "factory_capabilities",
            "Capability list",
            DEFAULTS.home.capabilities.map((s) => [s]),
            "One capability per line.",
          ),
        ],
      },
      {
        name: "04 / Responsibility",
        fields: [
          text("resp_label", "Section label", "04 / Responsibility"),
          area("resp_title", "Heading", "Responsibility\nIs Part of\nProduction."),
          text("resp_cta", "Link text", "Compliance & Ethics"),
          list("resp_certs", "Certifications", DEFAULTS.home.certs.map((s) => [s]), "One per line."),
          list("resp_welfare", "Welfare points", DEFAULTS.home.welfare.map((s) => [s]), "One per line."),
        ],
      },
      {
        name: "Global Reach",
        fields: [
          area("global_title", "Heading", "Made Here.\nWorn Everywhere."),
          text("global_cta", "Link text", "Our Global Presence"),
          list("global_markets", "Map labels", DEFAULTS.home.markets.map((s) => [s]), "One per line."),
        ],
      },
      {
        name: "Closing CTA",
        fields: [
          text("cta_label", "Label", "05 / Let's Make Something Great"),
          text("cta_title", "Heading", "Connect With Us"),
          area(
            "cta_body",
            "Paragraph",
            "Send us your tech pack, reference piece or concept. Our team will take it from there.",
          ),
          text("cta_primary", "Primary button", "Start a Project"),
          text("cta_secondary", "Secondary link", "Send Tech Pack"),
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
        name: "The Process",
        fields: [
          text("process_label", "Section label", "The Process"),
          list("process_steps", "Steps (Name | Description)", [
            ...DEFAULTS.capabilities.steps.map((r) => [...r]),
          ]),
        ],
      },
      {
        name: "In-House Services",
        fields: [
          text("services_label", "Section label", "In-House Services"),
          { key: "services_image", label: "Section image", type: "image" },
          list("services_items", "Services (Name | Description)", [
            ...DEFAULTS.capabilities.services.map((r) => [...r]),
          ]),
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
        "Built for\nEvery Rail.",
        "Six core programmes covering jersey, woven and technical garments — each with dedicated lines, patterns and quality standards.",
      ),
      {
        name: "Live Styles",
        fields: [
          text("styles_title", "Section heading", "Current Styles"),
        ],
      },
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
        name: "Key Numbers",
        fields: [
          list("stats", "Stats (Value | Label)", [...DEFAULTS.factory.stats.map((r) => [...r])]),
        ],
      },
      {
        name: "Facility Photos",
        fields: [
          { key: "gallery_image_1", label: "Left photo", type: "image" },
          { key: "gallery_image_2", label: "Right photo", type: "image" },
        ],
      },
      {
        name: "Inside the Facility",
        fields: [
          text("floors_label", "Section label", "Inside the Facility"),
          list("floors", "Areas (Name | Description)", [
            ...DEFAULTS.factory.floors.map((r) => [...r]),
          ]),
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
      {
        name: "Certifications",
        fields: [
          text("certs_label", "Section label", "Certifications"),
          list("certs", "Certifications (Name | Description)", [
            ...DEFAULTS.compliance.certs.map((r) => [...r]),
          ]),
        ],
      },
      {
        name: "Worker Welfare",
        fields: [
          text("welfare_label", "Section label", "Worker Welfare"),
          list("welfare", "Welfare (Name | Description)", [
            ...DEFAULTS.compliance.welfare.map((r) => [...r]),
          ]),
        ],
      },
      {
        name: "Sustainability",
        fields: [
          text("sustain_label", "Section label", "Sustainability"),
          list("sustain", "Sustainability (Name | Description)", [
            ...DEFAULTS.compliance.sustain.map((r) => [...r]),
          ]),
        ],
      },
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
        fields: [
          { key: "story_image", label: "Story image", type: "image" },
          text("story_title", "Heading", DEFAULTS.about.story_title),
          area("story_p1", "Paragraph 1", DEFAULTS.about.story_p1),
          area("story_p2", "Paragraph 2", DEFAULTS.about.story_p2),
        ],
      },
      {
        name: "Global Distribution",
        fields: [
          text("global_label", "Section label", DEFAULTS.about.global_label),
          area("global_title", "Heading", DEFAULTS.about.global_title),
          area("global_body", "Paragraph", DEFAULTS.about.global_body),
          list(
            "countries",
            "Export markets",
            DEFAULTS.about.countries.map((c) => [c]),
            "One country per line.",
          ),
        ],
      },
      {
        name: "Leadership",
        fields: [
          text("leadership_label", "Section label", "Leadership"),
          list("leadership", "Team (Name | Role)", [
            ...DEFAULTS.about.leadership.map((r) => [...r]),
          ]),
        ],
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
      {
        name: "Confirmation",
        fields: [
          text("sent_title", "Success heading", "Enquiry Received"),
          text("sent_cta", "Success link", "Send another enquiry"),
        ],
      },
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
