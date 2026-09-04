import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { generateReply } from "@/lib/email-reply.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Olive Co. Smart Email Reply Generator" },
      {
        name: "description",
        content:
          "Generate formal, informal or persuasive replies to olive company emails, tailored for clients, managers and teams, with a 24-hour feedback promise.",
      },
      { property: "og:title", content: "Olive Co. Smart Email Reply Generator" },
      {
        property: "og:description",
        content:
          "Paste any received email and get a polished reply that acknowledges it and promises feedback within 24 hours.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const tones = ["formal", "informal", "persuasive"] as const;
const audiences = ["client", "manager", "team"] as const;

function Index() {
  const generate = useServerFn(generateReply);
  const [email, setEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [yourName, setYourName] = useState("");
  const [tone, setTone] = useState<(typeof tones)[number]>("formal");
  const [audience, setAudience] = useState<(typeof audiences)[number]>("client");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function onGenerate() {
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    setReply("");
    try {
      const res = await generate({
        data: { email, tone, audience, senderName, yourName },
      });
      setReply(res.reply);
    } catch {
      setError("The reply could not be written just now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm capitalize transition-colors ${
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-muted-foreground hover:border-primary/50"
    }`;

  return (
    <main className="min-h-screen bg-background">
      <header
        className="px-6 py-14 text-center"
        style={{ background: "var(--gradient-olive)" }}
      >
        <p className="text-sm uppercase tracking-[0.3em] text-primary-foreground/80">
          Olive Company
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-primary-foreground sm:text-5xl">
          Smart Email Reply Generator
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85">
          Paste an email you received. Every reply acknowledges the message and promises
          feedback within 24 hours.
        </p>
      </header>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 py-10 md:grid-cols-2">
        <div
          className="rounded-2xl border border-border bg-card p-6"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <h2 className="text-lg font-semibold text-card-foreground">Email received</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Sender's name (optional)"
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              placeholder="Sign off as (optional)"
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <textarea
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            rows={11}
            placeholder="Paste the full email here…"
            className="mt-3 w-full resize-y rounded-lg border border-input bg-background p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />

          <p className="mt-5 text-sm font-medium text-foreground">Tone</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {tones.map((t) => (
              <button key={t} onClick={() => setTone(t)} className={chip(tone === t)}>
                {t}
              </button>
            ))}
          </div>

          <p className="mt-5 text-sm font-medium text-foreground">Who is it for</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {audiences.map((a) => (
              <button
                key={a}
                onClick={() => setAudience(a)}
                className={chip(audience === a)}
              >
                {a}
              </button>
            ))}
          </div>

          <button
            onClick={onGenerate}
            disabled={loading || !email.trim()}
            className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Writing reply…" : "Generate reply"}
          </button>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        </div>

        <div
          className="rounded-2xl border border-border bg-card p-6"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-card-foreground">Suggested reply</h2>
            {reply && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(reply);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary/50"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>

          {reply ? (
            <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-relaxed text-card-foreground">
              {reply}
            </pre>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Your reply will appear here, ready to copy into your inbox.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
