import {
  Armchair,
  BookOpen,
  Bus,
  Droplets,
  Home,
  Lightbulb,
  Lock,
  Sparkles,
  Wifi,
  type LucideIcon,
} from "lucide-react";

export type Category = {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
};

export const categories: Category[] = [
  {
    id: "classroom",
    name: "Classroom",
    icon: Armchair,
    description: "Broken furniture, projectors, boards or AC.",
  },
  {
    id: "electrical",
    name: "Electrical",
    icon: Lightbulb,
    description: "Faulty lights, fans, sockets and wiring.",
  },
  {
    id: "water",
    name: "Water Supply",
    icon: Droplets,
    description: "Leaks, no supply or unclean drinking water.",
  },
  {
    id: "cleanliness",
    name: "Cleanliness",
    icon: Sparkles,
    description: "Washrooms, corridors and waste collection.",
  },
  {
    id: "wifi",
    name: "Wi-Fi / Internet",
    icon: Wifi,
    description: "Dead zones, slow speed or login failures.",
  },
  {
    id: "transport",
    name: "Transport",
    icon: Bus,
    description: "Bus delays, routes and driver conduct.",
  },
  {
    id: "hostel",
    name: "Hostel",
    icon: Home,
    description: "Rooms, mess food, laundry and maintenance.",
  },
  {
    id: "library",
    name: "Library",
    icon: BookOpen,
    description: "Book availability, seating and noise.",
  },
  {
    id: "security",
    name: "Security",
    icon: Lock,
    description: "Lighting, access control and safety concerns.",
  },
];

export type ComplaintStatus = "Pending" | "In Progress" | "Resolved";

export type Complaint = {
  id: string;
  title: string;
  category: string;
  location: string;
  status: ComplaintStatus;
  submitted: string;
  assignedTo: string;
  priority: "Low" | "Medium" | "High";
  reportedBy: string;
  description: string;
  photos: string[];
};

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=60`;

export const complaints: Complaint[] = [
  {
    id: "CMP-1042",
    title: "Projector not turning on in Room B-204",
    category: "Classroom",
    location: "Block B",
    status: "In Progress",
    submitted: "2026-07-22",
    assignedTo: "Maintenance Team",
    priority: "Medium",
    reportedBy: "Aarav Sharma (21CS045)",
    description:
      "The ceiling projector in B-204 does not power on. The indicator light blinks red and the HDMI port seems loose. Two lectures were disrupted this week.",
    photos: [photo("photo-1517048676732-d65bc937f952"), photo("photo-1524178232363-1fb2b075b655")],
  },
  {
    id: "CMP-1041",
    title: "No water in second floor washroom",
    category: "Water Supply",
    location: "Main Building",
    status: "Pending",
    submitted: "2026-07-22",
    assignedTo: "Unassigned",
    priority: "High",
    reportedBy: "Anonymous",
    description:
      "There has been no water supply in the second floor washroom since Monday morning. The tap runs dry and the flush tanks are empty.",
    photos: [photo("photo-1584622650111-993a426fbf0a")],
  },
  {
    id: "CMP-1038",
    title: "Wi-Fi dead zone near library entrance",
    category: "Wi-Fi / Internet",
    location: "Library",
    status: "Resolved",
    submitted: "2026-07-19",
    assignedTo: "IT Support",
    priority: "Low",
    reportedBy: "Priya Nair (22EC012)",
    description:
      "Campus Wi-Fi drops completely within about ten metres of the library entrance. Reconnecting shows an authentication timeout.",
    photos: [photo("photo-1521737604893-d14cc237f11d")],
  },
  {
    id: "CMP-1035",
    title: "Corridor lights flickering after 7 PM",
    category: "Electrical",
    location: "Hostel A",
    status: "In Progress",
    submitted: "2026-07-18",
    assignedTo: "Electrical Dept.",
    priority: "Medium",
    reportedBy: "Rohit Verma (20ME103)",
    description:
      "Tube lights in the first floor corridor flicker heavily every evening and two of them are already dead, making the stairs unsafe.",
    photos: [photo("photo-1513506003901-1e6a229e2d15")],
  },
  {
    id: "CMP-1030",
    title: "Campus bus route 4 consistently late",
    category: "Transport",
    location: "Gate 2",
    status: "Resolved",
    submitted: "2026-07-15",
    assignedTo: "Transport Office",
    priority: "Low",
    reportedBy: "Sneha Iyer (21BT077)",
    description:
      "Route 4 arrives 20-30 minutes behind schedule almost every morning, causing students to miss the first lecture.",
    photos: [],
  },
  {
    id: "CMP-1027",
    title: "Garbage not collected behind canteen",
    category: "Cleanliness",
    location: "Canteen",
    status: "Pending",
    submitted: "2026-07-14",
    assignedTo: "Unassigned",
    priority: "High",
    reportedBy: "Anonymous",
    description:
      "Waste bins behind the canteen have not been emptied for four days. There is a strong smell and stray animals around the area.",
    photos: [photo("photo-1532996122724-e3c354a0b15b"), photo("photo-1595278069441-2cf29f8005a4")],
  },
];

export const statusStyles: Record<ComplaintStatus, string> = {
  Pending: "bg-warning/15 text-warning-foreground border-warning/30",
  "In Progress": "bg-info/15 text-info border-info/30",
  Resolved: "bg-success/15 text-success border-success/30",
};
