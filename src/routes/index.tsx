import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCatalogRealtime } from "@/hooks/use-realtime-sync";
import { usePageContent, renderRichText, mergeList, DEFAULTS } from "@/lib/page-content";
import { fetchProductCategories } from "@/lib/product-categories";
import { AnimatedCounter } from "@/components/animated-counter";
import ogImage from "@/assets/dressy-og.jpg.asset.json";
import { getSEOMetadata } from "@/lib/seo";


import {
  ArrowRight,
  Users,
  Shirt,
  Factory,
  Scissors,
  Ruler,
  Sparkles,
  Stamp,
  PenTool,
  BadgeCheck,
  Briefcase,
  ShieldCheck,
  Baby,
  Flame,
  HeartPulse,
  HandHeart,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { AutoReveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { EmailGatePopup } from "@/components/email-gate-popup";
import { Globe } from "@/components/ui/cobe-globe";


import heroImg from "@/assets/hero-sewing.jpg";
import heroVideo from "@/assets/dressy-hero-video.mp4.asset.json";
import factoryImg from "@/assets/factory.jpg";
import ctaImg from "@/assets/cta-tags.png";
import pKnit from "@/assets/w-5.jpg.asset.json";
import pWoven from "@/assets/w-1.jpg.asset.json";
import pOuterwear from "@/assets/w-3.jpg.asset.json";
import pFleece from "@/assets/w-2.jpg.asset.json";
import pWorkwear from "@/assets/w-4.jpg.asset.json";
import pDevelopmentAsset from "@/assets/p-development.jpg.asset.json";
import certBanner from "@/assets/certifications.png.asset.json";

const pDevelopment = pDevelopmentAsset.url;

export const Route = createFileRoute("/")({
  head: () => {
    const base = getSEOMetadata({
      title: "Dressy Clothing LTD Kathgara, Ashulia, Dhaka Bangladesh — Welcome",
      description: "Stitching with care & love. Dress Clothing LTD delivers design, sourcing, and garment manufacturing from Bangladesh to global fashion markets.",
      url: "/",
      image: ogImage.url,
    });
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            [
              { name: "Contact", url: "https://dressyltd.com/contact" },
              { name: "Products", url: "https://dressyltd.com/products" },
              { name: "Capabilities", url: "https://dressyltd.com/capabilities" },
              { name: "About", url: "https://dressyltd.com/about" },
              { name: "Factory", url: "https://dressyltd.com/factory" },
              { name: "Compliance", url: "https://dressyltd.com/compliance" },
            ].map((item) => ({
              "@context": "https://schema.org",
              "@type": "SiteNavigationElement",
              name: item.name,
              url: item.url,
            })),
          ),
        },
      ],
    };
  },

  component: Index,
});

const STEPS: string[] = [...DEFAULTS.home.steps];

const PRODUCTS = [
  { n: "01", name: "Knit", img: pKnit.url },
  { n: "02", name: "Woven", img: pWoven.url },
  { n: "03", name: "Outerwear", img: pOuterwear.url },
  { n: "04", name: "Fleece", img: pFleece.url },
  { n: "05", name: "Workwear", img: pWorkwear.url },
  { n: "06", name: "Development", img: pDevelopment },
];

const CAP_ICONS = [Scissors, Ruler, Sparkles, Stamp, PenTool, BadgeCheck, Briefcase];
const CAPABILITIES = DEFAULTS.home.capabilities.map((label, i) => ({
  icon: CAP_ICONS[i % CAP_ICONS.length]!,
  label,
}));

const CERTS: string[] = [...DEFAULTS.home.certs];

const WELFARE_ICONS = [ShieldCheck, Baby, Flame, HeartPulse, HandHeart];
const WELFARE = DEFAULTS.home.welfare.map((label, i) => ({
  icon: WELFARE_ICONS[i % WELFARE_ICONS.length]!,
  label,
}));

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

