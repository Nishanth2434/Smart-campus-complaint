import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, BellRing, CheckCircle2, ClipboardList, ImagePlus, QrCode } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/lib/portal-data";
import campusMaintenance from "@/assets/campus-maintenance.jpg";
import campusReport from "@/assets/campus-report.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Campus Complaint Portal — Report & Track Campus Issues" },
      {
        name: "description",
        content:
          "Submit campus complaints with photos, pick a category, and follow status from Pending to Resolved.",
      },
      { property: "og:title", content: "Smart Campus Complaint Portal" },
      {
        property: "og:description",
        content: "Submit campus complaints with photos and track them to resolution.",
      },
    ],
  }),
  component: Index,
});

const steps = [
  { title: "Submit", text: "Log in, pick a category, add photos and describe the issue." },
  { title: "Assign", text: "Admin reviews and routes it to the responsible department." },
  { title: "Resolve", text: "Staff fix the issue and update the complaint status." },
  { title: "Feedback", text: "You get notified and can rate how it was handled." },
];

const features = [
  { icon: ClipboardList, title: "Category-based reporting", text: "Nine campus categories so the right team gets it first time." },
  { icon: ImagePlus, title: "Photo evidence", text: "Attach images so staff can see the problem before arriving." },
  { icon: BellRing, title: "Status notifications", text: "Know the moment a complaint moves to In Progress or Resolved." },
  { icon: BarChart3, title: "Analytics dashboard", text: "Live counts, resolution times and category hotspots." },
  { icon: QrCode, title: "QR spot reporting", text: "Scan a QR at any location to pre-fill the complaint form." },
  { icon: CheckCircle2, title: "Anonymous option", text: "Raise sensitive concerns without revealing your identity." },
];

const activity = [
  { id: "CMP-1042", title: "Projector not working — Room B-204", status: "In Progress", tone: "bg-warning" },
  { id: "CMP-1041", title: "No water on 2nd floor washroom", status: "Pending", tone: "bg-secondary" },
  { id: "CMP-1038", title: "Wi-Fi dead zone near library", status: "Resolved", tone: "bg-primary" },
];

