"use client";

import { useState } from "react";
import { Check, ListTodo, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { cn } from "../ui/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export type TodoItem = {
	id: string;
	text: string;
	done: boolean;
};

export type TodoListProps = {
	items: TodoItem[];
	onItemsChange: (next: TodoItem[]) => void;
	className?: string;
};

export function TodoList({ items, onItemsChange, className }: TodoListProps) {
	const [editingId, setEditingId] = useState<string | null>(null);
	const [draft, setDraft] = useState("");

	const commitEdit = (id: string) => {
		const trimmed = draft.trim();
		if (!trimmed) {
			setEditingId(null);
			setDraft("");
			return;
		}
		onItemsChange(items.map((item) => (item.id === id ? { ...item, text: trimmed } : item)));
		setEditingId(null);
		setDraft("");
	};

	const toggleDone = (id: string) => {
		onItemsChange(items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
	};

	const removeById = (id: string) => {
		onItemsChange(items.filter((item) => item.id !== id));
		if (editingId === id) {
			setEditingId(null);
			setDraft("");
		}
	};

	const addItem = () => {
		const id = `todo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
		onItemsChange([...items, { id, text: "New AI task — tap edit", done: false }]);
		setEditingId(id);
		setDraft("New AI task — tap edit");
	};

	const doneCount = items.filter((i) => i.done).length;
	const total = items.length;
	const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);

	return (
		<Card className={cn("border-white/10 bg-white/[0.06]", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<ListTodo className="h-5 w-5 text-[#60A5FA]" aria-hidden />
					AI-dynamic to-do
				</CardTitle>
				<CardDescription>
					Check items off when done, or edit text. AI recovery tasks still appear at the top when injected.
				</CardDescription>
				{total > 0 ? (
					<p className="text-xs text-zinc-500">
						{doneCount} of {total} finished ({pct}%)
					</p>
				) : null}
			</CardHeader>
			<CardContent className="space-y-3">
				<ul className="space-y-2">
					{items.map((item) => (
						<li
							key={item.id}
							className={cn(
								"todo-item-enter group flex items-start gap-3 rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 backdrop-blur-sm transition-colors",
								editingId === item.id && "border-[#3B82F6]/40 ring-1 ring-[#3B82F6]/25",
								item.done && "border-emerald-500/20 bg-emerald-500/5"
							)}
						>
							<button
								type="button"
								onClick={() => toggleDone(item.id)}
								className={cn(
									"mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition",
									item.done
										? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
										: "border-white/15 bg-[#3B82F6]/10 text-[#93C5FD] hover:border-[#3B82F6]/40"
								)}
								aria-pressed={item.done}
								aria-label={item.done ? "Mark as not done" : "Mark as done"}
							>
								{item.done ? <Check className="h-4 w-4" strokeWidth={3} /> : <Sparkles className="h-4 w-4 opacity-80" />}
							</button>
							<div className="min-w-0 flex-1">
								{editingId === item.id ? (
									<input
										autoFocus
										value={draft}
										onChange={(e) => setDraft(e.target.value)}
										onBlur={() => commitEdit(item.id)}
										onKeyDown={(e) => {
											if (e.key === "Enter") commitEdit(item.id);
											if (e.key === "Escape") {
												setEditingId(null);
												setDraft("");
											}
										}}
										className="w-full rounded-md border border-white/15 bg-black/50 px-2 py-1 text-sm text-zinc-100 focus:border-[#3B82F6]/50 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
									/>
								) : (
									<button
										type="button"
										onClick={() => {
											setEditingId(item.id);
											setDraft(item.text);
										}}
										className={cn(
											"w-full text-left text-sm transition hover:text-white",
											item.done ? "text-zinc-500 line-through decoration-zinc-600" : "text-zinc-200"
										)}
									>
										{item.text}
									</button>
								)}
							</div>
							<div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
								<Button
									type="button"
									size="icon"
									variant="ghost"
									className="h-8 w-8"
									onClick={() => {
										setEditingId(item.id);
										setDraft(item.text);
									}}
									aria-label="Edit task"
								>
									<Pencil className="h-4 w-4" />
								</Button>
								<Button
									type="button"
									size="icon"
									variant="ghost"
									className="h-8 w-8 text-rose-400 hover:text-rose-300"
									onClick={() => removeById(item.id)}
									aria-label="Remove task"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</li>
					))}
				</ul>
				<Button type="button" variant="outline" className="w-full gap-2" onClick={addItem}>
					<Plus className="h-4 w-4" aria-hidden />
					Add task
				</Button>
			</CardContent>
		</Card>
	);
}