function Index() {
  useCatalogRealtime();
  const c = usePageContent("/");
  const steps = mergeList(c("wwd_steps"), STEPS, (parts, fb) => parts[0] ?? fb);
  const capabilities = mergeList(c("factory_capabilities"), CAPABILITIES, (parts, fb) => ({
    icon: fb.icon,
    label: parts[0] ?? fb.label,
  }));
  const certs = mergeList(c("resp_certs"), CERTS, (parts, fb) => parts[0] ?? fb);
  const welfare = mergeList(c("resp_welfare"), WELFARE, (parts, fb) => ({
    icon: fb.icon,
    label: parts[0] ?? fb.label,
  }));
  const markets = mergeList(c("global_markets"), MARKETS, (parts, fb) => ({
    label: parts[0] ?? fb.label,
    top: fb.top,
    left: fb.left,
  }));
  const { data: categories } = useQuery({
    queryKey: ["product-categories"],
    queryFn: fetchProductCategories,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const productCards =
    categories && categories.length > 0
      ? categories.map((c, i) => ({
          n: String(i + 1).padStart(2, "0"),
          name: c.name,
          img:
            c.image_url ||
            PRODUCTS.find((p) => p.name.toLowerCase() === c.name.toLowerCase())?.img ||
            pDevelopment,
        }))
      : PRODUCTS;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SiteHeader />

      <AutoReveal>
      {/* Hero with Streamable Video Background */}
      <section className="relative min-h-screen md:min-h-[85vh] lg:min-h-[88vh] w-full overflow-hidden border-b border-border flex flex-col justify-center pb-12">
        {/* Background Video Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disableRemotePlayback
            webkit-playsinline="true"
            poster={heroImg}
            className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
            style={{
              border: "none",
              transform: "translateZ(0)",
              imageRendering: "auto",
              filter: "contrast(1.06) saturate(1.08) brightness(1.02)",
            }}
          >
            <source src={heroVideo.url} type="video/mp4" />
          </video>
          {/* Cinematic scrims: keep the footage crisp, darken only where the type sits */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-background/40" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="label-xs animate-fade-up text-primary font-medium tracking-widest uppercase drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">{c("hero_eyebrow", "Dressy Clothing LTD Kathgara, Ashulia, Dhaka Bangladesh")}</p>
              <h1 className="display mt-4 animate-fade-up text-5xl sm:text-7xl lg:text-8xl drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]" style={{ animationDelay: "100ms" }}>
                <span className="text-white">{c("hero_title_1", "Stitching With")}</span>{" "}
                <span className="text-primary">{c("hero_title_2", "Care & Love")}</span>
              </h1>
              <p className="mt-6 max-w-sm animate-fade-up text-sm leading-relaxed text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]" style={{ animationDelay: "200ms" }}>
                {c(
                  "hero_intro",
                  "Design development, sourcing and garment manufacturing from Bangladesh to global fashion markets.",
                )}
              </p>
              <div className="mt-8 flex animate-fade-up flex-wrap items-center gap-6" style={{ animationDelay: "300ms" }}>
                <Link
                  to="/factory"
                  className="label-xs btn-sheen group flex items-center gap-3 bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Explore Our Factory <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/contact"
                  className="label-xs group flex items-center gap-6 border-b border-foreground/60 pb-2.5 transition-colors hover:text-primary hover:border-primary"
                >
                  Start Production <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
            {/* Right Column Spacer - preserves layout while giving full focus to video background */}
            <div className="hidden lg:block" />
          </div>
        </div>
      </section>


      {/* Stats */}
      <section className="border-y border-border">
        <div className="mx-auto grid max-w-[1400px] grid-cols-3 divide-x divide-y-0 divide-border">
          {[
            { icon: Users, value: 500, suffix: "+", label: "People" },
            { icon: Shirt, value: 6, suffix: "M+", label: "PCS / Year" },
            { icon: Factory, value: 7, suffix: "", label: "Production Lines" },
          ].map(({ icon: Icon, value, suffix, label }) => (
            <div key={label} className="flex flex-col items-center justify-center gap-2 px-2 py-6 sm:flex-row sm:gap-4 sm:px-4 sm:py-8 md:px-6 md:py-12">
              <Icon className="size-6 shrink-0 text-primary sm:size-10" strokeWidth={1.2} />
              <div className="min-w-0 text-center sm:text-left">
                <p className="display text-2xl sm:text-4xl md:text-5xl">
                  <AnimatedCounter value={value} suffix={suffix} />
                </p>
                <p className="label-xs mt-1 truncate text-muted-foreground sm:mt-2">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What we do */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <p className="label-xs text-primary">{c("wwd_label", "01 / What We Do")}</p>
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="display text-5xl md:text-6xl">{renderRichText(c("wwd_title"), <>One Partner.<br />Every Step.</>)}</h2>
              <div className="mt-8 h-px w-16 bg-primary" />
            </div>
            <div className="max-w-md">
              <p className="text-sm leading-relaxed text-muted-foreground">{c("wwd_body", "From concept to container, we handle every step with precision, transparency and a relentless focus on quality.")}</p>
              <Link
                to="/capabilities"
                className="label-xs mt-8 flex w-full max-w-xs items-center justify-between border-b border-primary pb-3 text-primary group transition-colors hover:opacity-80"
              >
                {c("wwd_cta", "View All Capabilities")} <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {steps.map((step, i) => (
              <div key={step} className="flex items-end justify-between gap-4">
                <div>
                  <p className="label-xs text-primary">{`0${i + 1}`}</p>
                  <p className="label-xs mt-3 text-foreground">{step}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="hidden size-4 text-primary lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <p className="label-xs text-primary">{c("products_label", "02 / Our Products")}</p>
          <div className="mt-8 grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-6">
            {productCards.map((p) => (
              <Link
                key={p.name}
                to="/products"
                className="group media-zoom relative aspect-[3/4] overflow-hidden bg-card"
              >
                <img
                  src={p.img}
                  alt={`${p.name} garment detail`}
                  loading="lazy"
                  width={600}
                  height={800}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/40" />
                <div className="absolute left-4 top-4">
                  <p className="display text-2xl">{p.n}</p>
                  <p className="label-xs mt-1">{p.name}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 flex justify-end">
            <Link
              to="/products"
              className="label-xs flex w-full max-w-xs items-center justify-between border-b border-primary pb-3 text-primary group transition-colors hover:opacity-80"
            >
              View All Products <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Factory */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <p className="label-xs text-primary">{c("factory_label", "03 / Our Factory")}</p>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr_1fr]">
            <div>
              <h2 className="display text-4xl md:text-5xl">{renderRichText(c("factory_title"), <>Built for<br />Production.</>)}</h2>
              <div className="mt-6 h-px w-14 bg-primary" />
              <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">{c("factory_body", "State-of-the-art facility in Dhaka, Bangladesh. Built to handle quality at scale.")}</p>
              <Link
                to="/factory"
                className="label-xs mt-8 flex w-40 items-center justify-between border-b border-foreground/60 pb-3 group transition-colors hover:opacity-80"
              >
                {c("factory_cta", "Take a Tour")} <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <img
              src={c("factory_image", factoryImg)}
              alt="Dressy garment factory building in Dhaka"
              loading="lazy"
              width={1000}
              height={700}
              className="h-full w-full object-cover"
            />
            <ul className="divide-y divide-border">
              {capabilities.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <Link
                    to="/capabilities"
                    className="flex items-center gap-4 py-4 transition-colors hover:text-primary"
                  >
                    <Icon className="size-4 text-primary" strokeWidth={1.4} />
                    <span className="label-xs flex-1">{label}</span>
                    <ArrowRight className="size-4 text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Responsibility */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <p className="label-xs text-primary">{c("resp_label", "04 / Responsibility")}</p>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <h2 className="display text-4xl md:text-5xl">{renderRichText(c("resp_title"), <>Responsibility<br />Is Part of<br />Production.</>)}</h2>
              <div className="mt-6 h-px w-14 bg-primary" />
              <Link
                to="/compliance"
                className="label-xs mt-8 flex w-56 items-center justify-between border-b border-primary pb-3 text-primary group transition-colors hover:opacity-80"
              >
                {c("resp_cta", "Compliance & Ethics")} <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <div>
              <img
                src={certBanner.url}
                alt="Compliance certifications: BSCI, OEKO-TEX Standard 100, Sedex, Global Recycled Standard"
                loading="lazy"
                width={1600}
                height={400}
                className="w-full rounded-lg border border-border bg-black object-contain"
              />
              <div className="grid grid-cols-2 border-t border-border md:grid-cols-5 md:divide-x md:divide-border">
                {welfare.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center justify-center gap-3 px-4 py-6">
                    <Icon className="size-4 text-primary" strokeWidth={1.4} />
                    <span className="label-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global reach */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-6 py-16 md:px-10 lg:grid-cols-[1fr_1.4fr_0.8fr]">
          <h2 className="display text-4xl md:text-5xl">{renderRichText(c("global_title"), <>Made Here.<br />Worn Everywhere.</>)}</h2>
          <div className="relative aspect-[2/1] w-full">
            <img
              src={worldMap}
              alt="World map showing Dressy export markets"
              loading="lazy"
              width={1400}
              height={700}
              className="absolute inset-0 size-full object-contain opacity-90"
            />
            {markets.map((m) => (
              <div key={m.label} className="absolute" style={{ top: m.top, left: m.left }}>
                <span className="block size-2 animate-pulse rounded-full bg-primary" />
                <span className="label-xs mt-2 block whitespace-nowrap text-muted-foreground">
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          <Link
            to="/about"
            className="label-xs flex items-center justify-between border-b border-primary pb-3 text-primary group transition-colors hover:opacity-80"
          >
            {c("global_cta", "Our Global Presence")} <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-14 md:px-10 lg:grid-cols-[1.1fr_1fr_0.8fr]">
          <div>
            <p className="label-xs">{c("cta_label", "05 / Let's Make Something Great")}</p>
            <h2 className="display mt-8 text-4xl md:text-5xl">{c("cta_title", "Connect With Us")}</h2>
          </div>
          <div className="self-center">
            <p className="max-w-sm text-sm leading-relaxed">{c("cta_body", "Send us your tech pack, reference piece or concept. Our team will take it from there.")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-8">
              <Link
                to="/contact"
                className="label-xs btn-sheen group flex items-center gap-6 bg-background px-6 py-4 text-foreground"
              >
                {c("cta_primary", "Start a Project")} <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="label-xs group flex items-center gap-6 border-b border-primary-foreground/70 pb-3 transition-opacity hover:opacity-80"
              >
                {c("cta_secondary", "Send Tech Pack")} <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={ctaImg}
              alt="Dressy branded hang tags and paper bag"
              loading="lazy"
              width={900}
              height={700}
              className="max-h-64 w-auto object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      </AutoReveal>

      <SiteFooter />
      <EmailGatePopup />

    </div>
  );
}
