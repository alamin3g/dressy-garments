import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ArrowRight } from "lucide-react";
import mainLogo from "@/assets/dressy-logo.png.asset.json";

export const NAV = [
  { label: "Capabilities", to: "/capabilities" },
  { label: "Products", to: "/products" },
  { label: "Factory", to: "/factory" },
  { label: "Compliance", to: "/compliance" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" aria-label="Dressy home" className="inline-flex">
      <img
        src={mainLogo.url}
        alt="Dressy"
        className={`h-8 w-auto object-contain ${className}`}
      />
    </Link>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="mx-auto max-w-[1400px] px-6 py-6 md:px-10">
      <div className="flex items-center gap-6">
        <Logo />
        <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-8">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="label-xs text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "label-xs text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/contact"
          className="label-xs ml-auto hidden items-center gap-3 border-b border-primary pb-1 text-primary sm:flex lg:ml-0"
        >
          Start a Project <ArrowRight className="size-4" />
        </Link>
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o: boolean) => !o)}
          className="ml-auto text-primary lg:hidden"
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {menuOpen && (
        <nav className="mt-6 flex flex-col gap-4 border-t border-border pt-6 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className="label-xs text-foreground/80"
            >
              {item.label}
            </Link>
          ))}
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="label-xs text-primary">
            Start a Project
          </Link>
        </nav>
      )}
    </header>
  );
}
