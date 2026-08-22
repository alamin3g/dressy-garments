import { createFileRoute } from "@tanstack/react-router";
import { Users, Shirt, Factory as FactoryIcon, Ruler } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import factoryImg from "@/assets/factory.jpg";
import heroImg from "@/assets/hero-sewing.jpg";

export const Route = createFileRoute("/factory")({
  head: () => ({
    meta: [
      { title: "Our Factory in Dhaka — Dressy Clothing Ltd" },
      {
        name: "description",
        content:
          "Inside Dressy's Dhaka facility: 7 production lines, 500+ people, 6M+ pieces a year, in-house sampling, printing, finishing and QA.",
      },
      { property: "og:title", content: "Our Factory in Dhaka — Dressy Clothing Ltd" },
      {
        property: "og:description",
        content: "A state-of-the-art garment facility built to handle quality at scale.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FactoryPage,
});

const STATS = [
  { icon: Users, value: "500+", label: "People" },
  { icon: Shirt, value: "6M+", label: "PCS / Year" },
  { icon: FactoryIcon, value: "7", label: "Production Lines" },
  { icon: Ruler, value: "120k", label: "Sq. Ft. Floor" },
];

const FLOORS = [
  { name: "Cutting Floor", body: "Auto-spreaders, CAD marker making and fabric relaxation area." },
  { name: "Sewing Floor", body: "Seven balanced lines with hourly output boards and line supervisors." },
  { name: "Print & Embroidery", body: "Screen print tables, DTG units and 12-head embroidery machines." },
  { name: "Sample Room", body: "Dedicated pattern and sample team with 7–10 day turnaround." },
  { name: "Finishing & Packing", body: "Steam tunnels, needle detection, carton packing and shipment staging." },
  { name: "QA Lab", body: "Fabric inspection, shrinkage and colourfastness checks before bulk." },
];

function FactoryPage() {
  return (
    <PageShell
      eyebrow="03 / Our Factory"
      title={
        <>
          Built for
          <br />
          Production.
        </>
      }
      intro="A state-of-the-art facility in Dhaka, Bangladesh, built to handle quality at scale — from fabric in to carton out."
    >
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] divide-y divide-border md:grid-cols-4 md:divide-x md:divide-y-0">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center justify-center gap-5 px-6 py-12">
              <Icon className="size-9 text-primary" strokeWidth={1.2} />
              <div>
                <p className="display text-4xl">{value}</p>
                <p className="label-xs mt-2 text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] gap-px bg-border px-0 py-0 md:grid-cols-2">
          <img
            src={factoryImg}
            alt="Dressy factory building exterior in Dhaka"
            loading="lazy"
            width={1000}
            height={700}
            className="h-full max-h-[520px] w-full object-cover"
          />
          <img
            src={heroImg}
            alt="Operator sewing a garment on the production line"
            loading="lazy"
            width={1000}
            height={700}
            className="h-full max-h-[520px] w-full object-cover"
          />
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <p className="label-xs text-primary">Inside the Facility</p>
          <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {FLOORS.map((f, i) => (
              <div key={f.name} className="bg-background p-8">
                <span className="display text-3xl text-muted-foreground">{`0${i + 1}`}</span>
                <h2 className="display mt-4 text-2xl">{f.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
