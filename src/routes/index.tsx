import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import heroImg from "@/assets/hero.jpg";
import lucieImg from "@/assets/lucie.jpg";
import { dotazy, oMne, prinosy, reference, sluzby } from "@/content";
import type { Block } from "@/content/parse";

export const Route = createFileRoute("/")({
  component: Index,
});

const nav = [
  { href: "#o-mne", label: "O mně" },
  { href: "#breathwork", label: "Co je Breathwork" },
  { href: "#sluzby", label: "Služby" },
  { href: "#rezervace", label: "Kalendář & Rezervace" },
  { href: "#faq", label: "FAQ" },
  { href: "#kontakt", label: "Kontakt" },
];

const benefits = prinosy.items.map((i) => ({
  n: i.meta.n ?? "",
  title: i.title,
  body: i.body,
}));

const services = sluzby.items.map((i, idx) => ({
  id: i.meta.id ?? String(idx),
  title: i.title,
  tag: i.meta.tag ?? "",
  body: i.body,
  price: i.meta.price ?? "",
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

  useEffect(() => {
    const el = zenamuRef.current;
    if (!el) return;
    el.setAttribute("calendar-id", "96c7a0ca48777e9a7b02404c0386a246");
    el.setAttribute("data-config", '{"showTitle": true}');

    const src = "https://zenamu.com/calendar/workshops.js";
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);
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
            Rezervovat sezení
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-10 lg:py-32">
          <div className="flex flex-col justify-center">
            <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-brown/30 bg-cream px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-brown-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-brown" />
              Vědomé dýchání · Praha
            </span>
            <h1 className="font-serif text-5xl leading-[1.05] text-brown-deep sm:text-6xl lg:text-7xl">
              Objevte sílu <em className="italic text-brown">vědomého</em> dechu
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Individuální breathwork sezení, skupinové dechové kruhy a workshopy v bezpečné
              atmosféře.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#rezervace"
                className="rounded-full bg-brown px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-brown-deep hover:shadow-lg"
              >
                Prohlédnout termíny
              </a>
              <a
                href="#breathwork"
                className="rounded-full border border-brown/40 px-7 py-3.5 text-sm font-medium text-brown-deep transition-colors hover:bg-rose/60"
              >
                Co je Breathwork?
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-rose/50 blur-2xl" />
            <img
              src={heroImg}
              width={1600}
              height={1100}
              alt="Žena při meditačním dechovém cvičení"
              className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-xl"
            />
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-card px-5 py-4 shadow-lg sm:block">
              <p className="font-serif text-2xl text-brown-deep">200+</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Sezení a kruhů
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
              width={1000}
              height={1200}
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
          <div className="mx-auto max-w-2xl text-center">
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
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {benefits.map((b) => (
              <article
                key={b.n}
                className="group rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-brown/40 hover:shadow-lg"
              >
                <div className="mb-6 font-serif text-sm text-brown">{b.n}</div>
                <h3 className="font-serif text-2xl leading-snug text-brown-deep">{b.title}</h3>
                <div className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  <Prose blocks={b.body} />
                </div>
              </article>
            ))}
          </div>
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
            <div className="rounded-3xl bg-card p-10 shadow-sm">
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
      </section>

      {/* Reservation / Zenamu */}
      <section id="rezervace" className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-brown">
              Kalendář & Rezervace
            </span>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-brown-deep sm:text-5xl">
              Rezervujte si své sezení
            </h2>
            <p className="mt-5 text-muted-foreground">
              Vyberte si vyhovující termín v rezervačním kalendáři níže.
            </p>
          </div>

          <div className="mt-14 overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-8">
            <div ref={zenamuRef} id="zenamu-workshops" />
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Rezervace probíhá zabezpečeně přes Zenamu · potvrzení obdržíte e-mailem
          </p>
        </div>
      </section>

      {/* HeroHero Community */}
      <section className="border-t border-border/60 bg-brown-deep text-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
          <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-cream/60">
                Členská sekce
              </span>
              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                Chcete pracovat s dechem i doma?
              </h2>
              <p className="mt-5 max-w-xl text-cream/70">
                Vstupte do naší online členské sekce na HeroHero. Audio nahrávky dechových praxí,
                vedené meditace a průvodce pro každodenní rituál.
              </p>
            </div>
            <div className="flex md:justify-end">
              <a
                href="#"
                className="rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-brown-deep transition-all hover:bg-rose"
              >
                Vstoupit do členské sekce (HeroHero) →
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
                <div key={f.q} className="overflow-hidden rounded-2xl border border-border bg-card">
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

      {/* Footer / Contact */}
      <footer id="kontakt" className="border-t border-border/60 bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
          <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
            <div>
              <a href="#top" className="font-serif text-3xl tracking-tight text-brown-deep">
                dech<span className="text-brown">.</span>ritual
              </a>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Vědomé dýchání jako každodenní rituál klidu, síly a přítomnosti.
              </p>
              <p className="mt-6 rounded-2xl border border-border bg-card p-4 text-xs text-muted-foreground">
                Platby probíhají v hotovosti nebo QR kódem na místě.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brown">Kontakt</p>
              <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                <li>Lucie Vaňková</li>
                <li>
                  <a href="mailto:ahoj@dechritual.cz" className="hover:text-brown-deep">
                    ahoj@dechritual.cz
                  </a>
                </li>
                <li>
                  <a href="tel:+420777123456" className="hover:text-brown-deep">
                    +420 777 123 456
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brown">Sledujte</p>
              <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                <li>
                  <a href="https://instagram.com/dech.ritual" className="hover:text-brown-deep">
                    Instagram — @dech.ritual
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brown-deep">
                    HeroHero — členská sekce
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} dech.ritual · Lucie Vaňková</p>
            <p>Vytvořeno s klidem a záměrem.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
