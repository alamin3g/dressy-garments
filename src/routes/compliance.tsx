import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Baby, Flame, HeartPulse, HandHeart, Recycle, Droplets, Leaf } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { getSEOMetadata } from "@/lib/seo";


export const Route = createFileRoute("/compliance")({
  head: () => getSEOMetadata({
    title: "Compliance & Sustainability — Certified Manufacturing",
    description: "BSCI, OEKO-TEX STANDARD 100, Sedex and GRS certified. Worker safety, fire safety and sustainable production in Bangladesh.",
    url: "/compliance",
  }),

  component: CompliancePage,
});

const CERTS = [
  { name: "BSCI", body: "Amfori BSCI social audit, renewed annually." },
  { name: "OEKO-TEX® STANDARD 100", body: "Tested for harmful substances across all fabrics and trims." },
  { name: "Sedex", body: "SMETA 4-pillar audited and Sedex member." },
  { name: "Global Recycled Standard", body: "Certified chain of custody for recycled fibre programmes." },
];

const WELFARE = [
  { icon: ShieldCheck, label: "Worker Safety", body: "Structural, electrical and machine-guard safety checks." },
  { icon: Baby, label: "No Child Labour", body: "Age verification at hiring with zero-tolerance policy." },
  { icon: Flame, label: "Fire Safety", body: "Fire doors, drills every month and trained response team." },
  { icon: HeartPulse, label: "Medical Facility", body: "On-site clinic with a full-time nurse and visiting doctor." },
  { icon: HandHeart, label: "Worker Welfare", body: "Daycare, subsidised canteen and grievance committee." },
];

const SUSTAIN = [
  { icon: Recycle, label: "Recycled Fibres", body: "GRS-certified recycled polyester and cotton programmes." },
  { icon: Droplets, label: "Water Stewardship", body: "ETP-treated effluent and reduced-water wash processes." },
  { icon: Leaf, label: "Energy", body: "Rooftop solar and LED retrofit across the production floor." },
];

function CompliancePage() {
  return (
    <PageShell
      eyebrow="04 / Responsibility"
      title={
        <>
          Responsibility
          <br />
          Is Part of
          <br />
          Production.
        </>
      }
      intro="Audited, certified and transparent. Compliance is not a certificate on the wall — it is how the floor runs every day."
    >
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <p className="label-xs text-primary">Certifications</p>
          <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {CERTS.map((c) => (
              <div key={c.name} className="bg-background p-8">
                <h2 className="display text-xl">{c.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <p className="label-xs text-primary">Worker Welfare</p>
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {WELFARE.map(({ icon: Icon, label, body }) => (
              <li key={label} className="flex flex-wrap items-center gap-6 py-6">
                <Icon className="size-5 text-primary" strokeWidth={1.4} />
                <span className="label-xs w-48">{label}</span>
                <span className="flex-1 text-sm text-muted-foreground">{body}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <p className="label-xs text-primary">Sustainability</p>
          <div className="mt-10 grid gap-px bg-border sm:grid-cols-3">
            {SUSTAIN.map(({ icon: Icon, label, body }) => (
              <div key={label} className="bg-background p-8">
                <Icon className="size-6 text-primary" strokeWidth={1.3} />
                <h2 className="display mt-6 text-2xl">{label}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
