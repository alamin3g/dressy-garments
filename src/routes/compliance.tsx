import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Baby, Flame, HeartPulse, HandHeart, Recycle, Droplets, Leaf } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { getSEOMetadata } from "@/lib/seo";
import { usePageContent, mergeList, DEFAULTS } from "@/lib/page-content";
import certsBannerAsset from "@/assets/certifications-banner.webp.asset.json";

const certsBanner = certsBannerAsset.url;


export const Route = createFileRoute("/compliance")({
  head: () => getSEOMetadata({
    title: "Compliance — Building Safety & Ethics",
    description: "Building Safety > Fire Drill & Assembly Area. BSCI, OEKO-TEX, Sedex and GRS certified manufacturing facility.",
    url: "/compliance",
  }),

  component: CompliancePage,
});

const CERTS = DEFAULTS.compliance.certs.map(([name, body]) => ({ name, body }));

const WELFARE_ICONS = [ShieldCheck, Baby, Flame, HeartPulse, HandHeart];
const WELFARE = DEFAULTS.compliance.welfare.map(([label, body], i) => ({
  icon: WELFARE_ICONS[i % WELFARE_ICONS.length]!,
  label,
  body,
}));

const SUSTAIN_ICONS = [Recycle, Droplets, Leaf];
const SUSTAIN = DEFAULTS.compliance.sustain.map(([label, body], i) => ({
  icon: SUSTAIN_ICONS[i % SUSTAIN_ICONS.length]!,
  label,
  body,
}));

function CompliancePage() {
  const c = usePageContent("/compliance");
  const certs = mergeList(c("certs"), CERTS, (parts, fb) => ({
    name: parts[0] ?? fb.name,
    body: parts[1] ?? fb.body,
  }));
  const welfare = mergeList(c("welfare"), WELFARE, (parts, fb) => ({
    icon: fb.icon,
    label: parts[0] ?? fb.label,
    body: parts[1] ?? fb.body,
  }));
  const sustain = mergeList(c("sustain"), SUSTAIN, (parts, fb) => ({
    icon: fb.icon,
    label: parts[0] ?? fb.label,
    body: parts[1] ?? fb.body,
  }));
  return (
    <PageShell
      path="/compliance"
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
      <section id="certifications" className="scroll-mt-28 border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <p className="label-xs text-primary">{c("certs_label", "Certifications")}</p>
          <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {certs.map((c) => (
              <div key={c.name} className="bg-background p-8">
                <h2 className="display text-xl">{c.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="welfare" className="scroll-mt-28 border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <p className="label-xs text-primary">{c("welfare_label", "Worker Welfare")}</p>
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {welfare.map(({ icon: Icon, label, body }) => (
              <li key={label} className="flex flex-wrap items-center gap-6 py-6">
                <Icon className="size-5 text-primary" strokeWidth={1.4} />
                <span className="label-xs w-48">{label}</span>
                <span className="flex-1 text-sm text-muted-foreground">{body}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="sustainability" className="scroll-mt-28 border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <p className="label-xs text-primary">{c("sustain_label", "Sustainability")}</p>
          <div className="mt-10 grid gap-px bg-border sm:grid-cols-3">
            {sustain.map(({ icon: Icon, label, body }) => (
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
