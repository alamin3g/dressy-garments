import { createFileRoute } from "@tanstack/react-router";
import { Users, Shirt, Factory as FactoryIcon, Ruler } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import factoryImg from "@/assets/factory.jpg";
import heroImg from "@/assets/hero-sewing.jpg";
import futureUpAsset from "@/assets/Dressy_Future_Up.png.asset.json";
import receptionAsset from "@/assets/Dressy_Receiption.png.asset.json";
import insideAsset from "@/assets/Dressy_Inside_Preview.png.asset.json";
import packageAsset from "@/assets/Dressy_Package_real.png.asset.json";
import { getSEOMetadata } from "@/lib/seo";
import { usePageContent, mergeList, DEFAULTS } from "@/lib/page-content";


export const Route = createFileRoute("/factory")({
  head: () => getSEOMetadata({
    title: "Our Factory — Manufacturing Excellence in Dhaka",
    description: "Inside Dressy's Dhaka facility: 7 production lines, 500+ people and 6M+ pieces a year capacity.",
    url: "/factory",
    image: "/__l5e/assets-v1/cbc3c3bb-0e8d-4ce5-9eb4-55ec1a2fac97/dressy-og.jpg",
  }),

  component: FactoryPage,
});

const STAT_ICONS = [Users, Shirt, FactoryIcon, Ruler];
const STATS = DEFAULTS.factory.stats.map(([value, label], i) => ({
  icon: STAT_ICONS[i % STAT_ICONS.length]!,
  value,
  label,
}));

const FLOORS = DEFAULTS.factory.floors.map(([name, body]) => ({ name, body }));

const GALLERY = [
  { src: futureUpAsset.url, alt: "Aerial view of the Dressy Clothing Ltd. factory campus in Ashulia, Dhaka" },
  { src: receptionAsset.url, alt: "Dressy reception and showroom lobby" },
  { src: insideAsset.url, alt: "Dressy sewing floor with operators at production lines" },
  { src: packageAsset.url, alt: "Packed Dressy cartons ready for export" },
];


function FactoryPage() {
  const c = usePageContent("/factory");
  const stats = mergeList(c("stats"), STATS, (parts, fb) => ({
    icon: fb.icon,
    value: parts[0] ?? fb.value,
    label: parts[1] ?? fb.label,
  }));
  const floors = mergeList(c("floors"), FLOORS, (parts, fb) => ({
    name: parts[0] ?? fb.name,
    body: parts[1] ?? fb.body,
  }));
  return (
    <PageShell
      path="/factory"
      eyebrow="03 / Our Factory"
      title={
        <>
          Built for
          <br />
          Production.
        </>
      }
      intro="A state-of-the-art facility in Dhaka, Bangladesh, built to handle quality at scale — from fabric in to carton out."
    >
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 divide-y divide-border sm:grid-cols-2 md:grid-cols-4 md:divide-x md:divide-y-0">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center justify-center gap-4 px-4 py-8 sm:gap-5 sm:px-6 sm:py-12">
              <Icon className="size-8 text-primary sm:size-9" strokeWidth={1.2} />
              <div>
                <p className="display text-3xl sm:text-4xl">{value}</p>
                <p className="label-xs mt-2 text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] gap-px bg-border px-0 py-0 md:grid-cols-2">
          <img
            src={c("gallery_image_1", factoryImg)}
            alt="Dressy factory building exterior in Dhaka"
            loading="lazy"
            width={1000}
            height={700}
            className="h-full max-h-[520px] w-full object-cover"
          />
          <img
            src={c("gallery_image_2", heroImg)}
            alt="Operator sewing a garment on the production line"
            loading="lazy"
            width={1000}
            height={700}
            className="h-full max-h-[520px] w-full object-cover"
          />
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <div className="mb-16">
            <p className="label-xs text-primary">Future Projects</p>
            <h2 className="display mt-2 text-2xl sm:text-3xl">Capacity expansion & new lines</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {GALLERY.map((img) => (
                <img
                  key={img.alt}
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  width={1024}
                  height={576}
                  className="h-56 w-full rounded-2xl object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              ))}
            </div>
          </div>
          <p className="label-xs text-primary">{c("floors_label", "Inside the Facility")}</p>
          <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {floors.map((f, i) => (
              <div key={f.name} className="bg-background p-8">
                <span className="display text-3xl text-muted-foreground">{`0${i + 1}`}</span>
                <h2 className="display mt-4 text-2xl">{f.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
