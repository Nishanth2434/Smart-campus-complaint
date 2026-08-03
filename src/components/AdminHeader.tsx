import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AdminHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onLogin = pathname.startsWith("/admin/login") || pathname === "/admin";
  return (
    <header className="border-b border-border bg-secondary/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 md:h-16 md:flex-row md:items-center md:justify-between md:py-0">
        <Link to="/admin/login" className="flex min-w-0 items-center gap-2">
          <img
            src="/logo.png"
            alt="Smart Campus Complaint Portal logo"
            className="h-12 w-12 shrink-0 object-contain sm:h-16 sm:w-16 mix-blend-multiply"
          />
          <span className="min-w-0 truncate text-sm font-semibold leading-tight sm:text-base">
            Administration
            <span className="block truncate text-xs font-normal text-muted-foreground">
              Campus Complaint Management
            </span>
          </span>
        </Link>
        <div className="-mx-4 flex items-center gap-1 overflow-x-auto px-4 pb-1 md:mx-0 md:gap-2 md:overflow-visible md:px-0 md:pb-0">
          {!onLogin && (
            <>
              <Link
                to="/admin/dashboard"
                activeProps={{ className: "bg-background text-foreground" }}
                className="shrink-0 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/reports"
                activeProps={{ className: "bg-background text-foreground" }}
                className="shrink-0 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Reports
              </Link>
              <Link
                to="/admin/users"
                activeProps={{ className: "bg-background text-foreground" }}
                className="shrink-0 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Users
              </Link>
              <Link
                to="/admin/qr"
                activeProps={{ className: "bg-background text-foreground" }}
                className="shrink-0 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                QR codes
              </Link>
            </>
          )}
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link to="/">
              <LogOut className="mr-1 h-4 w-4" /> {onLogin ? "Back to portal" : "Exit admin"}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
