import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatedCounter } from "@/components/animated-counter";
import ogImage from "@/assets/dressy-og.jpg.asset.json";

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

import heroImg from "@/assets/hero-sewing.jpg";
import worldMap from "@/assets/world-map.jpg";
import factoryImg from "@/assets/factory.jpg";
import ctaImg from "@/assets/cta-tags.png";
import pKnit from "@/assets/p-knit.jpg";
import pWoven from "@/assets/p-woven.jpg";
import pOuterwear from "@/assets/p-outerwear.jpg";
import pFleece from "@/assets/p-fleece.jpg";
import pWorkwear from "@/assets/p-workwear.jpg";
import pDevelopment from "@/assets/p-development.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dressy — Garments Made to Move Brands" },
      {
        name: "description",
        content:
          "Dressy is a Dhaka-based garment manufacturer: design development, sourcing, production, quality and delivery for global fashion brands.",
      },
      { property: "og:title", content: "Dressy — Garments Made to Move Brands" },
      {
        property: "og:description",
        content:
          "Design development, sourcing and garment manufacturing from Bangladesh to global fashion markets.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://dressy-garments.lovable.app/" },
      {
        property: "og:image",
        content: "https://dressy-garments.lovable.app" + ogImage.url,
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image",
        content: "https://dressy-garments.lovable.app" + ogImage.url,
      },
    ],
    links: [{ rel: "canonical", href: "https://dressy-garments.lovable.app/" }],
  }),

  component: Index,
});

const STEPS = ["Research", "Development", "Sourcing", "Production", "Quality", "Delivery"];

const PRODUCTS = [
  { n: "01", name: "Knit", img: pKnit },
  { n: "02", name: "Woven", img: pWoven },
  { n: "03", name: "Outerwear", img: pOuterwear },
  { n: "04", name: "Fleece", img: pFleece },
  { n: "05", name: "Workwear", img: pWorkwear },
  { n: "06", name: "Development", img: pDevelopment },
];

const CAPABILITIES = [
  { icon: Scissors, label: "Cutting" },
  { icon: Ruler, label: "Sewing" },
  { icon: Sparkles, label: "Finishing" },
  { icon: Stamp, label: "Print & Embellishment" },
  { icon: PenTool, label: "Sample & CAD" },
  { icon: BadgeCheck, label: "Quality Control" },
  { icon: Briefcase, label: "Commercial" },
];

const CERTS = ["BSCI", "OEKO-TEX® STANDARD 100", "Sedex", "Global Recycled Standard"];

const WELFARE = [
  { icon: ShieldCheck, label: "Worker Safety" },
  { icon: Baby, label: "No Child Labour" },
  { icon: Flame, label: "Fire Safety" },
  { icon: HeartPulse, label: "Medical Facility" },
  { icon: HandHeart, label: "Worker Welfare" },
];

