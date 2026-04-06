"use client";

import { useEffect, useState } from "react";
import { Activity, Database, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

type HealthPayload = {
  status: "ready" | "degraded";
  checkedAt: string;
  modelProvider: "mock" | "vertex";
  services: {
    realtimeDb: {
      reachable: boolean;
      detail: string;
    };
    firestore: {
      reachable: boolean;
      detail: string;
    };
  };
};

export default function HealthPage() {
  const [payload, setPayload] = useState<HealthPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadHealth = async () => {
    setError(null);
    try {
      const response = await fetch("/api/health", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to load health status");
      }

      const data = (await response.json()) as HealthPayload;
      setPayload(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Health check failed");
    }
  };

  useEffect(() => {
    void loadHealth();
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card className="border-white/10 bg-white/[0.06]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-[#60A5FA]" aria-hidden />
            LearnSync health check
          </CardTitle>
          <CardDescription>Realtime service readiness in one screen for demo verification.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button type="button" variant="outline" onClick={loadHealth}>Refresh</Button>
          {error ? <p className="text-sm text-rose-400" role="alert">{error}</p> : null}
          {payload ? (
            <>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Overall</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-zinc-100">
                    <Activity className="h-4 w-4 text-[#60A5FA]" aria-hidden />
                    {payload.status}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Model provider</p>
                  <p className="mt-1 text-sm text-zinc-100">{payload.modelProvider}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Checked at</p>
                  <p className="mt-1 text-sm text-zinc-100">{new Date(payload.checkedAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Realtime DB</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-zinc-100">
                    <Database className="h-4 w-4 text-[#60A5FA]" aria-hidden />
                    {payload.services.realtimeDb.reachable ? "Reachable" : "Unavailable"}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">{payload.services.realtimeDb.detail}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Firestore</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-zinc-100">
                    <ShieldCheck className="h-4 w-4 text-[#60A5FA]" aria-hidden />
                    {payload.services.firestore.reachable ? "Reachable" : "Unavailable"}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">{payload.services.firestore.detail}</p>
                </div>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
