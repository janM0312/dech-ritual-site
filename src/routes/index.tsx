import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import heroImg from "@/assets/photos/hero.jpg";
import heroImgSm from "@/assets/photos/hero-sm.jpg";
import lucieImg from "@/assets/photos/o-mne.jpg";
import lucieImgSm from "@/assets/photos/o-mne-sm.jpg";
import breathworkImg from "@/assets/photos/breathwork.jpg";
import breathworkImgSm from "@/assets/photos/breathwork-sm.jpg";
import sluzbyIndividualniImg from "@/assets/photos/sluzby-individualni.jpg";
import sluzbyIndividualniImgSm from "@/assets/photos/sluzby-individualni-sm.jpg";
import sluzbySkupinaImg from "@/assets/photos/sluzby-skupina.jpg";
import sluzbySkupinaImgSm from "@/assets/photos/sluzby-skupina-sm.jpg";
import sluzbyRetreatyImg from "@/assets/photos/sluzby-retreaty.jpg";
import sluzbyRetreatyImgSm from "@/assets/photos/sluzby-retreaty-sm.jpg";
import sluzbyFiremniImg from "@/assets/photos/sluzby-firemni.jpg";
import sluzbyFiremniImgSm from "@/assets/photos/sluzby-firemni-sm.jpg";
import {
  dotazy,
  hero,
  hlavicka,
  komunita,
  kontakt,
  oMne,
  prinosy,
  reference,
  rezervace,
  sluzby,
} from "@/content";
import type { Block } from "@/content/parse";

export const Route = createFileRoute("/")({
  component: Index,
});

const nav = hlavicka.items.map((i) => ({
  href: i.meta.href ?? "",
  label: i.title,
}));

const benefits = prinosy.items.map((i) => ({
  n: i.meta.n ?? "",
  title: i.title,
  body: i.body,
}));

type ServiceImage = { lg: string; sm: string; width: number; height: number };

const serviceImages: Record<string, ServiceImage> = {
  individual: { lg: sluzbyIndividualniImg, sm: sluzbyIndividualniImgSm, width: 1200, height: 960 },
  kruhy: { lg: sluzbySkupinaImg, sm: sluzbySkupinaImgSm, width: 1000, height: 1250 },
  workshopy: { lg: sluzbyRetreatyImg, sm: sluzbyRetreatyImgSm, width: 1200, height: 1500 },
  firmy: { lg: sluzbyFiremniImg, sm: sluzbyFiremniImgSm, width: 1200, height: 960 },
};

const services = sluzby.items.map((i, idx) => ({
  id: i.meta.id ?? String(idx),
  title: i.title,
  tag: i.meta.tag ?? "",
  body: i.body,
  price: i.meta.price ?? "",
  image: serviceImages[i.meta.id ?? ""],
}));

const testimonials = reference.items.map((i) => ({
  quote: i.body,
  name: i.title,
  role: i.meta.role ?? "",
}));

const faqs = dotazy.items.map((i) => ({
  q: i.title,
  a: i.body,
}));

function Prose({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) =>
        block.type === "ul" ? (
          <ul key={i} className="list-disc space-y-1 pl-5">
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{block.text}</p>
        ),
      )}
    </>
  );
}

