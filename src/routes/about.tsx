import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, GraduationCap, Target, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Smart Campus Complaint Portal" },
      {
        name: "description",
        content:
          "Why the Smart Campus Complaint Portal exists, who it serves, and how complaints flow from report to resolution.",
      },
      { property: "og:title", content: "About the Smart Campus Complaint Portal" },
      {
        property: "og:description",
        content: "Who the portal serves and how complaints move from report to resolution.",
      },
    ],
  }),
  component: AboutPage,
});

const audience = [
  { icon: GraduationCap, title: "Students", text: "Report hostel, classroom, Wi-Fi and transport issues and follow progress." },
  { icon: Users, title: "Faculty & staff", text: "Flag facility problems that interrupt teaching and daily work." },
  { icon: Building2, title: "Administration", text: "See every open issue, assign owners and measure resolution times." },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">About the portal</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Campus complaints usually travel by word of mouth, paper registers or scattered messages — so they get
        lost. This portal replaces that with one transparent record that everybody can see.
      </p>

      <Card className="mt-10">
        <CardContent className="flex gap-4 pt-6">
          <Target className="h-6 w-6 shrink-0 text-primary" />
          <div>
            <h2 className="font-semibold">Our goal</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Make it effortless to report a problem, impossible for it to be forgotten, and easy for the
              administration to prove it was solved.
            </p>
          </div>
        </CardContent>
      </Card>

      <h2 className="mt-14 text-2xl font-semibold tracking-tight">Who it's for</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {audience.map((a) => (
          <div key={a.title} className="rounded-xl border border-border bg-card p-6">
            <a.icon className="h-5 w-5 text-primary" />
            <h3 className="mt-4 font-medium">{a.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{a.text}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 text-2xl font-semibold tracking-tight">The complaint lifecycle</h2>
      <ol className="mt-6 space-y-4 border-l border-border pl-6">
        {[
          ["Student logs in", "Verified campus accounts keep reports accountable — with an anonymous option for sensitive cases."],
          ["Complaint submitted", "Category, location, description and photo evidence in one short form."],
          ["Admin review", "The complaint appears on the dashboard and is assigned to a department."],
          ["Staff resolution", "The responsible team works on it and reports back."],
          ["Closed with feedback", "The student is notified and rates the resolution."],
        ].map(([title, text]) => (
          <li key={title} className="relative">
            <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to="/submit">Report an issue</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/track">Track a complaint</Link>
        </Button>
        <Button asChild size="lg" variant="ghost">
          <Link to="/support">Support &amp; FAQs</Link>
        </Button>
      </div>
    </div>
  );
}