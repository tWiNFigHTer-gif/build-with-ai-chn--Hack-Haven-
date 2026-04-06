"use client";

import { useMemo, useState } from "react";
import { ClipboardList, Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useLearnSyncContext } from "./LearnSyncProvider";

type ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
};

type SuggestionResponse = {
  answer: string;
  dayChecklist: string[];
  weekChecklist: string[];
};

function buildItems(items: string[]): ChecklistItem[] {
  return items.map((text, index) => ({
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    done: false
  }));
}

function completion(items: ChecklistItem[]): number {
  if (items.length === 0) {
    return 0;
  }

  const done = items.filter((item) => item.done).length;
  return Math.round((done / items.length) * 100);
}

export function StudentChecklistPlanner() {
  const { syllabusFileUri } = useLearnSyncContext();
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [dayItems, setDayItems] = useState<ChecklistItem[]>([]);
  const [weekItems, setWeekItems] = useState<ChecklistItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dayPercent = useMemo(() => completion(dayItems), [dayItems]);
  const weekPercent = useMemo(() => completion(weekItems), [weekItems]);

  const updateItem = (
    type: "day" | "week",
    id: string,
    updater: (item: ChecklistItem) => ChecklistItem
  ) => {
    const setter = type === "day" ? setDayItems : setWeekItems;
    setter((prev) => prev.map((item) => (item.id === id ? updater(item) : item)));
  };

  const removeItem = (type: "day" | "week", id: string) => {
    const setter = type === "day" ? setDayItems : setWeekItems;
    setter((prev) => prev.filter((item) => item.id !== id));
  };

  const addItem = (type: "day" | "week") => {
    const setter = type === "day" ? setDayItems : setWeekItems;
    setter((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        text: "New checklist item",
        done: false
      }
    ]);
  };

  const generateChecklist = async () => {
    if (!syllabusFileUri) {
      setError("Teacher must upload syllabus context before generating checklist.");
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/checklist-suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          syllabusUri: syllabusFileUri,
          prompt: prompt.trim() || undefined
        })
      });

      if (!response.ok) {
        throw new Error("Checklist suggestion failed");
      }

      const payload = (await response.json()) as SuggestionResponse;
      setAnswer(payload.answer);
      setDayItems(buildItems(payload.dayChecklist));
      setWeekItems(buildItems(payload.weekChecklist));
    } catch (suggestionError) {
      setError(suggestionError instanceof Error ? suggestionError.message : "Unexpected checklist error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-white/10 bg-white/[0.06]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-[#60A5FA]" aria-hidden />
          AI day + week checklist
        </CardTitle>
        <CardDescription>
          Suggested from teacher syllabus context. Edit manually and mark done as you progress.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Optional focus: tomorrow's calculus revision"
            className="h-10 flex-1 rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-zinc-100 focus:border-[#3B82F6]/50 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
          />
          <Button type="button" onClick={generateChecklist} disabled={isGenerating} className="gap-2 sm:w-56">
            <Sparkles className="h-4 w-4" aria-hidden />
            {isGenerating ? "Generating..." : "Suggest Day + Week"}
          </Button>
        </div>
        {answer ? <p className="text-sm text-zinc-300">Model Answer: {answer}</p> : null}
        {error ? <p className="text-sm text-rose-400" role="alert">{error}</p> : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">Day ({dayPercent}%)</h3>
              <Button type="button" size="sm" variant="outline" className="gap-1" onClick={() => addItem("day")}>
                <Plus className="h-3.5 w-3.5" aria-hidden />
                Add
              </Button>
            </div>
            {dayItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 p-2">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={(event) =>
                    updateItem("day", item.id, (current) => ({ ...current, done: event.target.checked }))
                  }
                />
                <input
                  type="text"
                  value={item.text}
                  onChange={(event) =>
                    updateItem("day", item.id, (current) => ({ ...current, text: event.target.value }))
                  }
                  className="h-8 flex-1 rounded border border-white/10 bg-black/40 px-2 text-sm text-zinc-100 focus:border-[#3B82F6]/50 focus:outline-none"
                />
                <Button type="button" size="icon" variant="ghost" onClick={() => removeItem("day", item.id)}>
                  <Trash2 className="h-4 w-4 text-rose-400" aria-hidden />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-3 rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">Week ({weekPercent}%)</h3>
              <Button type="button" size="sm" variant="outline" className="gap-1" onClick={() => addItem("week")}>
                <Plus className="h-3.5 w-3.5" aria-hidden />
                Add
              </Button>
            </div>
            {weekItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 p-2">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={(event) =>
                    updateItem("week", item.id, (current) => ({ ...current, done: event.target.checked }))
                  }
                />
                <input
                  type="text"
                  value={item.text}
                  onChange={(event) =>
                    updateItem("week", item.id, (current) => ({ ...current, text: event.target.value }))
                  }
                  className="h-8 flex-1 rounded border border-white/10 bg-black/40 px-2 text-sm text-zinc-100 focus:border-[#3B82F6]/50 focus:outline-none"
                />
                <Button type="button" size="icon" variant="ghost" onClick={() => removeItem("week", item.id)}>
                  <Trash2 className="h-4 w-4 text-rose-400" aria-hidden />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
