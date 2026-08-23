import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Globe } from "@/components/ui/cobe-globe";
import worldMap from "@/assets/world-map.jpg";
import factoryImg from "@/assets/factory.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Dressy — Garment Manufacturer in Bangladesh" },
      {
        name: "description",
        content:
          "Dressy Clothing Ltd is a Dhaka-based garment manufacturer supplying knit, woven and outerwear programmes to brands across Europe, North America, Africa and Australia.",
      },
      { property: "og:title", content: "About Dressy — Garment Manufacturer in Bangladesh" },
      {
        property: "og:description",
        content: "Who we are, how we work and where our garments travel.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://dressyltd.com/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://dressyltd.com/about" }],
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

const EXPORT_COUNTRIES = [
  { name: "Greece", id: "greece" },
  { name: "Spain", id: "spain" },
  { name: "Italy", id: "italy" },
  { name: "UK", id: "uk" },
  { name: "France", id: "france" },
  { name: "Germany", id: "germany" },
  { name: "Singapore", id: "singapore" },
  { name: "New Zealand", id: "nz" },
  { name: "USA", id: "usa" },
  { name: "Saudi Arabia", id: "saudi" },
];

const LEADERSHIP = [
  { name: "SM Khairul Islam", role: "Managing Director" },
  { name: "Tariq Ali", role: "Director Technical" },
  { name: "Mehadul Hossain Sumon", role: "General Manager" },
  { name: "MD Jahangir Alam", role: "Assistant General Manager" },
];

function AboutPage() {
  const [activeCountryId, setActiveCountryId] = useState<string | null>(null);

  return (
    <PageShell
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
            src={factoryImg}
            alt="Dressy headquarters in Dhaka, Bangladesh"
            loading="lazy"
            width={1000}
            height={700}
            className="h-full w-full object-cover"
          />
          <div className="self-center">
            <h2 className="display text-4xl md:text-5xl">Our Story</h2>
            <div className="mt-6 h-px w-14 bg-primary" />
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Dressy Clothing started as a buying house under the profound guidance of our Managing Director. With 25 years of expertise in the garment industry, our company has achieved tremendous success and goodwill. Our team is led by the Managing Director, who has a wealth of expertise and knowledge. With the Managing Director’s vision, the company expanded to a manufacturing wing named Dressy Clothing.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Dressy Clothing is a 100% export-oriented readymade Garments Industry. Our product is made with high-quality yarn sourced from just the best sources across the world. We are committed to providing goods and services on time and at affordable prices. We offer to our clients a fabulous collection of woven and custom wears for men’s, women’s, boys, girls and kids.
            </p>
          </div>
        </div>
      </section>

      {/* Global Export Interactive 3D Globe */}
      <section className="border-b border-border overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] items-center">
            <div>
              <p className="label-xs text-primary">Global Distribution</p>
              <h2 className="display mt-4 text-4xl md:text-5xl">
                Dressy Delivering Quality Worldwide
              </h2>
              <div className="mt-6 h-px w-14 bg-primary" />
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                From our 100% export-oriented manufacturing facility in Dhaka, Bangladesh, Dressy Clothing ships high-quality readymade garments to leading global fashion brands and retail partners across Europe, North America, Middle East, and Asia-Pacific.
              </p>
              
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-lg">
                {EXPORT_COUNTRIES.map((c) => (
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
          <p className="label-xs text-primary">Leadership</p>
          <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {LEADERSHIP.map((l) => (
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
