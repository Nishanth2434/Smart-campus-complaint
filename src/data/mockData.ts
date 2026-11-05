export type ComplaintStatus = "Pending" | "In Progress" | "Resolved";

export interface Complaint {
  id: string;
  title: string;
  status: ComplaintStatus;
  category: string;
  location?: string;
  submittedAt: string;
}

export const liveFeed: Complaint[] = [
  {
    id: "CMP-1042",
    title: "Projector not working — Room B-204",
    status: "In Progress",
    category: "Classroom",
    submittedAt: "2026-07-28",
  },
  {
    id: "CMP-1041",
    title: "No water on 2nd floor washroom",
    status: "Pending",
    category: "Water Supply",
    submittedAt: "2026-07-28",
  },
  {
    id: "CMP-1038",
    title: "Wi-Fi dead zone near library",
    status: "Resolved",
    category: "Wi-Fi / Internet",
    submittedAt: "2026-07-26",
  },
];

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: "classroom",
    name: "Classroom",
    description: "Broken furniture, projectors, boards or AC.",
    icon: "chalkboard",
  },
  {
    id: "electrical",
    name: "Electrical",
    description: "Faulty lights, fans, sockets and wiring.",
    icon: "bolt",
  },
  {
    id: "water",
    name: "Water Supply",
    description: "Leaks, no supply or unclean drinking water.",
    icon: "droplet",
  },
  {
    id: "cleanliness",
    name: "Cleanliness",
    description: "Washrooms, corridors and waste collection.",
    icon: "sparkles",
  },
  {
    id: "wifi",
    name: "Wi-Fi / Internet",
    description: "Dead zones, slow speed or login failures.",
    icon: "wifi",
  },
  {
    id: "more",
    name: "And more…",
    description: "Explore all 9 categories for campus issues.",
    icon: "grid",
  },
];

export const allCategories: string[] = [
  "Classroom",
  "Electrical",
  "Water Supply",
  "Cleanliness",
  "Wi-Fi / Internet",
  "Furniture",
  "Security & Safety",
  "Transport",
  "Hostel / Accommodation",
];

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export const features: Feature[] = [
  {
    title: "Category-based reporting",
    description: "Nine campus categories so the right team gets it first time.",
    icon: "tag",
  },
  {
    title: "Photo evidence",
    description: "Attach images so staff can see the problem before arriving.",
    icon: "camera",
  },
  {
    title: "Status notifications",
    description: "Know the moment a complaint moves to In Progress or Resolved.",
    icon: "bell",
  },
  {
    title: "Analytics dashboard",
    description: "Live counts, resolution times and category hotspots.",
    icon: "chart",
  },
  {
    title: "QR spot reporting",
    description: "Scan a QR at any location to pre-fill the complaint form.",
    icon: "qrcode",
  },
  {
    title: "Anonymous option",
    description: "Raise sensitive concerns without revealing your identity.",
    icon: "mask",
  },
];

export const howItWorksSteps = [
  {
    step: 1,
    title: "Spot the issue",
    description: "See something broken on campus? Note the location and what's wrong.",
  },
  {
    step: 2,
    title: "Report it",
    description: "Fill a short form with category, description and an optional photo.",
  },
  {
    step: 3,
    title: "We assign it",
    description: "Your complaint is routed to the right maintenance or admin team.",
  },
  {
    step: 4,
    title: "Track to resolution",
    description: "Follow live status updates until the issue is marked Resolved.",
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "How long does it take to resolve a complaint?",
    answer:
      "Most complaints are resolved within 72 hours. Urgent issues like electrical or water hazards are typically actioned within 18 hours.",
  },
  {
    question: "Can I submit a complaint anonymously?",
    answer:
      "Yes. Toggle the anonymous option on the submit form and your identity will not be shared with the maintenance team.",
  },
  {
    question: "How do I track my complaint after submitting?",
    answer:
      "You'll receive a complaint ID (e.g. CMP-1042). Enter it on the Track Status page any time to see its live progress.",
  },
  {
    question: "What categories of issues can I report?",
    answer:
      "Classroom, Electrical, Water Supply, Cleanliness, Wi-Fi/Internet, Furniture, Security & Safety, Transport and Hostel/Accommodation.",
  },
  {
    question: "Who can see my complaint?",
    answer:
      "Only the assigned maintenance/admin team and portal staff can view complaint details. Anonymous complaints hide your identity entirely.",
  },
];

export const mockTrackResult = {
  id: "CMP-1042",
  title: "Projector not working — Room B-204",
  category: "Classroom",
  submittedAt: "2026-07-28",
  currentStatus: "In Progress" as ComplaintStatus,
  timeline: [
    { status: "Pending", date: "28 Jul, 09:14 AM", done: true },
    { status: "In Progress", date: "28 Jul, 02:40 PM", done: true },
    { status: "Resolved", date: "Awaiting update", done: false },
  ],
};

export const stats = [
  {
    value: "92%",
    label: "Resolution rate",
    description: "Of complaints closed within 72 hours.",
  },
  {
    value: "18h",
    label: "Avg. response",
    description: "Time to first status update.",
  },
];
