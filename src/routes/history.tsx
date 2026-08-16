import { createFileRoute } from "@tanstack/react-router";
import { Trash2, Volume2, Copy } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { clearHistory, useHistory, usePrefs, type HistoryItem } from "@/lib/prefs";
import { speak } from "@/lib/speech";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Your recent SenseAll conversations" },
      {
        name: "description",
        content:
          "Review recent voice, ISL, Braille and haptic interactions. Everything stays on your device and can be cleared at any time.",
      },
      { property: "og:title", content: "History — Your recent SenseAll conversations" },
      {
        property: "og:description",
        content: "Recent interactions stored only on your device, clearable at any time.",
      },
    ],
  }),
  component: HistoryPage,
});

function groupByDay(items: HistoryItem[]) {
  const groups = new Map<string, HistoryItem[]>();
  for (const item of items) {
    const date = new Date(item.at);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const key = isToday ? "Today" : date.toLocaleDateString(undefined, { dateStyle: "medium" });
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return [...groups.entries()];
}

function HistoryPage() {
  const items = useHistory();
  const { prefs } = usePrefs();
  const groups = groupByDay(items);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="History"
        title="Your recent interactions."
        description="Stored only in this browser. Nothing is uploaded, and you can erase everything with one action."
      />

      {items.length === 0 ? (
        <p className="surface-panel p-6 text-lg text-muted-foreground">
          No interactions yet. Use Voice, ISL or Braille and your messages will collect here.
        </p>
      ) : (
        <>
          <Button
            variant="destructive"
            size="lg"
            className="min-h-14"
            onClick={() => {
              clearHistory();
              toast.success("History cleared from this device.");
            }}
          >
            <Trash2 aria-hidden="true" />
            Clear all history
          </Button>

          {groups.map(([day, dayItems]) => (
            <section key={day} aria-labelledby={`day-${day}`}>
              <h2 id={`day-${day}`} className="text-2xl font-semibold">
                {day}
              </h2>
              <ul className="mt-4 space-y-4">
                {dayItems.map((item) => (
                  <li key={item.id} className="surface-panel p-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-accent px-3 py-1 text-base font-semibold uppercase text-accent-foreground">
                        {item.kind}
                      </span>
                      <span className="text-base text-muted-foreground">
                        {new Date(item.at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="mt-3 text-xl">{item.text}</p>
                    {item.detail && (
                      <p className="mt-1 break-words text-lg text-muted-foreground">{item.detail}</p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        size="lg"
                        className="min-h-14"
                        onClick={() => speak(item.text, prefs.speechRate)}
                      >
                        <Volume2 aria-hidden="true" />
                        Speak
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="min-h-14"
                        onClick={async () => {
                          await navigator.clipboard.writeText(item.text);
                          toast.success("Copied to your clipboard.");
                        }}
                      >
                        <Copy aria-hidden="true" />
                        Copy
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
