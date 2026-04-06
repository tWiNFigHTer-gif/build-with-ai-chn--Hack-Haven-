"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, FileText, GraduationCap } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

type TopicRow = {
  id: string;
  topic: string;
  priority: number;
};

type StudentRow = {
  id: string;
  name: string;
  maths: number;
  science: number;
  english: number;
};

type TopicFrequencyRow = {
  topic: string;
  count: number;
};

type AnalyticsResponse = {
  status: string;
  topTopics: TopicFrequencyRow[];
};

function toPercent(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function gradeFromPercent(percent: number): string {
  if (percent >= 90) return "A+";
  if (percent >= 80) return "A";
  if (percent >= 70) return "B";
  if (percent >= 60) return "C";
  if (percent >= 50) return "D";
  return "Needs Support";
}

export function TeacherAnalyticsPanel() {
  const [topics, setTopics] = useState<TopicRow[]>([
    { id: "t1", topic: "Algebra", priority: 85 },
    { id: "t2", topic: "Trigonometry", priority: 72 },
    { id: "t3", topic: "Calculus", priority: 91 }
  ]);

  const [students, setStudents] = useState<StudentRow[]>([
    { id: "s1", name: "Aarav", maths: 78, science: 82, english: 75 },
    { id: "s2", name: "Diya", maths: 89, science: 92, english: 84 },
    { id: "s3", name: "Rahul", maths: 58, science: 64, english: 61 }
  ]);

  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics");
        if (!response.ok) {
          throw new Error("Failed to load analytics");
        }

        const payload = (await response.json()) as AnalyticsResponse;
        if (!Array.isArray(payload.topTopics) || payload.topTopics.length === 0) {
          return;
        }

        setTopics(
          payload.topTopics.map((item, index) => ({
            id: `analytics-${index}-${item.topic}`,
            topic: item.topic,
            priority: Math.min(100, item.count * 10)
          }))
        );
      } catch (error) {
        setAnalyticsError(error instanceof Error ? error.message : "Analytics unavailable");
      }
    };

    void loadAnalytics();
  }, []);

  const updateTopic = (id: string, patch: Partial<TopicRow>) => {
    setTopics((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const addTopic = () => {
    setTopics((prev) => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        topic: "New Topic",
        priority: 50
      }
    ]);
  };

  const removeTopic = (id: string) => {
    setTopics((prev) => prev.filter((row) => row.id !== id));
  };

  const updateStudent = (id: string, patch: Partial<StudentRow>) => {
    setStudents((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const addStudent = () => {
    setStudents((prev) => [
      ...prev,
      {
        id: `s-${Date.now()}`,
        name: "New Student",
        maths: 0,
        science: 0,
        english: 0
      }
    ]);
  };

  const removeStudent = (id: string) => {
    setStudents((prev) => prev.filter((row) => row.id !== id));
  };

  const reportRows = useMemo(() => {
    return students.map((student) => {
      const average = Math.round((student.maths + student.science + student.english) / 3);
      return {
        ...student,
        average,
        grade: gradeFromPercent(average)
      };
    });
  }, [students]);

  const generateReportCards = () => {
    setGeneratedAt(new Date().toLocaleString());
  };

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.06]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#60A5FA]" aria-hidden />
            Revision important topic chart
          </CardTitle>
          <CardDescription>Higher priority means stronger revision need from live doubt patterns.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {analyticsError ? <p className="text-sm text-rose-400" role="alert">{analyticsError}</p> : null}
          <Button type="button" variant="outline" onClick={addTopic}>Add Topic</Button>
          {topics.map((topic) => (
            <div key={topic.id} className="rounded-xl border border-white/10 bg-black/35 p-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={topic.topic}
                  onChange={(event) => updateTopic(topic.id, { topic: event.target.value })}
                  className="h-9 flex-1 rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-zinc-100"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={topic.priority}
                  onChange={(event) => updateTopic(topic.id, { priority: toPercent(Number(event.target.value)) })}
                  className="h-9 w-28 rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-zinc-100"
                />
                <Button type="button" variant="ghost" onClick={() => removeTopic(topic.id)}>Remove</Button>
              </div>
              <div className="mt-2 h-2 w-full max-w-xl rounded-full bg-zinc-800">
                <div className="h-2 rounded-full bg-orange-400" style={{ width: `${toPercent(topic.priority)}%` }} />
              </div>
              <p className="mt-1 text-xs text-zinc-400">{toPercent(topic.priority)}% revision priority</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.06]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-[#60A5FA]" aria-hidden />
            Student marks entry
          </CardTitle>
          <CardDescription>Enter marks per student profile before generating report cards.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button type="button" variant="outline" onClick={addStudent}>Add Student</Button>
          {students.map((student) => (
            <div key={student.id} className="grid gap-2 rounded-xl border border-white/10 bg-black/35 p-3 sm:grid-cols-6">
              <input
                type="text"
                value={student.name}
                onChange={(event) => updateStudent(student.id, { name: event.target.value })}
                className="h-9 rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-zinc-100 sm:col-span-2"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={student.maths}
                onChange={(event) => updateStudent(student.id, { maths: toPercent(Number(event.target.value)) })}
                className="h-9 rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-zinc-100"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={student.science}
                onChange={(event) => updateStudent(student.id, { science: toPercent(Number(event.target.value)) })}
                className="h-9 rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-zinc-100"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={student.english}
                onChange={(event) => updateStudent(student.id, { english: toPercent(Number(event.target.value)) })}
                className="h-9 rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-zinc-100"
              />
              <Button type="button" variant="ghost" onClick={() => removeStudent(student.id)}>Remove</Button>
            </div>
          ))}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={generateReportCards} className="gap-2">
              <FileText className="h-4 w-4" aria-hidden />
              Generate Report Cards
            </Button>
            {generatedAt ? <p className="text-xs text-zinc-500">Last generated: {generatedAt}</p> : null}
          </div>

          {generatedAt ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {reportRows.map((row) => (
                <article key={row.id} className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm">
                  <h4 className="text-base font-semibold text-white">{row.name}</h4>
                  <p className="mt-2 text-zinc-400">Maths: {row.maths}</p>
                  <p className="text-zinc-400">Science: {row.science}</p>
                  <p className="text-zinc-400">English: {row.english}</p>
                  <p className="mt-2 text-zinc-200">Average: {row.average}%</p>
                  <p className="text-[#60A5FA]">Grade: {row.grade}</p>
                </article>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
