import { useEffect, useState } from "react";
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
        className={`h-8 w-auto object-contain transition-transform duration-500 hover:scale-105 ${className}`}
      />
    </Link>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled
          ? "mx-3 mt-3 rounded-b-2xl border border-border/60 bg-background/60 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.45)] backdrop-blur-2xl saturate-[140%] md:mx-5"
          : "border-b border-transparent bg-background/0"
      }`}
    >
      <div
        className={`mx-auto max-w-[1400px] px-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:px-10 ${
          scrolled ? "py-2.5" : "py-6"
        }`}
      >
        <div className="flex items-center gap-6">
          <Logo className={scrolled ? "h-6" : "h-8"} />
          <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-8">
            {NAV.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                style={{ animationDelay: `${80 + i * 45}ms` }}
                className="label-xs link-underline text-foreground/80 transition-colors duration-300 hover:text-primary"
                activeProps={{ className: "label-xs link-underline text-primary" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/contact"
            className="label-xs group ml-auto hidden items-center gap-3 border-b border-foreground/60 pb-1 text-foreground transition-colors duration-300 hover:text-primary hover:border-primary sm:flex lg:ml-0"
          >
            Start a Project
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o: boolean) => !o)}
            className="ml-auto text-foreground transition-transform duration-300 active:scale-90 lg:hidden"
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        <div
          className={`grid overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
            menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <nav className="min-h-0">
            <div className="mt-6 flex flex-col gap-4 border-t border-border/60 pt-6">
              {NAV.map((item, i) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  style={{ transitionDelay: menuOpen ? `${i * 40}ms` : "0ms" }}
                  className={`label-xs text-foreground/80 transition-all duration-500 hover:text-primary ${
                    menuOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="label-xs text-foreground"
              >
                Start a Project
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );

}
