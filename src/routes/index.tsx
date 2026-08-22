import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import ogImage from "@/assets/dressy-og.jpg.asset.json";
import mainLogo from "@/assets/dressy-logo.jpeg.asset.json";

import {
  Menu,
  X,

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
  Linkedin,
  Instagram,
  Mail,
  ArrowUp,
} from "lucide-react";

import heroImg from "@/assets/hero-sewing.jpg";
import worldMap from "@/assets/world-map.jpg";

import factoryImg from "@/assets/factory.jpg";
import ctaImg from "@/assets/cta-tags.jpg";
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

const NAV = ["Capabilities", "Products", "Factory", "Compliance", "About", "Contact"];

const STEPS = [
  "Research",
  "Development",
  "Sourcing",
  "Production",
  "Quality",
  "Delivery",
];

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

const FOOTER = [
  { title: "Company", links: ["About Dressy", "Our Factory", "Leadership", "Global Presence"] },
  { title: "Capabilities", links: ["Development", "Sourcing", "Manufacturing", "Quality", "Delivery"] },
  { title: "Products", links: ["Knit", "Woven", "Outerwear", "Fleece", "Workwear"] },
  { title: "Compliance", links: ["Compliance", "Sustainability", "Worker Welfare"] },
];

function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src={mainLogo.url}
      alt="Dressy"
      className={`h-8 w-auto object-contain ${className}`}
    />
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Nav */}
      <header className="mx-auto max-w-[1400px] px-6 py-6 md:px-10">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-8">
            {NAV.map((item) => (
              <a key={item} href="#" className="label-xs text-foreground/80 transition-colors hover:text-primary">
                {item}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="label-xs ml-auto hidden items-center gap-3 border-b border-primary pb-1 text-primary sm:flex lg:ml-0"
          >
            Start a Project <ArrowRight className="size-4" />
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o: boolean) => !o)}
            className="ml-auto text-primary lg:hidden"
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mt-6 flex flex-col gap-4 border-t border-border pt-6 lg:hidden">
            {NAV.map((item) => (
              <a key={item} href="#" className="label-xs text-foreground/80">
                {item}
              </a>
            ))}
            <a href="#contact" className="label-xs text-primary">
              Start a Project
            </a>
          </nav>
        )}
      </header>


      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="label-xs text-primary">Dressy / Bangladesh</p>
            <h1 className="display mt-6 text-6xl sm:text-7xl lg:text-8xl">
              Garments
              <br />
              Made to
              <br />
              <span className="text-primary">Move Brands.</span>
            </h1>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Design development, sourcing and garment manufacturing from Bangladesh to global
              fashion markets.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              <a
                href="#factory"
                className="label-xs flex items-center gap-4 bg-primary px-6 py-4 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Explore Our Factory <ArrowRight className="size-4" />
              </a>
              <a
                href="#contact"
                className="label-xs flex items-center gap-10 border-b border-foreground/60 pb-3"
              >
                Start Production <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <img
              src={heroImg}
              alt="Industrial sewing machine stitching fabric"
              width={1200}
              height={900}
              className="size-full object-cover grayscale"
            />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 pb-10">
          <div className="flex items-center gap-8">
            {["01", "02", "03", "04"].map((n, i) => (
              <span
                key={n}
                className={`label-xs pb-2 ${
                  i === 0 ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
                }`}
              >
                {n}
              </span>
            ))}
          </div>
          <p className="label-xs text-muted-foreground">Dhaka, Bangladesh &nbsp;/&nbsp; Global Production</p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border">
        <div className="mx-auto grid max-w-[1400px] divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {[
            { icon: Users, value: "1000+", label: "People" },
            { icon: Shirt, value: "5M+", label: "Pcs / Year" },
            { icon: Factory, value: "7", label: "Production Lines" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center justify-center gap-6 px-6 py-12">
              <Icon className="size-10 text-primary" strokeWidth={1.2} />
              <div>
                <p className="display text-5xl">{value}</p>
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
              <a
                href="#"
                className="label-xs mt-8 flex w-full max-w-xs items-center justify-between border-b border-primary pb-3 text-primary"
              >
                View All Capabilities <ArrowRight className="size-4" />
              </a>
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
              <a key={p.name} href="#" className="group relative aspect-[3/4] overflow-hidden bg-card">
                <img
                  src={p.img}
                  alt={`${p.name} garment detail`}
                  loading="lazy"
                  width={600}
                  height={800}
                  className="size-full object-cover grayscale transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/40" />
                <div className="absolute left-4 top-4">
                  <p className="display text-2xl">{p.n}</p>
                  <p className="label-xs mt-1">{p.name}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-10 flex justify-end">
            <a
              href="#"
              className="label-xs flex w-full max-w-xs items-center justify-between border-b border-primary pb-3 text-primary"
            >
              View All Products <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Factory */}
      <section id="factory" className="border-b border-border">
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
              <a
                href="#"
                className="label-xs mt-8 flex w-40 items-center justify-between border-b border-foreground/60 pb-3"
              >
                Take a Tour <ArrowRight className="size-4" />
              </a>
            </div>
            <img
              src={factoryImg}
              alt="Dressy garment factory building in Dhaka"
              loading="lazy"
              width={1000}
              height={700}
              className="h-full w-full object-cover grayscale"
            />
            <ul className="divide-y divide-border">
              {CAPABILITIES.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <a href="#" className="flex items-center gap-4 py-4 transition-colors hover:text-primary">
                    <Icon className="size-4 text-primary" strokeWidth={1.4} />
                    <span className="label-xs flex-1">{label}</span>
                    <ArrowRight className="size-4 text-primary" />
                  </a>
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
            </div>
            <div>
              <div className="grid grid-cols-2 divide-border border-border md:grid-cols-4 md:divide-x">
                {CERTS.map((c) => (
                  <div key={c} className="flex items-center justify-center px-4 py-8 text-center">
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

          <a
            href="#"
            className="label-xs flex items-center justify-between border-b border-primary pb-3 text-primary"
          >
            Our Global Presence <ArrowRight className="size-4" />
          </a>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-14 md:px-10 lg:grid-cols-[1.1fr_1fr_0.8fr]">
          <div>
            <p className="label-xs">05 / Let's Make Something Great</p>
            <h2 className="display mt-8 text-4xl md:text-5xl">
              Have a Product
              <br />
              In Mind?
            </h2>
          </div>
          <div className="self-center">
            <p className="max-w-sm text-sm leading-relaxed">
              Send us your tech pack, reference piece or concept. Our team will take it from there.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-8">
              <a
                href="#"
                className="label-xs flex items-center gap-6 bg-background px-6 py-4 text-foreground"
              >
                Start a Project <ArrowRight className="size-4" />
              </a>
              <a
                href="#"
                className="label-xs flex items-center gap-6 border-b border-primary-foreground/70 pb-3"
              >
                Send Tech Pack <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
          <img
            src={ctaImg}
            alt="Dressy branded hang tags and paper bag"
            loading="lazy"
            width={900}
            height={700}
            className="h-full max-h-64 w-full object-cover grayscale"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-[1400px] px-6 py-14 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(5,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 text-xs text-muted-foreground">
              Garments made to
              <br />
              move brands.
            </p>
            <div className="mt-10 flex items-center gap-5 text-muted-foreground">
              <a href="#" aria-label="LinkedIn"><Linkedin className="size-4" /></a>
              <a href="#" aria-label="Instagram"><Instagram className="size-4" /></a>
              <a href="#" aria-label="Email"><Mail className="size-4" /></a>
            </div>
          </div>
          {FOOTER.map((col) => (
            <div key={col.title}>
              <p className="label-xs text-primary">{col.title}</p>
              <ul className="mt-5 space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="label-xs text-primary">Contact</p>
            <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
              <li>Dhaka, Bangladesh</li>
              <li>+880 1234 567890</li>
              <li>hello@dressybd.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-[11px] text-muted-foreground">
            © 2026 Dressy Clothing Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[11px] text-muted-foreground">Privacy Policy</a>
            <span className="text-[11px] text-muted-foreground">/</span>
            <a href="#" className="text-[11px] text-muted-foreground">Terms &amp; Conditions</a>
            <a
              href="#top"
              aria-label="Back to top"
              className="flex size-9 items-center justify-center rounded-full border border-primary text-primary"
            >
              <ArrowUp className="size-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
