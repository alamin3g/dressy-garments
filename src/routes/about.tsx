import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
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
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const TIMELINE = [
  { year: "2012", body: "Dressy Clothing Ltd founded in Dhaka with two sewing lines." },
  { year: "2016", body: "In-house sample room and CAD department opened." },
  { year: "2019", body: "BSCI and OEKO-TEX® certification achieved; export to EU begins." },
  { year: "2022", body: "Expanded to seven lines and 120,000 sq. ft. of floor space." },
  { year: "2026", body: "5M+ pieces a year shipped to brands across four continents." },
];

const LEADERSHIP = [
  { name: "A. Rahman", role: "Managing Director" },
  { name: "S. Akter", role: "Head of Merchandising" },
  { name: "M. Hossain", role: "Production Director" },
  { name: "N. Chowdhury", role: "Compliance & QA Lead" },
];

const MARKETS = [
  { label: "North America", top: "42%", left: "20%" },
  { label: "Europe", top: "26%", left: "48%" },
  { label: "South Africa", top: "62%", left: "45%" },
  { label: "Australia", top: "66%", left: "76%" },
];

function AboutPage() {
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
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-16 md:px-10 lg:grid-cols-2">
          <img
            src={factoryImg}
            alt="Dressy headquarters in Dhaka, Bangladesh"
            loading="lazy"
            width={1000}
            height={700}
            className="h-full w-full object-cover grayscale"
          />
          <div className="self-center">
            <h2 className="display text-4xl md:text-5xl">Our Story</h2>
            <div className="mt-6 h-px w-14 bg-primary" />
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              We started with two lines and a simple belief: brands deserve a factory that tells the
              truth about capacity, cost and timing. Fourteen years later that principle still runs
              the floor — every order has a named merchandiser, a live production plan and an
              independent QA sign-off before it ships.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Today we ship over five million pieces a year to retailers and independent labels
              across four continents.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <p className="label-xs text-primary">Milestones</p>
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {TIMELINE.map((t) => (
              <li key={t.year} className="flex flex-wrap items-baseline gap-6 py-6">
                <span className="display w-24 text-3xl text-primary">{t.year}</span>
                <span className="flex-1 text-sm text-muted-foreground">{t.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

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

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <p className="label-xs text-primary">Global Presence</p>
          <div className="relative mt-10 aspect-[2/1] w-full">
            <img
              src={worldMap}
              alt="World map showing Dressy export markets"
              loading="lazy"
              width={1400}
              height={700}
              className="absolute inset-0 size-full object-contain opacity-90 brightness-200 mix-blend-screen"
            />
            {MARKETS.map((m) => (
              <div key={m.label} className="absolute" style={{ top: m.top, left: m.left }}>
                <span className="block size-2 rounded-full bg-primary" />
                <span className="label-xs mt-2 block whitespace-nowrap text-muted-foreground">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
