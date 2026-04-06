"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export type FrictionDatum = {
	topic: string;
	friction: number;
};

export type FrictionHeatmapProps = {
	data?: FrictionDatum[];
	className?: string;
};

type AnalyticsResponse = {
	status: string;
	topTopics: Array<{ topic: string; count: number }>;
};

const MOCK_FRICTION: FrictionDatum[] = [
	{ topic: "Quadratics", friction: 88 },
	{ topic: "Trig IDs", friction: 72 },
	{ topic: "Integration", friction: 95 },
	{ topic: "Vectors", friction: 54 },
	{ topic: "Probability", friction: 63 }
];

const ROSE = "#F43F5E";
const AMBER = "#F59E0B";
const COOL = "#3B82F6";

function barColor(value: number): string {
	if (value >= 85) return ROSE;
	if (value >= 70) return AMBER;
	return COOL;
}

export function FrictionHeatmap({ data = MOCK_FRICTION, className }: FrictionHeatmapProps) {
	const [mounted, setMounted] = useState(false);
	const [liveData, setLiveData] = useState<FrictionDatum[]>(data);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const loadAnalytics = async () => {
			try {
				const response = await fetch("/api/analytics", { cache: "no-store" });
				if (!response.ok) {
					return;
				}

				const payload = (await response.json()) as AnalyticsResponse;
				if (!Array.isArray(payload.topTopics) || payload.topTopics.length === 0) {
					return;
				}

				setLiveData(
					payload.topTopics.map((topic) => ({
						topic: topic.topic,
						friction: Math.min(100, topic.count * 10)
					}))
				);
			} catch {
				// Keep mock data as fallback for demo resilience.
			}
		};

		void loadAnalytics();
	}, []);

	return (
		<Card className={`border-white/10 bg-white/[0.06] ${className ?? ""}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Flame className="h-5 w-5 text-rose-400" aria-hidden />
					Friction heatmap
				</CardTitle>
				<CardDescription>
					Mock cohort struggle signal by topic — higher bars mean more revision friction (Recharts bar chart).
				</CardDescription>
			</CardHeader>
			<CardContent className="h-[320px] min-h-[280px] min-w-0 pt-2">
				{!mounted ? (
					<div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/30 text-sm text-zinc-500">
						Loading chart…
					</div>
				) : (
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={liveData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
							<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
							<XAxis
								dataKey="topic"
								tick={{ fill: "#a1a1aa", fontSize: 12 }}
								axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
								tickLine={false}
							/>
							<YAxis
								tick={{ fill: "#a1a1aa", fontSize: 12 }}
								axisLine={false}
								tickLine={false}
								domain={[0, 100]}
								label={{ value: "Friction index", angle: -90, position: "insideLeft", fill: "#71717a", fontSize: 11 }}
							/>
							<Tooltip
								cursor={{ fill: "rgba(255,255,255,0.04)" }}
								contentStyle={{
									background: "rgba(15,15,15,0.95)",
									border: "1px solid rgba(255,255,255,0.1)",
									borderRadius: "12px",
									color: "#fafafa"
								}}
								labelStyle={{ color: "#a1a1aa" }}
								formatter={(value: number) => [`${value}`, "Friction"]}
							/>
							<Bar dataKey="friction" radius={[6, 6, 0, 0]} maxBarSize={48}>
								{liveData.map((entry, index) => (
									<Cell key={`cell-${entry.topic}-${index}`} fill={barColor(entry.friction)} />
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				)}
			</CardContent>
		</Card>
	);
}
