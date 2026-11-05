import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ClipboardList } from "lucide-react";
import { categories } from "@/lib/portal-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/category/$categoryId")({
  loader: ({ params }) => {
    const category = categories.find((c) => c.id === params.categoryId);
    if (!category) {
      throw notFound();
    }
    return category;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? 'Category'} Issues — Smart Campus Complaint Portal` },
    ],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const category = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <Button
        asChild
        variant="ghost"
        className="mb-6 -ml-4 font-semibold text-muted-foreground hover:text-foreground"
      >
        <Link to="/categories">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Categories
        </Link>
      </Button>

      <div className="overflow-hidden rounded-[2.5rem] bg-card border border-border shadow-sm">
        <div className="h-64 w-full md:h-96 relative">
          <img
            src={`/category_${category.id}.jpg`}
            alt={category.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          <div className="absolute bottom-8 left-8 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <category.icon className="h-8 w-8" />
            </span>
            <h1 className="text-4xl font-extrabold text-foreground drop-shadow-md md:text-5xl">
              {category.name}
            </h1>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 mb-4">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-sm font-bold text-primary uppercase tracking-widest">
                Category Overview
              </span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Understanding {category.name} Issues
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {category.description}
            </p>
            <p className="mt-4 text-base text-muted-foreground">
              Use this category to report issues related to {category.name.toLowerCase()}. By
              providing detailed information and photo evidence, our campus management team can
              dispatch the right staff to resolve the problem as quickly as possible.
            </p>

            <div className="mt-12 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-2xl px-8 py-6 text-base font-bold shadow-lg"
              >
                <Link to="/submit" search={{ category: category.id }}>
                  <ClipboardList className="mr-2 h-5 w-5" /> Report {category.name} Issue
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
