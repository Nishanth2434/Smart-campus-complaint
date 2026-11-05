import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import StatusBadge from "../components/StatusBadge";
import Photo from "../components/Photo";
import { Reveal, RevealGroup, RevealItem } from "../components/Reveal";
import { photos } from "../data/photos";
import {
  categories,
  features,
  howItWorksSteps,
  liveFeed,
  stats,
} from "../data/mockData";
import { categoryIcons, featureIcons, IconArrowRight } from "../components/icons";

const Hero3D = lazy(() => import("../components/Hero3D"));

function Hero3DFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-64 w-64 animate-pulse rounded-3xl border-2 border-ink-950/10 bg-card sm:h-80 sm:w-80" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b-2 border-ink-950 bg-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink-950 bg-card px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-ink-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Campus issue management
            </span>
            <h1 className="mt-6 text-balance font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink-950 sm:text-6xl lg:text-7xl">
              Empowering your <span className="italic text-brand-600">campus</span> experience.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-700 sm:text-lg">
              The bridge between student voices and administrative excellence. Submit,
              track and resolve campus problems in one place.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/submit"
                className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-ink-950 bg-brand-500 px-6 py-3.5 text-sm font-bold text-ink-950 shadow-[4px_4px_0_0_#14110d] transition-all hover:-translate-y-0.5 hover:shadow-[5px_6px_0_0_#14110d]"
              >
                Start complaint
                <IconArrowRight />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-ink-950 bg-transparent px-6 py-3.5 text-sm font-bold text-ink-950 transition-colors hover:bg-ink-950 hover:text-paper"
              >
                How it works
              </a>
            </div>

            <div className="mt-12 grid max-w-lg grid-cols-2 gap-5">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`relative rounded-lg border-2 border-ink-950 bg-card p-5 ${i === 0 ? "-rotate-1" : "rotate-1"}`}
                >
                  <span className="absolute -left-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-paper ring-2 ring-ink-950" />
                  <span className="absolute -right-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-paper ring-2 ring-ink-950" />
                  <p className="font-display text-3xl font-bold text-brand-600">{s.value}</p>
                  <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-wide text-ink-950">
                    {s.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex min-h-[360px] items-center justify-center sm:min-h-[460px]">
            <div className="absolute inset-4 rounded-3xl border-2 border-dashed border-ink-950/15 sm:inset-8" />
            <Suspense fallback={<Hero3DFallback />}>
              <Hero3D />
            </Suspense>
          </div>
        </div>

        <div className="hazard-stripe h-2 w-full" />
      </section>

      {/* LIVE FEED */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border-2 border-ink-950 bg-card shadow-[6px_6px_0_0_#14110d]">
            <div className="flex items-center justify-between border-b-2 border-ink-950 bg-ink-950 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold uppercase tracking-wide text-paper">Live feed</span>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
                </span>
                <span className="font-mono text-xs text-paper/50">Active now</span>
              </div>
              <Link
                to="/track"
                className="hidden items-center gap-1 font-mono text-xs font-semibold uppercase tracking-wide text-brand-500 hover:text-brand-400 sm:inline-flex"
              >
                Track a complaint <IconArrowRight />
              </Link>
            </div>

            <ul className="divide-y divide-ink-950/10">
              {liveFeed.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-col gap-2 px-6 py-4 transition-colors hover:bg-brand-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="text-sm font-medium text-ink-950">{c.title}</p>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={c.status} />
                    <span className="font-mono text-xs text-ink-400">{c.id}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t-2 border-ink-950 px-6 py-4 sm:hidden">
              <Link to="/track" className="inline-flex items-center gap-1 font-mono text-xs font-semibold uppercase tracking-wide text-brand-600">
                Track a complaint <IconArrowRight />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CATEGORY GRID */}
      <section className="border-y-2 border-ink-950 bg-surface-alt py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-ink-950 sm:text-4xl">Report by category</h2>
            <p className="mt-3 text-ink-500">
              Pick the closest match so your complaint reaches the right team instantly.
            </p>
          </Reveal>

          <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => {
              const Icon = categoryIcons[c.icon];
              const isMore = c.id === "more";
              return (
                <RevealItem key={c.id}>
                  <motion.div whileHover={{ y: -4, rotate: -0.6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                    <Link
                      to="/submit"
                      className="group flex h-full flex-col gap-4 rounded-xl border-2 border-ink-950 bg-card p-6 shadow-[4px_4px_0_0_#14110d] transition-shadow hover:shadow-[6px_6px_0_0_#ff5a1f]"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-ink-950 bg-brand-100 text-ink-950 transition-colors group-hover:bg-brand-500">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-ink-950">{c.name}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-ink-500">{c.description}</p>
                      </div>
                      {isMore && (
                        <span className="mt-auto inline-flex items-center gap-1 font-mono text-xs font-semibold uppercase tracking-wide text-brand-600">
                          Browse all <IconArrowRight />
                        </span>
                      )}
                    </Link>
                  </motion.div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
              Report → Assign → Resolve → Feedback.
              <br className="hidden sm:block" /> Simple as that.
            </h2>
          </Reveal>

          <RevealGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorksSteps.map((s) => (
              <RevealItem key={s.step}>
                <div className="relative h-full rounded-xl border-2 border-ink-950 bg-card p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink-950 bg-brand-500 font-display text-sm font-bold text-ink-950">
                    {s.step}
                  </span>
                  <h3 className="mt-4 text-base font-bold text-ink-950">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{s.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <Reveal className="order-2 lg:order-1">
              <span className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-600">
                See the portal in action
              </span>
              <h3 className="mt-2 text-balance font-display text-2xl font-semibold text-ink-950 sm:text-3xl">
                From spotting an issue on campus to a resolved ticket.
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-500">
                Every report moves through a transparent pipeline — students see updates in
                real time, and maintenance teams get exactly the details they need.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="order-1 lg:order-2">
              <div className="relative mx-auto max-w-md">
                <Photo
                  src={photos.lectureHall.url}
                  alt={photos.lectureHall.alt}
                  className="aspect-[4/3.2] -rotate-2 rounded-2xl border-2 border-ink-950 shadow-[6px_6px_0_0_#14110d]"
                />
                <Photo
                  src={photos.electricianRepair.url}
                  alt={photos.electricianRepair.alt}
                  className="absolute -bottom-8 -right-6 aspect-square w-2/5 rotate-3 rounded-xl border-2 border-ink-950 shadow-[5px_5px_0_0_#ff5a1f] sm:-right-10"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-y-2 border-ink-950 bg-surface-alt py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
              Built for how campuses actually work
            </h2>
            <p className="mt-3 text-ink-500">Everything students and staff need, nothing they don't.</p>
          </Reveal>

          <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = featureIcons[f.icon];
              return (
                <RevealItem key={f.title}>
                  <div className="h-full rounded-xl border-2 border-ink-950 bg-card p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-ink-950 bg-paper text-brand-600">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-base font-bold text-ink-950">{f.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{f.description}</p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="relative overflow-hidden bg-ink-950 py-16 sm:py-20">
        <div className="hazard-stripe absolute inset-x-0 top-0 h-2" />
        <div className="hazard-stripe absolute inset-x-0 bottom-0 h-2" />
        <Reveal className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-balance font-display text-3xl font-semibold text-paper sm:text-4xl">
            Something broken on campus?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-paper/60 sm:text-base">
            It takes under a minute to report. You'll get an ID you can track any time.
          </p>
          <Link
            to="/submit"
            className="mt-8 inline-flex items-center gap-2 rounded-md border-2 border-ink-950 bg-brand-500 px-7 py-3.5 text-sm font-bold text-ink-950 shadow-[4px_4px_0_0_#ff5a1f] transition-all hover:-translate-y-0.5 hover:shadow-[5px_6px_0_0_#ff5a1f]"
          >
            Report an issue
            <IconArrowRight />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
