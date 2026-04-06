import Link from "next/link";
import { ArrowRight, GraduationCap, Sparkles } from "lucide-react";
import { buttonVariants } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { cn } from "../components/ui/utils";

export default function HomePage() {
	return (
		<div className="mx-auto max-w-4xl space-y-10">
			<div className="space-y-4 text-center">
				<div className="inline-flex items-center gap-2 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#93C5FD]">
					<Sparkles className="h-3.5 w-3.5" aria-hidden />
					Live Demo Ready
				</div>
				<h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">LearnSync</h1>
				<p className="mx-auto max-w-xl text-base text-zinc-400">
					AI-powered study operations for students and teachers with real-time pulse and analytics.
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card className="border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<GraduationCap className="h-5 w-5 text-[#60A5FA]" aria-hidden />
							Student workspace
						</CardTitle>
						<CardDescription>Focus timer, Snap Doubt, AI chat, adaptive to-do, timetable.</CardDescription>
					</CardHeader>
					<CardContent>
						<Link
							href="/student"
							className={cn(buttonVariants(), "inline-flex w-full gap-2 sm:w-auto")}
						>
							Open student HUD
							<ArrowRight className="h-4 w-4" aria-hidden />
						</Link>
					</CardContent>
				</Card>

				<Card className="border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent">
					<CardHeader>
						<CardTitle>Teacher dashboard</CardTitle>
						<CardDescription>Syllabus upload, friction heatmap, planner, analytics, report cards.</CardDescription>
					</CardHeader>
					<CardContent>
						<Link
							href="/teacher"
							className={cn(buttonVariants({ variant: "outline" }), "inline-flex w-full gap-2 sm:w-auto")}
						>
							Open teacher view
							<ArrowRight className="h-4 w-4" aria-hidden />
						</Link>
					</CardContent>
				</Card>
			</div>

			<p className="text-center text-sm text-zinc-500">
				<Link href="/health" className="text-[#60A5FA] underline-offset-4 hover:underline">
					Open system health check
				</Link>
			</p>
		</div>
	);
}