const MARKETS = [
  { label: "North America", top: "42%", left: "20%" },
  { label: "Europe", top: "26%", left: "48%" },
  { label: "South Africa", top: "62%", left: "45%" },
  { label: "Australia", top: "66%", left: "76%" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SiteHeader />

      <AutoReveal>
      {/* Hero with Streamable Video Background */}
      <section className="relative min-h-screen md:min-h-[85vh] lg:min-h-[88vh] w-full overflow-hidden border-b border-border flex flex-col justify-center pb-12">
        {/* Background Video Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px] z-10" />
          <iframe
            src="https://streamable.com/e/1solet?autoplay=1&muted=1&nocontrols=1&loop=1"
            allow="autoplay; fullscreen"
            allowFullScreen
            title="Dressy Hero Background Video"
            className="absolute top-1/2 left-1/2 h-full w-full min-w-[320vw] min-h-[100dvh] md:min-w-[100vw] md:min-h-[56.25vw] -translate-x-1/2 -translate-y-1/2 object-cover opacity-75 pointer-events-none"
            style={{ border: "none" }}
          />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="label-xs animate-fade-up text-primary font-medium tracking-widest uppercase">Dressy / Bangladesh</p>
              <h1 className="display mt-4 animate-fade-up text-5xl sm:text-7xl lg:text-8xl" style={{ animationDelay: "100ms" }}>
                Garments
                <br />
                Made to
                <br />
                <span className="text-primary">Move Brands.</span>
              </h1>
              <p className="mt-6 max-w-sm animate-fade-up text-sm leading-relaxed text-muted-foreground" style={{ animationDelay: "200ms" }}>
                Design development, sourcing and garment manufacturing from Bangladesh to global
                fashion markets.
              </p>
              <div className="mt-8 flex animate-fade-up flex-wrap items-center gap-6" style={{ animationDelay: "300ms" }}>
                <Link
                  to="/factory"
                  className="label-xs btn-sheen group flex items-center gap-3 bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/20"
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
        <div className="mx-auto grid max-w-[1400px] divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {[
            { icon: Users, value: 500, suffix: "+", label: "People" },
            { icon: Shirt, value: 6, suffix: "M+", label: "PCS / Year" },
            { icon: Factory, value: 7, suffix: "", label: "Production Lines" },
          ].map(({ icon: Icon, value, suffix, label }) => (
            <div key={label} className="flex items-center justify-center gap-6 px-6 py-12">
              <Icon className="size-10 text-primary" strokeWidth={1.2} />
              <div>
                <p className="display text-5xl">
                  <AnimatedCounter value={value} suffix={suffix} />
                </p>
                <p className="label-xs mt-2 text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What we do */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <p className="label-xs text-primary">01 / What We Do</p>
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="display text-5xl md:text-6xl">
                One Partner.
                <br />
                Every Step.
              </h2>
              <div className="mt-8 h-px w-16 bg-primary" />
            </div>
            <div className="max-w-md">
              <p className="text-sm leading-relaxed text-muted-foreground">
                From concept to container, we handle every step with precision, transparency and a
                relentless focus on quality.
              </p>
              <Link
                to="/capabilities"
                className="label-xs mt-8 flex w-full max-w-xs items-center justify-between border-b border-primary pb-3 text-primary group transition-colors hover:opacity-80"
              >
                View All Capabilities <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {STEPS.map((step, i) => (
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
          <p className="label-xs text-primary">02 / Our Products</p>
          <div className="mt-8 grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-6">
            {PRODUCTS.map((p) => (
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
          <p className="label-xs text-primary">03 / Our Factory</p>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr_1fr]">
            <div>
              <h2 className="display text-4xl md:text-5xl">
                Built for
                <br />
                Production.
              </h2>
              <div className="mt-6 h-px w-14 bg-primary" />
              <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
                State-of-the-art facility in Dhaka, Bangladesh. Built to handle quality at scale.
              </p>
              <Link
                to="/factory"
                className="label-xs mt-8 flex w-40 items-center justify-between border-b border-foreground/60 pb-3 group transition-colors hover:opacity-80"
              >
                Take a Tour <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <img
              src={factoryImg}
              alt="Dressy garment factory building in Dhaka"
              loading="lazy"
              width={1000}
              height={700}
              className="h-full w-full object-cover"
            />
            <ul className="divide-y divide-border">
              {CAPABILITIES.map(({ icon: Icon, label }) => (
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
          <p className="label-xs text-primary">04 / Responsibility</p>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <h2 className="display text-4xl md:text-5xl">
                Responsibility
                <br />
                Is Part of
                <br />
                Production.
              </h2>
              <div className="mt-6 h-px w-14 bg-primary" />
              <Link
                to="/compliance"
                className="label-xs mt-8 flex w-56 items-center justify-between border-b border-primary pb-3 text-primary group transition-colors hover:opacity-80"
              >
                Compliance & Ethics <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <div>
              <div className="grid grid-cols-2 divide-border border-border md:grid-cols-4 md:divide-x">
                {CERTS.map((c) => (
                  <div key={c} className="flex items-center justify-center px-4 py-8 text-center transition-colors duration-300 hover:bg-card">
                    <span className="display text-lg text-foreground/90">{c}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 border-t border-border md:grid-cols-5 md:divide-x md:divide-border">
                {WELFARE.map(({ icon: Icon, label }) => (
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
          <h2 className="display text-4xl md:text-5xl">
            Made Here.
            <br />
            Worn Everywhere.
          </h2>
          <div className="relative aspect-[2/1] w-full">
            <img
              src={worldMap}
              alt="World map showing Dressy export markets"
              loading="lazy"
              width={1400}
              height={700}
              className="absolute inset-0 size-full object-contain opacity-90"
            />
            {MARKETS.map((m) => (
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
            Our Global Presence <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-14 md:px-10 lg:grid-cols-[1.1fr_1fr_0.8fr]">
          <div>
            <p className="label-xs">05 / Let's Make Something Great</p>
            <h2 className="display mt-8 text-4xl md:text-5xl">
              Connect With Us
            </h2>
          </div>
          <div className="self-center">
            <p className="max-w-sm text-sm leading-relaxed">
              Send us your tech pack, reference piece or concept. Our team will take it from there.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-8">
              <Link
                to="/contact"
                className="label-xs btn-sheen group flex items-center gap-6 bg-background px-6 py-4 text-foreground"
              >
                Start a Project <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="label-xs group flex items-center gap-6 border-b border-primary-foreground/70 pb-3 transition-opacity hover:opacity-80"
              >
                Send Tech Pack <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
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
    </div>
  );
}
