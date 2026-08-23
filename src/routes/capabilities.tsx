import { createFileRoute } from "@tanstack/react-router";
import {
  Scissors,
  Ruler,
  Sparkles,
  Stamp,
  PenTool,
  BadgeCheck,
  Briefcase,
  Search,
  Boxes,
  Truck,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import factoryImg from "@/assets/factory.jpg";
import { getSEOMetadata } from "@/lib/seo";


export const Route = createFileRoute("/capabilities")({
  head: () => getSEOMetadata({
    title: "Services — Garment Production Services",
    description: "We usually do Enzyme wash, Stone wash, Bleach wash. Professional cutting, sewing, finishing, and quality control services.",
    url: "/capabilities",
  }),

  component: CapabilitiesPage,
});

const STEPS = [
  { icon: Search, name: "Research", body: "Trend, fabric and market research to shape a range that sells." },
  { icon: PenTool, name: "Development", body: "Tech packs, CAD, patterns, fit sessions and pre-production samples." },
  { icon: Boxes, name: "Sourcing", body: "Vetted mills and trims suppliers with nominated or open sourcing." },
  { icon: Ruler, name: "Production", body: "Seven balanced lines with hourly output tracking and line audits." },
  { icon: BadgeCheck, name: "Quality", body: "AQL 2.5 inline and final inspection with metal detection." },
  { icon: Truck, name: "Delivery", body: "Consolidated shipments by sea and air from Chattogram and Dhaka." },
];

const SERVICES = [
  { icon: Scissors, label: "Cutting", body: "Auto-spreading and CAD-driven cutting for minimal fabric waste." },
  { icon: Ruler, label: "Sewing", body: "7 lines, 1000+ operators, dedicated lines per product type." },
  { icon: Sparkles, label: "Finishing", body: "Wash, press, tag, fold and pack to retail-ready standards." },
  { icon: Stamp, label: "Print & Embellishment", body: "Screen, DTG, embroidery, heat transfer and applique." },
  { icon: PenTool, label: "Sample & CAD", body: "In-house sample room turning tech packs around in 7–10 days." },
  { icon: BadgeCheck, label: "Quality Control", body: "Independent QA team reporting outside of production." },
  { icon: Briefcase, label: "Commercial", body: "Costing, L/C handling, documentation and export logistics." },
];

function CapabilitiesPage() {
  return (
    <PageShell
      eyebrow="01 / Capabilities"
      title={
        <>
          One Partner.
          <br />
          Every Step.
        </>
      }
      intro="From concept to container, we handle every step with precision, transparency and a relentless focus on quality."
    >
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <p className="label-xs text-primary">The Process</p>
          <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map(({ icon: Icon, name, body }, i) => (
              <div key={name} className="bg-background p-8">
                <div className="flex items-center justify-between">
                  <Icon className="size-6 text-primary" strokeWidth={1.3} />
                  <span className="display text-3xl text-muted-foreground">{`0${i + 1}`}</span>
                </div>
                <h2 className="display mt-6 text-2xl">{name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-16 md:px-10 lg:grid-cols-[1fr_1.1fr]">
          <img
            src={factoryImg}
            alt="Dressy production floor in Dhaka"
            loading="lazy"
            width={1000}
            height={700}
            className="h-full w-full object-cover"
          />
          <div>
            <p className="label-xs text-primary">In-House Services</p>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {SERVICES.map(({ icon: Icon, label, body }) => (
                <li key={label} className="flex gap-5 py-5">
                  <Icon className="mt-1 size-4 shrink-0 text-primary" strokeWidth={1.4} />
                  <div>
                    <p className="label-xs">{label}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
