import { Link } from "@tanstack/react-router";
import { Home, FolderOpen, PlusCircle, Search } from "lucide-react";

export function MobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background/80 px-2 py-3 backdrop-blur-md md:hidden pb-safe">
      <Link
        to="/"
        activeOptions={{ exact: true }}
        activeProps={{ className: "text-primary bg-primary/10" }}
        className="flex flex-col items-center justify-center rounded-xl p-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Home className="mb-1 h-5 w-5" />
        <span className="text-[10px] font-semibold">Home</span>
      </Link>
      <Link
        to="/categories"
        activeProps={{ className: "text-primary bg-primary/10" }}
        className="flex flex-col items-center justify-center rounded-xl p-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <FolderOpen className="mb-1 h-5 w-5" />
        <span className="text-[10px] font-semibold">Categories</span>
      </Link>
      <Link
        to="/submit"
        activeProps={{ className: "text-primary bg-primary/10" }}
        className="flex flex-col items-center justify-center rounded-xl p-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <PlusCircle className="mb-1 h-5 w-5" />
        <span className="text-[10px] font-semibold">Submit</span>
      </Link>
      <Link
        to="/track"
        activeProps={{ className: "text-primary bg-primary/10" }}
        className="flex flex-col items-center justify-center rounded-xl p-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Search className="mb-1 h-5 w-5" />
        <span className="text-[10px] font-semibold">Track</span>
      </Link>
    </div>
  );
}
