"use client";

import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	type Dispatch,
	type ReactNode,
	type SetStateAction
} from "react";
import type { TodoItem } from "./TodoList";

const TEACHER_SYLLABUS_STORAGE_KEY = "learnsync-teacher-syllabus-uri";

function newId() {
	return `todo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

type LearnSyncContextValue = {
	syllabusFileUri: string | null;
	todoItems: TodoItem[];
	setTodoItems: Dispatch<SetStateAction<TodoItem[]>>;
	injectRecoveryTask: (task: string) => void;
};

const LearnSyncContext = createContext<LearnSyncContextValue | undefined>(undefined);

export function LearnSyncProvider({ children }: { children: ReactNode }) {
	const [syllabusFileUri, setSyllabusFileUri] = useState<string | null>(null);
	const [todoItems, setTodoItems] = useState<TodoItem[]>([
		{ id: "seed-1", text: "Revise previous session notes", done: false },
		{ id: "seed-2", text: "Solve 5 practice questions", done: false }
	]);

	useEffect(() => {
		const syncFromTeacherUpload = () => {
			const stored = window.localStorage.getItem(TEACHER_SYLLABUS_STORAGE_KEY);
			setSyllabusFileUri(stored && stored.trim() ? stored : null);
		};

		syncFromTeacherUpload();
		window.addEventListener("storage", syncFromTeacherUpload);
		window.addEventListener("learnsync-syllabus-updated", syncFromTeacherUpload as EventListener);

		return () => {
			window.removeEventListener("storage", syncFromTeacherUpload);
			window.removeEventListener("learnsync-syllabus-updated", syncFromTeacherUpload as EventListener);
		};
	}, []);

	const injectRecoveryTask = (task: string) => {
		const cleanTask = task.trim();
		if (!cleanTask) {
			return;
		}

		setTodoItems((prev) => {
			if (prev.some((t) => t.text.trim() === cleanTask)) {
				return prev;
			}
			return [{ id: newId(), text: cleanTask, done: false }, ...prev];
		});
	};

	const value = useMemo(
		() => ({ syllabusFileUri, todoItems, setTodoItems, injectRecoveryTask }),
		[syllabusFileUri, todoItems]
	);

	return <LearnSyncContext.Provider value={value}>{children}</LearnSyncContext.Provider>;
}

export function useLearnSyncContext() {
	const context = useContext(LearnSyncContext);
	if (!context) {
		throw new Error("useLearnSyncContext must be used within LearnSyncProvider");
	}

	return context;
}
