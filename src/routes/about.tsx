import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Globe } from "@/components/ui/cobe-globe";
import worldMap from "@/assets/world-map.jpg";
import factoryImg from "@/assets/factory.jpg";
import { getSEOMetadata } from "@/lib/seo";
import { usePageContent, mergeList, DEFAULTS } from "@/lib/page-content";


export const Route = createFileRoute("/about")({
  head: () => getSEOMetadata({
    title: "About Us — Garment Manufacturer in Bangladesh",
    description: "Dressy Clothing is a 100% export-oriented readymade Garments Industry. Leading manufacturer for men's, women's, boys, girls and kids apparel.",
    url: "/about",
    image: "/__l5e/assets-v1/cbc3c3bb-0e8d-4ce5-9eb4-55ec1a2fac97/dressy-og.jpg",
  }),

  component: AboutPage,
});

const GLOBE_MARKERS = [
  { id: "dhaka", location: [23.8103, 90.4125] as [number, number], label: "Dhaka (HQ)" },
  { id: "usa", location: [40.7128, -74.006] as [number, number], label: "USA" },
  { id: "uk", location: [51.5074, -0.1278] as [number, number], label: "UK" },
  { id: "germany", location: [52.52, 13.405] as [number, number], label: "Germany" },
  { id: "france", location: [48.8566, 2.3522] as [number, number], label: "France" },
  { id: "italy", location: [41.9028, 12.4964] as [number, number], label: "Italy" },
  { id: "spain", location: [40.4168, -3.7038] as [number, number], label: "Spain" },
  { id: "greece", location: [37.9838, 23.7275] as [number, number], label: "Greece" },
  { id: "saudi", location: [24.7136, 46.6753] as [number, number], label: "Saudi Arabia" },
  { id: "singapore", location: [1.3521, 103.8198] as [number, number], label: "Singapore" },
  { id: "nz", location: [-36.8485, 174.7633] as [number, number], label: "New Zealand" },
];

const GLOBE_ARCS = [
  { id: "dhaka-usa", from: [23.8103, 90.4125] as [number, number], to: [40.7128, -74.006] as [number, number], label: "Dhaka → USA" },
  { id: "dhaka-uk", from: [23.8103, 90.4125] as [number, number], to: [51.5074, -0.1278] as [number, number], label: "Dhaka → UK" },
  { id: "dhaka-germany", from: [23.8103, 90.4125] as [number, number], to: [52.52, 13.405] as [number, number], label: "Dhaka → Germany" },
  { id: "dhaka-france", from: [23.8103, 90.4125] as [number, number], to: [48.8566, 2.3522] as [number, number], label: "Dhaka → France" },
  { id: "dhaka-italy", from: [23.8103, 90.4125] as [number, number], to: [41.9028, 12.4964] as [number, number], label: "Dhaka → Italy" },
  { id: "dhaka-spain", from: [23.8103, 90.4125] as [number, number], to: [40.4168, -3.7038] as [number, number], label: "Dhaka → Spain" },
  { id: "dhaka-greece", from: [23.8103, 90.4125] as [number, number], to: [37.9838, 23.7275] as [number, number], label: "Dhaka → Greece" },
  { id: "dhaka-saudi", from: [23.8103, 90.4125] as [number, number], to: [24.7136, 46.6753] as [number, number], label: "Dhaka → Saudi Arabia" },
  { id: "dhaka-singapore", from: [23.8103, 90.4125] as [number, number], to: [1.3521, 103.8198] as [number, number], label: "Dhaka → Singapore" },
  { id: "dhaka-nz", from: [23.8103, 90.4125] as [number, number], to: [-36.8485, 174.7633] as [number, number], label: "Dhaka → New Zealand" },
];

const EXPORT_COUNTRIES = DEFAULTS.about.countries.map((name) => ({ name, id: name.toLowerCase().replace(/\s+/g, "-") }));

const LEADERSHIP = DEFAULTS.about.leadership.map(([name, role]) => ({ name, role }));

function AboutPage() {
  const [activeCountryId, setActiveCountryId] = useState<string | null>(null);
  const c = usePageContent("/about");
  const countries = mergeList(c("countries"), EXPORT_COUNTRIES, (parts, fb) => {
    const name = parts[0] ?? fb.name;
    return { name, id: name.toLowerCase().replace(/\s+/g, "-") };
  });
  const leadership = mergeList(c("leadership"), LEADERSHIP, (parts, fb) => ({
    name: parts[0] ?? fb.name,
    role: parts[1] ?? fb.role,
  }));

  return (
    <PageShell
      path="/about"
      eyebrow="05 / About Dressy"
      title={
        <>
          Made Here.
          <br />
          Worn Everywhere.
        </>
      }
      intro="Dressy Clothing Ltd is a Dhaka-based manufacturer partnering with fashion brands that need reliable quality, honest timelines and clear communication."
    >
      {/* Our Story */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-16 md:px-10 lg:grid-cols-2">
          <img
            src={c("story_image", factoryImg)}
            alt="Dressy headquarters in Dhaka, Bangladesh"
            loading="lazy"
            width={1000}
            height={700}
            className="h-full w-full object-cover"
          />
          <div className="self-center">
            <h2 className="display text-4xl md:text-5xl">{c("story_title", DEFAULTS.about.story_title)}</h2>
            <div className="mt-6 h-px w-14 bg-primary" />
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{c("story_p1", DEFAULTS.about.story_p1)}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c("story_p2", DEFAULTS.about.story_p2)}</p>
          </div>
        </div>
      </section>

      {/* Global Export Interactive 3D Globe */}
      <section className="border-b border-border overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] items-center">
            <div>
              <p className="label-xs text-primary">{c("global_label", DEFAULTS.about.global_label)}</p>
              <h2 className="display mt-4 text-4xl md:text-5xl">{c("global_title", DEFAULTS.about.global_title)}</h2>
              <div className="mt-6 h-px w-14 bg-primary" />
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{c("global_body", DEFAULTS.about.global_body)}</p>
              
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-lg">
                {countries.map((country) => (
                  <div
                    key={c.id}
                    onMouseEnter={() => setActiveCountryId(c.id)}
                    onMouseLeave={() => setActiveCountryId(null)}
                    className={`flex items-center justify-center rounded-md border px-3 py-2 text-xs transition-all duration-200 cursor-pointer ${
                      activeCountryId === c.id
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-sm scale-[1.02]"
                        : "border-border/60 bg-card/40 text-foreground hover:border-primary/50 hover:bg-card"
                    }`}
                  >
                    <span className="font-medium truncate">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="w-full max-w-lg aspect-square">
                <Globe
                  markers={GLOBE_MARKERS}
                  arcs={GLOBE_ARCS}
                  activeMarkerId={activeCountryId}
                  markerColor={[0.85, 0.72, 0.2]}
                  baseColor={[0.2, 0.2, 0.25]}
                  arcColor={[0.85, 0.72, 0.2]}
                  glowColor={[0.3, 0.3, 0.35]}
                  dark={1}
                  mapBrightness={8}
                  markerSize={0.03}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <p className="label-xs text-primary">{c("leadership_label", "Leadership")}</p>
          <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((l) => (
              <div key={l.name} className="bg-background p-8">
                <p className="display text-2xl">{l.name}</p>
                <p className="label-xs mt-3 text-muted-foreground">{l.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
