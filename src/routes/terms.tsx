import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { getSEOMetadata } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () =>
    getSEOMetadata({
      title: "Terms & Conditions — Dressy Clothing Ltd.",
      description:
        "Terms governing the use of the Dressy Clothing Ltd. website, enquiries, quotations and manufacturing orders.",
      url: "/terms",
    }),
  component: TermsPage,
});

const SECTIONS = [
  {
    title: "Use of This Website",
    body: "This website is provided for information about Dressy Clothing Ltd. and its manufacturing services. You agree not to misuse the site, attempt unauthorised access, or use its content for unlawful purposes.",
  },
  {
    title: "Enquiries & Quotations",
    body: "Product details, minimum order quantities and lead times shown here are indicative. A binding agreement is formed only when an order is confirmed in writing with agreed specifications, pricing and delivery dates.",
  },
  {
    title: "Orders & Production",
    body: "Approved samples, tech packs and purchase orders govern production. Any change to specification, quantity or delivery schedule after confirmation may affect price and lead time.",
  },
  {
    title: "Intellectual Property",
    body: "All text, imagery, logos and designs on this site belong to Dressy Clothing Ltd. Buyer-owned designs and artwork shared with us remain the property of the buyer and are treated as confidential.",
  },
  {
    title: "Limitation of Liability",
    body: "We take care to keep the information on this website accurate, but it is provided without warranty. Dressy Clothing Ltd. is not liable for indirect or consequential losses arising from use of the site.",
  },
  {
    title: "Governing Law",
    body: "These terms are governed by the laws of Bangladesh, and disputes fall under the jurisdiction of the courts of Dhaka unless otherwise agreed in a signed contract.",
  },
];

function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal / Terms & Conditions"
      title={
        <>
          Terms &amp;
          <br />
          Conditions.
        </>
      }
      intro="The terms below apply to your use of this website and to enquiries, quotations and orders placed with Dressy Clothing Ltd."
    >
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <ul className="divide-y divide-border border-y border-border">
            {SECTIONS.map((s) => (
              <li key={s.title} className="grid gap-4 py-8 lg:grid-cols-[1fr_2fr]">
                <h2 className="display text-2xl">{s.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-xs text-muted-foreground">
            For contractual questions, email{" "}
            <a className="text-primary hover:underline" href="mailto:info@dressyclothing.com">
              info@dressyclothing.com
            </a>
            .
          </p>
        </div>
      </section>
    </PageShell>
  );
}
