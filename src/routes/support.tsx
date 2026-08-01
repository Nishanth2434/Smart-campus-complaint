import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support & FAQs — Smart Campus Complaint Portal" },
      {
        name: "description",
        content:
          "Get help using the campus complaint portal: FAQs on status, response times, anonymity and contacting the help desk.",
      },
      { property: "og:title", content: "Support & FAQs — Campus Complaint Portal" },
      {
        property: "og:description",
        content: "FAQs on complaint status, response times and anonymity, plus help desk contacts.",
      },
    ],
  }),
  component: SupportPage,
});

const faqs = [
  ["How long does it take to resolve a complaint?", "Most complaints get a first response within 24 hours. Electrical and water issues are prioritised and usually resolved within 48 hours."],
  ["What do the statuses mean?", "Pending means it hasn't been assigned yet. In Progress means a department is working on it. Resolved means the issue is closed and awaiting your feedback."],
  ["Can I report something anonymously?", "Yes. Tick the anonymous option on the submit form and your name won't be shown to the staff handling the complaint."],
  ["Can I attach photos?", "Yes — one image per complaint, PNG or JPG up to 5 MB. Photos help staff arrive prepared."],
  ["I lost my complaint ID. What now?", "Search on the Track page by title or category, or contact the help desk with your roll number."],
];

function SupportPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Support</h1>
      <p className="mt-3 text-muted-foreground">
        Answers to common questions, and a direct line to the campus help desk.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Mail, label: "Email", value: "helpdesk@campus.edu" },
          { icon: Phone, label: "Phone", value: "+91 90000 12345" },
          { icon: MapPin, label: "Help desk", value: "Admin Block, Room 12" },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-5">
            <c.icon className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">{c.label}</p>
            <p className="font-medium">{c.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
      <Accordion type="single" collapsible className="mt-4">
        {faqs.map(([q, a]) => (
          <AccordionItem key={q} value={q}>
            <AccordionTrigger className="text-left">{q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Card className="mt-14">
        <CardHeader>
          <CardTitle className="text-lg">Still need help?</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Message sent", { description: "Demo only — no message was delivered." });
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="s-name">Name</Label>
                <Input id="s-name" placeholder="Your name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-email">Email</Label>
                <Input id="s-email" type="email" placeholder="you@campus.edu" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-msg">Message</Label>
              <Textarea id="s-msg" rows={4} placeholder="How can we help?" required />
            </div>
            <Button type="submit">
              <Send className="mr-1 h-4 w-4" /> Send message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}