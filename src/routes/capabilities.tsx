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
import { usePageContent, mergeList, DEFAULTS } from "@/lib/page-content";


export const Route = createFileRoute("/capabilities")({
  head: () => getSEOMetadata({
    title: "Services — Garment Production Services",
    description: "We usually do Enzyme wash, Stone wash, Bleach wash. Professional cutting, sewing, finishing, and quality control services.",
    url: "/capabilities",
  }),

  component: CapabilitiesPage,
});

const STEP_ICONS = [Search, PenTool, Boxes, Ruler, BadgeCheck, Truck];
const STEPS = DEFAULTS.capabilities.steps.map(([name, body], i) => ({
  icon: STEP_ICONS[i % STEP_ICONS.length]!,
  name,
  body,
}));

const SERVICE_ICONS = [Scissors, Ruler, Sparkles, Stamp, PenTool, BadgeCheck, Briefcase];
const SERVICES = DEFAULTS.capabilities.services.map(([label, body], i) => ({
  icon: SERVICE_ICONS[i % SERVICE_ICONS.length]!,
  label,
  body,
}));

function CapabilitiesPage() {
  const c = usePageContent("/capabilities");
  const steps = mergeList(c("process_steps"), STEPS, (parts, fb) => ({
    icon: fb.icon,
    name: parts[0] ?? fb.name,
    body: parts[1] ?? fb.body,
  }));
  const services = mergeList(c("services_items"), SERVICES, (parts, fb) => ({
    icon: fb.icon,
    label: parts[0] ?? fb.label,
    body: parts[1] ?? fb.body,
  }));
  return (
    <PageShell
      path="/capabilities"
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
          <p className="label-xs text-primary">{c("process_label", "The Process")}</p>
          <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {steps.map(({ icon: Icon, name, body }, i) => (
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
            src={c("services_image", factoryImg)}
            alt="Dressy production floor in Dhaka"
            loading="lazy"
            width={1000}
            height={700}
            className="h-full w-full object-cover"
          />
          <div>
            <p className="label-xs text-primary">{c("services_label", "In-House Services")}</p>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {services.map(({ icon: Icon, label, body }) => (
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
