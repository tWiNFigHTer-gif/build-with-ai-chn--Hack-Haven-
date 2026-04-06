"use client";

import { LearnSyncProvider, useLearnSyncContext } from "../../components/student/LearnSyncProvider";
import { StudentChecklistPlanner } from "../../components/student/StudentChecklistPlanner";
import { StudyHUD } from "../../components/student/StudyHUD";
import { TimetableGenerator } from "../../components/student/TimetableGenerator";
import { TodoList } from "../../components/student/TodoList";

function StudentWorkspace() {
	const { todoItems, setTodoItems } = useLearnSyncContext();

	return (
		<div className="mx-auto max-w-6xl space-y-8">
			<header className="space-y-2">
				<p className="text-xs font-medium uppercase tracking-[0.25em] text-[#60A5FA]/90">Student · Monk mode</p>
				<h1 className="text-3xl font-semibold tracking-tight text-white">LearnSync workspace</h1>
				<p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
					Focus HUD, Socratic support, and adaptive planning grounded on teacher-uploaded syllabus context.
				</p>
			</header>

			<StudyHUD />

			<TimetableGenerator />

			<div className="grid gap-6 lg:grid-cols-2">
				<TodoList items={todoItems} onItemsChange={setTodoItems} />
				<StudentChecklistPlanner />
			</div>
		</div>
	);
}

export default function StudentPage() {
	return (
		<LearnSyncProvider>
			<StudentWorkspace />
		</LearnSyncProvider>
	);
}
