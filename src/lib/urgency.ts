export type Urgency = "urgent" | "important" | "normal";

const URGENT_WORDS = [
  "urgent",
  "urgently",
  "asap",
  "as soon as possible",
  "immediately",
  "emergency",
  "critical",
  "right away",
  "today",
  "deadline",
  "overdue",
  "final notice",
  "escalate",
  "escalation",
  "complaint",
  "spoiled",
  "contaminated",
  "recall",
  "cancel the order",
];

const IMPORTANT_WORDS = [
  "very important",
  "important",
  "priority",
  "please respond",
  "awaiting your response",
  "follow up",
  "follow-up",
  "reminder",
  "payment",
  "invoice",
  "contract",
  "tomorrow",
  "this week",
  "delay",
  "delayed",
  "shortage",
];

export function detectUrgency(text: string): Urgency {
  const t = text.toLowerCase();
  if (URGENT_WORDS.some((w) => t.includes(w))) return "urgent";
  if (IMPORTANT_WORDS.some((w) => t.includes(w))) return "important";
  return "normal";
}

export const URGENCY_LABEL: Record<Urgency, string> = {
  urgent: "Urgent",
  important: "Very important",
  normal: "Normal",
};

export const URGENCY_NOTE: Record<Urgency, string> = {
  urgent:
    "This email is URGENT. Open by acknowledging the urgency, apologise for any inconvenience, and stress that it is being treated as a priority, with full feedback within 24 hours.",
  important:
    "This email is very important. Acknowledge its importance and confirm it is being handled with priority, with full feedback within 24 hours.",
  normal: "This email is routine. Keep the acknowledgement warm and straightforward.",
};
