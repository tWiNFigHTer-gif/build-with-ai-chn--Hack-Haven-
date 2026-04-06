"use client";

import { useState } from "react";
import { CalendarDays, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useLearnSyncContext } from "./LearnSyncProvider";

type TimetableResponse = {
  status: string;
  message: string;
};

export function TimetableGenerator() {
  const { syllabusFileUri } = useLearnSyncContext();
  const [examDate, setExamDate] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!syllabusFileUri) {
      setError("Teacher must upload syllabus context first.");
      return;
    }

    if (!examDate) {
      setError("Select exam date first.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/timetable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          examDate,
          syllabusUri: syllabusFileUri
        })
      });

      if (!response.ok) {
        throw new Error("Timetable generation failed");
      }

      const payload = (await response.json()) as TimetableResponse;
      setResult(payload.message || "Timetable generated.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unexpected timetable error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-white/10 bg-white/[0.06]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-[#60A5FA]" aria-hidden />
          7-day timetable
        </CardTitle>
        <CardDescription>Generate a sprint plan from exam date + teacher syllabus context.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="h-10 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-zinc-100 focus:border-[#3B82F6]/50 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
        />
        <Button type="button" onClick={generate} disabled={loading} className="w-full gap-2 sm:w-auto">
          <Sparkles className="h-4 w-4" aria-hidden />
          {loading ? "Generating…" : "Generate timetable"}
        </Button>
        {result ? <p className="text-sm text-emerald-300">{result}</p> : null}
        {error ? <p className="text-sm text-rose-400" role="alert">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
