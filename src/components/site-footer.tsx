import { Link } from "@tanstack/react-router";
import { Linkedin, Instagram, Mail, ArrowUp } from "lucide-react";
import { Logo } from "./site-header";

const FOOTER = [
  {
    title: "Company",
    links: [
      { label: "About Dressy", to: "/about" },
      { label: "Our Factory", to: "/factory" },
      { label: "Leadership", to: "/about" },
      { label: "Global Presence", to: "/about" },
    ],
  },
  {
    title: "Capabilities",
    links: [
      { label: "Development", to: "/capabilities" },
      { label: "Sourcing", to: "/capabilities" },
      { label: "Manufacturing", to: "/capabilities" },
      { label: "Quality", to: "/capabilities" },
      { label: "Delivery", to: "/capabilities" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Knit", to: "/products" },
      { label: "Woven", to: "/products" },
      { label: "Outerwear", to: "/products" },
      { label: "Fleece", to: "/products" },
      { label: "Workwear", to: "/products" },
    ],
  },
  {
    title: "Compliance",
    links: [
      { label: "Compliance", to: "/compliance" },
      { label: "Sustainability", to: "/compliance" },
      { label: "Worker Welfare", to: "/compliance" },
    ],
  },
] as const;

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
            <a href="mailto:hello@dressybd.com" aria-label="Email" className="hover:text-primary">
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
                  <Link to={l.to} className="text-xs text-muted-foreground hover:text-foreground">
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
            <li>Dhaka, Bangladesh</li>
            <li>
              <a href="tel:+8801234567890" className="hover:text-foreground">+880 1234 567890</a>
            </li>
            <li>
              <a href="mailto:hello@dressybd.com" className="hover:text-foreground">hello@dressybd.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <p className="text-[11px] text-muted-foreground">
          © 2026 Dressy Clothing Ltd. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <span className="text-[11px] text-muted-foreground">Privacy Policy</span>
          <span className="text-[11px] text-muted-foreground">/</span>
          <span className="text-[11px] text-muted-foreground">Terms &amp; Conditions</span>
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
