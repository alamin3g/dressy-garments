import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

export function useInView<T extends HTMLElement>(threshold = 0.05) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: "120px 0px 120px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  variant?: "up" | "fade" | "left" | "right" | "scale";
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  variant = "up",
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      data-visible={inView ? "true" : "false"}
      style={{ transitionDelay: `${delay}ms` }}
      className={className}
    >
      {children}
    </Tag>
  );
}

/**
 * Applies a smooth scroll-reveal transition to sections while ensuring
 * content is immediately visible on initial page load and route transitions.
 */
export function AutoReveal({
  children,
  skipFirst = true,
}: {
  children: ReactNode;
  skipFirst?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const sections = Array.from(root.querySelectorAll<HTMLElement>(":scope > section"));
    
    // Ensure all sections are visible immediately
    sections.forEach((s) => {
      s.dataset["visible"] = "true";
    });

    if (typeof IntersectionObserver === "undefined") return;

    const obsSections = sections.slice(skipFirst ? 1 : 0);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset["visible"] = "true";
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "100px 0px 100px 0px" },
    );

    obsSections.forEach((s) => {
      const rect = s.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight + 100 && rect.bottom > -100;
      if (inViewport) {
        s.dataset["visible"] = "true";
      } else {
        s.dataset["reveal"] = "up";
        s.dataset["visible"] = "false";
        obs.observe(s);
      }
    });

    return () => obs.disconnect();
  }, [skipFirst]);

  return <div ref={ref}>{children}</div>;
}
