"use client";

import { useState } from "react";
import { FrictionHeatmap } from "../../components/teacher/FrictionHeatmap";
import { KnowledgeBase } from "../../components/teacher/KnowledgeBase";
import { ReportGenerator } from "../../components/teacher/ReportGenerator";
import { TeacherAnalyticsPanel } from "../../components/teacher/TeacherAnalyticsPanel";
import { TeacherPlanner } from "../../components/teacher/TeacherPlanner";

export default function TeacherPage() {
	const [syllabusFileUri, setSyllabusFileUri] = useState<string | null>(null);

	return (
		<div className="mx-auto max-w-7xl space-y-10">
			<header className="space-y-2">
				<p className="text-xs font-medium uppercase tracking-[0.25em] text-[#60A5FA]/90">Teacher · Oracle</p>
				<h1 className="text-3xl font-semibold tracking-tight text-white">LearnSync dashboard</h1>
				<p className="max-w-3xl text-sm leading-relaxed text-zinc-400">
					Upload syllabus once, monitor student friction and progress, then generate actionable reports.
				</p>
			</header>

			<KnowledgeBase syllabusFileUri={syllabusFileUri} onSyllabusFileUri={setSyllabusFileUri} />

			<div className="grid min-w-0 gap-6 xl:grid-cols-3">
				<div className="min-w-0 xl:col-span-2">
					<FrictionHeatmap />
				</div>
				<div className="space-y-6">
					<ReportGenerator />
				</div>
			</div>

			<div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md lg:p-6">
				<TeacherAnalyticsPanel />
			</div>

			<div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md lg:p-6">
				<TeacherPlanner syllabusUri={syllabusFileUri} branchId="syllabus-main" />
			</div>
		</div>
	);
}
