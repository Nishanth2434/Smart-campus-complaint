import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/submit", label: "Submit Complaint" },
  { to: "/track", label: "Track Status" },
  { to: "/support", label: "Support" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Smart Campus Complaint Portal logo"
            className="h-16 w-16 shrink-0 object-contain mix-blend-multiply"
          />
          <span className="font-display text-sm font-extrabold leading-tight text-primary sm:text-base">
            Smart Campus
            <span className="block text-xs font-normal text-muted-foreground">
              Complaint Portal
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-secondary text-primary" }}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden rounded-xl font-semibold sm:inline-flex">
            <Link to="/submit">Report an issue</Link>
          </Button>
          {session ? (
            <Button
              variant="ghost"
              size="sm"
              className="hidden rounded-xl font-semibold sm:inline-flex"
              onClick={handleSignOut}
            >
              <LogOut className="mr-1 h-4 w-4" /> Sign out
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden rounded-xl font-semibold sm:inline-flex"
            >
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
