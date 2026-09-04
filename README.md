# Olive Co. Smart Email Reply Generator

A small full-stack app that writes polished replies to emails received by an olive oil and table-olives business. Paste the incoming message, choose a tone and audience, and get a ready-to-send response that acknowledges the email and promises feedback within 24 hours.

## What it does

- **Understands urgency** — scans the incoming email for urgent or important language and highlights the priority visually.
- **Adapts tone** — choose between formal, informal, or persuasive replies.
- **Targets the audience** — replies are tuned for clients, managers, or internal team members.
- **Stays safe** — never invents prices, stock levels, order numbers, or commitments beyond the 24-hour feedback promise.
- **One-click copy** — copy the generated reply straight to your clipboard.

## Tech stack

- [TanStack Start](https://tanstack.com/start) — full-stack React framework
- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com) — olive-and-cream themed design tokens
- [Lovable AI Gateway](https://docs.lovable.dev/features/cloud) — `google/gemini-3.7-flash` for reply generation

## Running locally

```sh
git clone <repository-url>
cd <repository-name>
bun install
bun run dev
```

The dev server starts at `http://localhost:8080`.

## Environment variables

The app needs a Lovable API key to call the AI Gateway. On Lovable Cloud projects this is injected automatically; locally you can set:

```sh
LOVABLE_API_KEY=<your-lovable-api-key>
```

## Project structure

```text
src/
  lib/
    ai-gateway.server.ts      # Lovable AI Gateway provider setup
    email-reply.functions.ts  # Server function that generates replies
    urgency.ts                # Urgency detection and labels
  routes/
    index.tsx                 # Home page generator UI
    __root.tsx                # Root layout
```

## How it works

1. The user pastes the received email and picks a tone and audience.
2. `detectUrgency` classifies the message as urgent, very important, or normal.
3. The UI updates the card color to match the priority.
4. A server function sends a structured prompt to the Lovable AI Gateway.
5. The model returns a reply with a subject line and body, which the user can copy.

## License

This project is built and owned by its creator through Lovable.
