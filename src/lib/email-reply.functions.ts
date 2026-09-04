import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

const Input = z.object({
  email: z.string().min(1),
  tone: z.enum(["formal", "informal", "persuasive"]),
  audience: z.enum(["client", "manager", "team"]),
  senderName: z.string().optional(),
  yourName: z.string().optional(),
});

export const generateReply = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    const audienceGuide = {
      client: "The reader is a customer or business client of the olive company. Be warm, service-oriented, reassuring about their order or enquiry, and protect the company's reputation.",
      manager: "The reader is a manager or senior stakeholder. Be concise, structured, results-focused, and mention next steps and ownership clearly.",
      team: "The reader is an internal colleague or team member. Be collaborative and practical, focus on actions, owners and timelines.",
    }[data.audience];

    const toneGuide = {
      formal: "Formal, professional and polished. Full sentences, courteous salutation and sign-off, no slang or contractions.",
      informal: "Friendly, relaxed and human. Short sentences, light contractions, still respectful and professional.",
      persuasive: "Persuasive and confident. Highlight value and benefits, use positive framing, and end with a clear compelling call to action.",
    }[data.tone];

    const result = streamText({
      model: gateway("google/gemini-3.7-flash"),
      system: [
        "You write email replies on behalf of an olive company (olive oil, table olives and related products).",
        "Every reply MUST: 1) greet the sender by name when known, 2) explicitly acknowledge receipt of their email and briefly restate what it was about, 3) state clearly that a full response or feedback will be provided within 24 hours, 4) close politely with a sign-off.",
        "Never invent prices, stock levels, order numbers or commitments beyond the 24-hour feedback promise.",
        `Tone: ${toneGuide}`,
        `Audience: ${audienceGuide}`,
        `Priority: ${URGENCY_NOTE[urgency]}`,
        "Output only the email itself, starting with a 'Subject:' line, then the body. No commentary, no markdown formatting.",
      ].join("\n"),

      prompt: [
        data.senderName ? `Sender name: ${data.senderName}` : "Sender name: unknown",
        data.yourName ? `Reply signed by: ${data.yourName}` : "Reply signed by: The Team, Olive Company",
        "",
        "Received email:",
        data.email,
      ].join("\n"),
    });

    return { reply: await result.text };
  });