function Index() {
  const topCategories = categories.slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Hero tile */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-secondary p-8 md:col-span-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="relative z-10 flex-1">
            <Badge variant="outline" className="mb-5 border-primary/30 bg-card/70 text-primary">
              Campus issue management
            </Badge>
            <h1 className="text-4xl font-extrabold leading-[1.1] text-primary md:text-5xl lg:text-6xl">
              Empowering your
              <br />
              campus experience.
            </h1>
            <p className="mt-6 max-w-md text-lg font-medium text-foreground/75">
              The bridge between student voices and administrative excellence. Submit, track and
              resolve campus problems in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-2xl px-8 py-6 text-base font-bold">
                <Link to="/submit">
                  Start complaint <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-2xl border-2 border-primary px-8 py-6 text-base font-bold text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Link to="/about">How it works</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative z-10 w-full md:w-5/12">
            <Carousel 
              className="w-full rounded-2xl overflow-hidden shadow-xl" 
              opts={{ loop: true }}
              plugins={[Autoplay({ delay: 3500 })]}
            >
              <CarouselContent>
                <CarouselItem>
                  <img src="/hero_slide_1.jpg" alt="Modern university campus" className="aspect-square md:aspect-[4/5] object-cover rounded-2xl w-full" />
                </CarouselItem>
                <CarouselItem>
                  <img src="/hero_slide_2.jpg" alt="Students studying in a bright modern library" className="aspect-square md:aspect-[4/5] object-cover rounded-2xl w-full" />
                </CarouselItem>
                <CarouselItem>
                  <img src="/hero_slide_3.jpg" alt="Smart interactive classroom" className="aspect-square md:aspect-[4/5] object-cover rounded-2xl w-full" />
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>

          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
        </section>

        {/* Stats tiles */}
        <div className="grid grid-cols-1 gap-6 md:col-span-4">
          <div className="flex flex-col justify-between rounded-[2rem] bg-primary p-8 text-primary-foreground">
            <span className="text-sm font-bold uppercase tracking-widest opacity-80">
              Resolution rate
            </span>
            <div className="mt-4">
              <span className="text-6xl font-extrabold">92%</span>
              <p className="mt-2 opacity-90">Of complaints closed within 72 hours.</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-[2rem] border border-border bg-card p-8">
            <div>
              <p className="text-3xl font-extrabold text-primary">18h</p>
              <p className="text-sm font-semibold text-muted-foreground">Avg. response</p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            </span>
          </div>
        </div>

        {/* Live feed */}
        <section className="self-start rounded-[2.5rem] border border-border bg-card p-8 md:col-span-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-primary">Live feed</h2>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
              Active now
            </span>
          </div>
          <div className="space-y-6">
            {activity.map((a) => (
              <div key={a.id} className="flex gap-4">
                <span className={`h-12 w-1.5 shrink-0 rounded-full ${a.tone}`} />
                <div className="min-w-0">
                  <p className="font-bold text-foreground">{a.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {a.status} • {a.id}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Button asChild variant="link" className="mt-6 px-0 font-bold text-primary">
            <Link to="/track">Track a complaint →</Link>
          </Button>
        </section>

        {/* Categories */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-8 md:grid-cols-3">
          {topCategories.map((c) => (
            <Link
              key={c.id}
              to="/submit"
              className="group rounded-[2rem] border border-primary/20 bg-primary/5 p-6 transition-all hover:bg-primary hover:shadow-[var(--shadow-soft)]"
            >
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary">
                <c.icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold text-primary group-hover:text-primary-foreground">
                {c.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground group-hover:text-primary-foreground/80">
                {c.description}
              </p>
            </Link>
          ))}
          <Link
            to="/submit"
            className="flex flex-col justify-between rounded-[2rem] bg-primary p-6 text-primary-foreground"
          >
            <h3 className="text-lg font-bold">And more…</h3>
            <p className="text-sm opacity-80">
              Explore all {categories.length} categories for campus issues.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold">
              Browse all <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          {/* How it works strip */}
          <div className="rounded-[2rem] bg-secondary p-8 sm:col-span-2 md:col-span-3">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-xl font-bold text-primary">How it works</p>
                <p className="font-medium text-foreground/70">
                  Report → Assign → Resolve → Feedback. Simple as that.
                </p>
              </div>
              <div className="flex items-center gap-4">
                {steps.map((s, i) => (
                  <div key={s.title} className="flex items-center gap-4">
                    {i > 0 && <span className="hidden h-px w-8 bg-primary/30 sm:block" />}
                    <span
                      title={s.text}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-card font-bold text-primary"
                    >
                      {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Photos tile */}
        <section className="grid grid-cols-2 gap-4 self-start rounded-[2.5rem] border border-border bg-card p-6 md:col-span-5">
          <img
            src={campusReport}
            alt="Student photographing a broken classroom projector as complaint evidence"
            loading="lazy"
            className="h-44 w-full rounded-[1.5rem] object-cover"
          />
          <img
            src={campusMaintenance}
            alt="Maintenance staff repairing a classroom ceiling light after a complaint"
            loading="lazy"
            className="h-44 w-full rounded-[1.5rem] object-cover"
          />
          <div className="col-span-2">
            <h2 className="text-xl font-extrabold text-primary">See the portal in action</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              From spotting an issue on campus to a resolved ticket.
            </p>
          </div>
        </section>

        {/* Features tile */}
        <section className="rounded-[2.5rem] bg-secondary/60 p-8 md:col-span-7">
          <h2 className="text-xl font-extrabold text-primary">Built-in features</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="rounded-[1.5rem] bg-card p-5">
                <f.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-3 font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA tile */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-primary p-10 text-center text-primary-foreground md:col-span-12">
          <h2 className="text-3xl font-extrabold">Something broken on campus?</h2>
          <p className="mx-auto mt-2 max-w-lg opacity-90">
            It takes under a minute to report. You'll get an ID you can track any time.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="mt-6 rounded-2xl px-8 py-6 text-base font-bold"
          >
            <Link to="/submit">Report an issue</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
