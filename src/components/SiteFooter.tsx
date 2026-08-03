import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <img
            src="/logo.png"
            alt="Smart Campus Complaint Portal logo"
            className="h-16 w-16 object-contain mix-blend-multiply"
          />
          <h3 className="mt-3 text-sm font-semibold">Smart Campus Complaint Portal</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            One place for students, faculty and staff to report campus issues and follow them
            through to resolution.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Portal</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/submit" className="hover:text-foreground">
                Submit a complaint
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-foreground">
                Track status
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Help</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-foreground">
                About the portal
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-foreground">
                Support &amp; FAQs
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="hover:text-foreground">
                Staff / admin login
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> helpdesk@campus.edu
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +91 90000 12345
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Admin Block, Room 12
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Smart Campus Complaint Portal. Demo frontend.
      </div>
    </footer>
  );
}