function Index() {
  const [activeService, setActiveService] = useState(services[0].id);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const active = services.find((s) => s.id === activeService)!;
  const zenamuRef = useRef<HTMLDivElement>(null);

  // Loaded lazily (only once the calendar scrolls into view) since list.js is
  // a ~1 MB third-party bundle that otherwise blocks the main thread on
  // initial page load. Its own collapsed-panel accordion leaves a focusable
  // button reachable inside an aria-hidden container, and it sets a cookie via
  // api.zenamu.com/graphql — both are on zenamu.com's side, not ours to patch.
  useEffect(() => {
    const el = zenamuRef.current;
    if (!el) return;

    const src = "https://zenamu.com/calendar/list.js";
    const loadScript = () => {
      if (document.querySelector(`script[src="${src}"]`)) return;
      const script = document.createElement("script");
      script.src = src;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadScript();
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
          <a href="#top" className="font-serif text-2xl tracking-tight text-brown-deep">
            dech<span className="text-brown">.</span>ritual
          </a>
          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-sm text-muted-foreground transition-colors hover:text-brown-deep"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href="#rezervace"
            className="rounded-full bg-brown px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-brown-deep hover:shadow-lg"
          >
            {hlavicka.meta.cta}
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section id="top" className="relative overflow-hidden">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-10 lg:py-32">
            <div className="flex flex-col justify-center">
              <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-brown/30 bg-cream px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-brown-deep">
                <span className="h-1.5 w-1.5 rounded-full bg-brown" />
                {hero.meta.eyebrow}
              </span>
              <h1 className="font-serif text-5xl leading-[1.05] text-brown-deep sm:text-6xl lg:text-7xl">
                {hero.meta.headline_start}{" "}
                <em className="italic text-brown">{hero.meta.headline_em}</em>{" "}
                {hero.meta.headline_end}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {hero.meta.subheadline}
              </p>
              {hero.body.length > 0 && (
                <div className="mt-4 max-w-xl space-y-4 text-muted-foreground">
                  <Prose blocks={hero.body} />
                </div>
              )}
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="#rezervace"
                  className="rounded-full bg-brown px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-brown-deep hover:shadow-lg"
                >
                  {hero.meta.cta_primary}
                </a>
                <a
                  href="#breathwork"
                  className="rounded-full border border-brown/40 px-7 py-3.5 text-sm font-medium text-brown-deep transition-colors hover:bg-rose/60"
                >
                  {hero.meta.cta_secondary}
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-rose/50 blur-2xl" />
              <img
                src={heroImg}
                srcSet={`${heroImgSm} 700w, ${heroImg} 1600w`}
                sizes="(min-width: 1024px) 50vw, 100vw"
                width={1600}
                height={1280}
                alt="Žena při meditačním dechovém cvičení"
                className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-card px-5 py-4 shadow-lg sm:block">
                <p className="font-serif text-2xl text-brown-deep">{hero.meta.stat_number}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {hero.meta.stat_label}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="o-mne" className="border-t border-border/60 bg-cream">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 py-24 md:grid-cols-[0.9fr_1.1fr] lg:px-10">
            <div className="relative">
              <img
                src={lucieImg}
                srcSet={`${lucieImgSm} 700w, ${lucieImg} 1100w`}
                sizes="(min-width: 768px) 45vw, 100vw"
                width={1100}
                height={1375}
                loading="lazy"
                alt="Lucie Vaňková, breathwork instruktorka"
                className="aspect-[4/5] w-full rounded-[1.75rem] object-cover shadow-md"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="mb-4 text-xs uppercase tracking-[0.25em] text-brown">
                {oMne.meta.eyebrow}
              </span>
              <h2 className="font-serif text-4xl leading-tight text-brown-deep sm:text-5xl">
                {oMne.meta.title}
              </h2>
              <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-muted-foreground">
                <Prose blocks={oMne.body} />
              </div>
              <div className="mt-8 flex gap-8 border-t border-border pt-6">
                {oMne.items.map((s) => (
                  <div key={s.title}>
                    <p className="font-serif text-3xl text-brown-deep">{s.title}</p>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {s.meta.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What is Breathwork */}
        <section id="breathwork" className="border-t border-border/60">
          <div className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <img
                src={breathworkImg}
                srcSet={`${breathworkImgSm} 700w, ${breathworkImg} 1200w`}
                sizes="(min-width: 768px) 45vw, 100vw"
                width={1200}
                height={960}
                loading="lazy"
                alt={prinosy.meta.title}
                className="aspect-[4/5] w-full rounded-[1.75rem] object-cover shadow-md"
              />
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-brown">
                  {prinosy.meta.eyebrow}
                </span>
                <h2 className="mt-4 font-serif text-4xl leading-tight text-brown-deep sm:text-5xl">
                  {prinosy.meta.title}
                </h2>
                <div className="mt-5 space-y-3 text-muted-foreground">
                  <Prose blocks={prinosy.body} />
                </div>
              </div>
            </div>
            <div className="mt-16 flex flex-wrap justify-center gap-3">
              {benefits.map((b) => (
                <span
                  key={b.n}
                  className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-brown-deep shadow-sm transition-colors hover:border-brown/40"
                >
                  {b.title}
                </span>
              ))}
            </div>
            {prinosy.outro.length > 0 && (
              <div className="mx-auto mt-16 max-w-2xl space-y-3 text-center text-muted-foreground">
                <Prose blocks={prinosy.outro} />
              </div>
            )}
          </div>
        </section>

        {/* Services */}
        <section id="sluzby" className="border-t border-border/60 bg-rose/30">
          <div className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-brown">
                  {sluzby.meta.eyebrow}
                </span>
                <h2 className="mt-4 font-serif text-4xl leading-tight text-brown-deep sm:text-5xl">
                  {sluzby.meta.title}
                </h2>
              </div>
              <p className="max-w-md text-muted-foreground">{sluzby.meta.intro}</p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
              <div className="flex flex-col gap-2">
                {services.map((s) => {
                  const isActive = s.id === activeService;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveService(s.id)}
                      className={`group flex items-center justify-between rounded-2xl border px-6 py-5 text-left transition-all ${
                        isActive
                          ? "border-brown bg-card shadow-sm"
                          : "border-transparent bg-cream/60 hover:border-brown/30"
                      }`}
                    >
                      <div>
                        <p className="text-xs uppercase tracking-widest text-brown">{s.tag}</p>
                        <p className="mt-1 font-serif text-xl text-brown-deep">{s.title}</p>
                      </div>
                      <span
                        className={`text-xl transition-transform ${isActive ? "translate-x-1 text-brown" : "text-muted-foreground"}`}
                      >
                        →
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="overflow-hidden rounded-3xl bg-card shadow-sm">
                {active.image && (
                  <img
                    src={active.image.lg}
                    srcSet={`${active.image.sm} 700w, ${active.image.lg} ${active.image.width}w`}
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    width={active.image.width}
                    height={active.image.height}
                    alt={active.title}
                    className="aspect-[16/9] w-full object-cover"
                  />
                )}
                <div className="p-10">
                  <p className="text-xs uppercase tracking-[0.25em] text-brown">{active.tag}</p>
                  <h3 className="mt-3 font-serif text-3xl text-brown-deep sm:text-4xl">
                    {active.title}
                  </h3>
                  <div className="mt-5 space-y-3 leading-relaxed text-muted-foreground">
                    <Prose blocks={active.body} />
                  </div>
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                    <p className="font-serif text-2xl text-brown-deep">{active.price}</p>
                    <a
                      href="#rezervace"
                      className="rounded-full bg-brown px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-brown-deep"
                    >
                      {sluzby.meta.cta}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reservation / Zenamu */}
        <section id="rezervace" className="border-t border-border/60">
          <div className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs uppercase tracking-[0.25em] text-brown">
                {rezervace.meta.eyebrow}
              </span>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-brown-deep sm:text-5xl">
                {rezervace.meta.title}
              </h2>
              <p className="mt-5 text-muted-foreground">{rezervace.meta.subtitle}</p>
            </div>

            <div className="mt-14 overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-8">
              <div
                ref={zenamuRef}
                id="zenamu-calendar"
                calendar-id="865e2d474c26361276fcee490a5b6298"
              />
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">{rezervace.meta.note}</p>
          </div>
        </section>

        {/* HeroHero Community */}
        <section className="border-t border-border/60 bg-brown-deep text-cream">
          <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
            <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-cream/60">
                  {komunita.meta.eyebrow}
                </span>
                <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                  {komunita.meta.title}
                </h2>
                <p className="mt-5 max-w-xl text-cream/70">{komunita.meta.text}</p>
              </div>
              <div className="flex md:justify-end">
                <a
                  href={kontakt.meta.herohero_href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-brown-deep transition-all hover:bg-rose"
                >
                  {komunita.meta.cta}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-t border-border/60">
          <div className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs uppercase tracking-[0.25em] text-brown">
                {reference.meta.eyebrow}
              </span>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-brown-deep sm:text-5xl">
                {reference.meta.title}
              </h2>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure
                  key={t.name}
                  className="flex flex-col justify-between rounded-3xl border border-border bg-card p-8 shadow-sm"
                >
                  <div className="font-serif text-4xl leading-none text-brown">"</div>
                  <blockquote className="mt-2 space-y-3 text-[15px] leading-relaxed text-foreground/80">
                    <Prose blocks={t.quote} />
                  </blockquote>
                  <figcaption className="mt-8 border-t border-border pt-4">
                    <p className="font-serif text-lg text-brown-deep">{t.name}</p>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {t.role}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-border/60 bg-rose/30">
          <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 md:grid-cols-[1fr_1.4fr] lg:px-10">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-brown">
                {dotazy.meta.eyebrow}
              </span>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-brown-deep sm:text-5xl">
                {dotazy.meta.title}
              </h2>
              <p className="mt-5 text-muted-foreground">{dotazy.meta.intro}</p>
            </div>
            <div className="flex flex-col gap-3">
              {faqs.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div
                    key={f.q}
                    className="overflow-hidden rounded-2xl border border-border bg-card"
                  >
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="font-serif text-lg text-brown-deep">{f.q}</span>
                      <span
                        className={`text-2xl text-brown transition-transform ${open ? "rotate-45" : ""}`}
                      >
                        +
                      </span>
                    </button>
                    {open && (
                      <div className="space-y-2 px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                        <Prose blocks={f.a} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer / Contact */}
      <footer id="kontakt" className="border-t border-border/60 bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
          <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
            <div>
              <a href="#top" className="font-serif text-3xl tracking-tight text-brown-deep">
                dech<span className="text-brown">.</span>ritual
              </a>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {kontakt.meta.tagline}
              </p>
              <p className="mt-6 rounded-2xl border border-border bg-card p-4 text-xs text-muted-foreground">
                {kontakt.meta.payment_note}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brown">
                {kontakt.meta.contact_heading}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                <li>{kontakt.meta.name}</li>
                <li>
                  <a href={`mailto:${kontakt.meta.email}`} className="hover:text-brown-deep">
                    {kontakt.meta.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${kontakt.meta.phone_href}`} className="hover:text-brown-deep">
                    {kontakt.meta.phone_display}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brown">
                {kontakt.meta.social_heading}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                <li>
                  <a href={kontakt.meta.instagram_href} target="_blank" className="hover:text-brown-deep">
                    {kontakt.meta.instagram_label}
                  </a>
                </li>
                <li>
                  <a
                    href={kontakt.meta.herohero_href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brown-deep"
                  >
                    {kontakt.meta.herohero_label}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
            <p>
              © {new Date().getFullYear()} dech.ritual · {kontakt.meta.name}
            </p>
            <p>{kontakt.meta.footer_note}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
