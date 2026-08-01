import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/portal-data";
import { Button } from "@/components/ui/button";
import { Typewriter } from "@/components/ui/typewriter";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [{ title: "All Categories — Smart Campus Complaint Portal" }],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            <Typewriter text="Issue Categories" speed={50} />
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Explore all available categories for reporting campus issues.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/category/${c.id}`}
            className="group overflow-hidden rounded-[2rem] border border-border bg-card transition-all hover:shadow-[var(--shadow-soft)]"
          >
            <img
              src={`/category_${c.id}.jpg`}
              alt={c.name}
              className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="p-6">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                <c.icon className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {c.name}
              </h3>
              <p className="mt-2 text-muted-foreground">{c.description}</p>
              <div className="mt-4 flex items-center font-semibold text-primary">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
