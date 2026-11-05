import { Link } from "react-router-dom";
import { Reveal, RevealGroup, RevealItem } from "../components/Reveal";
import Photo from "../components/Photo";
import { photos } from "../data/photos";
import { howItWorksSteps, stats } from "../data/mockData";
import { IconArrowRight } from "../components/icons";

export default function About() {
  return (
    <>
      <section className="border-b-2 border-ink-950 bg-paper py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink-950 bg-card px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-ink-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              About the portal
            </span>
            <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.05] text-ink-950 sm:text-5xl">
              Built to close the gap between reporting and repair.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-700 sm:text-lg">
              Smart Campus Complaint Portal gives students, faculty and staff a single,
              transparent place to flag issues around campus — and gives administrators
              the structure to route, act on and close them quickly.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Photo
              src={photos.libraryStudying.url}
              alt={photos.libraryStudying.alt}
              className="aspect-[4/3] rotate-1 rounded-2xl border-2 border-ink-950 shadow-[6px_6px_0_0_#14110d]"
            />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {stats.map((s, i) => (
            <RevealItem key={s.label}>
              <div className={`rounded-xl border-2 border-ink-950 bg-card p-6 ${i === 0 ? "-rotate-1" : "rotate-1"}`}>
                <p className="font-display text-3xl font-bold text-brand-600">{s.value}</p>
                <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-wide text-ink-950">
                  {s.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-500">{s.description}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="border-y-2 border-ink-950 bg-surface-alt py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold text-ink-950 sm:text-3xl">Why we built this</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-700 sm:text-base">
              Before this portal, campus issues were reported through scattered emails,
              hallway conversations and word of mouth — easy to lose, hard to track. We
              built a single pipeline so every report gets a category, an owner and a
              status, from the moment it's submitted to the moment it's resolved.
            </p>
          </Reveal>

          <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorksSteps.map((s) => (
              <RevealItem key={s.step}>
                <div className="h-full rounded-xl border-2 border-ink-950 bg-card p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink-950 bg-brand-500 font-display text-sm font-bold text-ink-950">
                    {s.step}
                  </span>
                  <h3 className="mt-4 text-base font-bold text-ink-950">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{s.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-ink-950 sm:text-3xl">Who it's for</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-700 sm:text-base">
              <li><span className="font-semibold text-ink-950">Students</span> — report issues in classrooms, hostels, washrooms and shared spaces.</li>
              <li><span className="font-semibold text-ink-950">Faculty & staff</span> — flag facility issues affecting teaching or operations.</li>
              <li><span className="font-semibold text-ink-950">Maintenance teams</span> — receive categorized tickets with photo evidence and location.</li>
              <li><span className="font-semibold text-ink-950">Administrators</span> — monitor resolution times and category hotspots.</li>
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-2xl font-semibold text-ink-950 sm:text-3xl">Our commitment</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-700 sm:text-base">
              Every complaint gets a tracked ID, a visible status and a clear owner. We
              aim to acknowledge reports within 18 hours and resolve the majority within
              72 — with full transparency into where things stand at every step.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink-950 py-16 sm:py-20">
        <div className="hazard-stripe absolute inset-x-0 top-0 h-2" />
        <div className="hazard-stripe absolute inset-x-0 bottom-0 h-2" />
        <Reveal className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold text-paper sm:text-4xl">Ready to report something?</h2>
          <Link
            to="/submit"
            className="mt-8 inline-flex items-center gap-2 rounded-md border-2 border-ink-950 bg-brand-500 px-7 py-3.5 text-sm font-bold text-ink-950 shadow-[4px_4px_0_0_#ff5a1f] transition-all hover:-translate-y-0.5 hover:shadow-[5px_6px_0_0_#ff5a1f]"
          >
            Start a complaint
            <IconArrowRight />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
