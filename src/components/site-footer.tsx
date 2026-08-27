import { Link } from "@tanstack/react-router";
import { Linkedin, Instagram, Mail, ArrowUp } from "lucide-react";
import { Logo } from "./site-header";

type FooterLink = {
  label: string;
  to: string;
  hash?: string;
  search?: { q: string };
};

const FOOTER: { title: string; links: FooterLink[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About Dressy", to: "/about", hash: "story" },
      { label: "Our Factory", to: "/factory" },
      { label: "Leadership", to: "/about", hash: "leadership" },
      { label: "Global Presence", to: "/about", hash: "global" },
    ],
  },
  {
    title: "Capabilities",
    links: [
      { label: "Development", to: "/capabilities", hash: "process" },
      { label: "Sourcing", to: "/capabilities", hash: "process" },
      { label: "Manufacturing", to: "/capabilities", hash: "services" },
      { label: "Quality", to: "/capabilities", hash: "services" },
      { label: "Delivery", to: "/capabilities", hash: "process" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Knit", to: "/products", search: { q: "Knit" } },
      { label: "Woven", to: "/products", search: { q: "Woven" } },
      { label: "Outerwear", to: "/products", search: { q: "Outerwear" } },
      { label: "Fleece", to: "/products", search: { q: "Fleece" } },
      { label: "Workwear", to: "/products", search: { q: "Workwear" } },
    ],
  },
  {
    title: "Compliance",
    links: [
      { label: "Compliance", to: "/compliance", hash: "certifications" },
      { label: "Sustainability", to: "/compliance", hash: "sustainability" },
      { label: "Worker Welfare", to: "/compliance", hash: "welfare" },
    ],
  },
];

export function SiteFooter() {
  return (
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
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-primary">
              <Linkedin className="size-4" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-primary">
              <Instagram className="size-4" />
            </a>
            <a href="mailto:info@dressyclothing.com" aria-label="Email" className="hover:text-primary">
              <Mail className="size-4" />
            </a>
          </div>
        </div>
        {FOOTER.map((col) => (
          <div key={col.title}>
            <p className="label-xs text-primary">{col.title}</p>
            <ul className="mt-5 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    {...(l.hash ? { hash: l.hash } : {})}
                    {...(l.search ? { search: l.search } : {})}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="label-xs text-primary">Contact</p>
          <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
            <li>
              <a
                href="https://maps.app.goo.gl/6FepzNpWRSVHpofe8"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors inline-block"
              >
                House # 475, Flat # B3, Road # 08/A DOHS Baridhara, Dressy Clothing LTD Kathgara, Ashulia, Dhaka Bangladesh 1206
              </a>
            </li>
            <li>
              <a href="tel:+8801754104307" className="hover:text-foreground">+88 01754104307</a>
              {" & "}
              <a href="tel:+8801751244211" className="hover:text-foreground">+88 01751244211</a>
            </li>
            <li>
              <a href="mailto:info@dressyclothing.com" className="hover:text-foreground">info@dressyclothing.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <p className="text-[11px] text-muted-foreground">
          © 2026 Dressy Clothing Ltd. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <p className="text-[11px] text-muted-foreground">
            Build by FlamaFlys.
          </p>
          <Link to="/privacy" className="text-[11px] text-muted-foreground transition-colors hover:text-foreground">
            Privacy Policy
          </Link>
          <span className="text-[11px] text-muted-foreground">/</span>
          <Link to="/terms" className="text-[11px] text-muted-foreground transition-colors hover:text-foreground">
            Terms &amp; Conditions
          </Link>
          <button
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex size-9 items-center justify-center rounded-full border border-primary text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
