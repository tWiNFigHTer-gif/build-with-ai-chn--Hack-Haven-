"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { Camera, MessageCircle, Pause, Play, RotateCcw, Sparkles, Users } from "lucide-react";
import { useDoubts } from "../../hooks/useDoubts";
import { useTimer } from "../../hooks/useTimer";
import { cn } from "../ui/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useLearnSyncContext } from "./LearnSyncProvider";

type ChatMessage = {
	role: "user" | "assistant";
	text: string;
};

type ChatResponse = {
	reply: string;
};

async function toBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result;
			if (typeof result === "string") {
				resolve(result);
			} else {
				reject(new Error("Failed to read file"));
			}
		};
		reader.onerror = () => reject(new Error("Unable to read image"));
		reader.readAsDataURL(file);
	});
}

export function StudyHUD() {
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [doubtError, setDoubtError] = useState<string | null>(null);
	const [chatInput, setChatInput] = useState("");
	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
	const [chatError, setChatError] = useState<string | null>(null);
	const [isChatLoading, setIsChatLoading] = useState(false);
	const { syllabusFileUri, injectRecoveryTask } = useLearnSyncContext();
	const { submitDoubt, hint, topicTag, error, isLoading } = useDoubts();
	const { secondsLeft, isRunning, activeStudents, start, pause, reset } = useTimer(25 * 60, "syllabus-main");

	const formattedTime = useMemo(() => {
		const minutes = Math.floor(secondsLeft / 60)
			.toString()
			.padStart(2, "0");
		const seconds = (secondsLeft % 60).toString().padStart(2, "0");
		return `${minutes}:${seconds}`;
	}, [secondsLeft]);

	const peerPulse = Math.max(activeStudents, 0);

	const handleImagePick = (event: ChangeEvent<HTMLInputElement>) => {
		setSelectedImage(event.target.files?.[0] ?? null);
		setDoubtError(null);
	};

	const handleChatSend = async () => {
		const message = chatInput.trim();
		if (!message) {
			return;
		}

		if (!syllabusFileUri) {
			setChatError("Teacher must upload syllabus context first.");
			return;
		}

		setChatError(null);
		setIsChatLoading(true);
		setChatInput("");
		setChatMessages((prev) => [...prev, { role: "user", text: message }]);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					message,
					syllabusUri: syllabusFileUri
				})
			});

			if (!response.ok) {
				throw new Error("Chat request failed");
			}

			const payload = (await response.json()) as ChatResponse;
			setChatMessages((prev) => [...prev, { role: "assistant", text: payload.reply }]);
		} catch (chatRequestError) {
			setChatError(chatRequestError instanceof Error ? chatRequestError.message : "Unexpected chat error");
		} finally {
			setIsChatLoading(false);
		}
	};

	const handleSnapDoubt = async () => {
		if (!selectedImage) {
			setDoubtError("Pick an image before using Snap Doubt.");
			return;
		}

		if (!syllabusFileUri) {
			setDoubtError("Teacher must upload syllabus context first.");
			return;
		}

		setDoubtError(null);
		const imageBase64 = await toBase64(selectedImage);
		const response = await submitDoubt({ imageBase64, syllabusUri: syllabusFileUri });

		if (response?.recovery_task) {
			injectRecoveryTask(response.recovery_task);
		}
	};

	return (
		<div className="grid gap-6 lg:grid-cols-12">
			<Card className="border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] lg:col-span-7">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl">
						<Sparkles className="h-5 w-5 text-[#60A5FA]" aria-hidden />
						Focus HUD
					</CardTitle>
					<CardDescription>Digital timer with live cohort pulse — monk mode, zero noise.</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
					<div className="relative flex flex-1 flex-col items-center justify-center">
						<div
							className={cn(
								"timer-ring relative flex h-48 w-48 flex-col items-center justify-center rounded-full border border-[#3B82F6]/40 bg-[#0B0B0B]/80",
								isRunning && "ring-2 ring-[#3B82F6]/50"
							)}
						>
							<p className="text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">Session</p>
							<p
								className="mt-1 font-mono text-5xl font-semibold tabular-nums tracking-tight text-white"
								style={{ fontFamily: "var(--font-jetbrains), ui-monospace, monospace" }}
							>
								{formattedTime}
							</p>
							<div className="mt-4 flex gap-2">
								{!isRunning ? (
									<Button type="button" size="sm" onClick={start} className="gap-1.5">
										<Play className="h-4 w-4" aria-hidden />
										Start
									</Button>
								) : (
									<Button type="button" size="sm" variant="outline" onClick={pause} className="gap-1.5">
										<Pause className="h-4 w-4" aria-hidden />
										Pause
									</Button>
								)}
								<Button type="button" size="sm" variant="ghost" onClick={reset} className="gap-1.5">
									<RotateCcw className="h-4 w-4" aria-hidden />
									Reset
								</Button>
							</div>
						</div>
					</div>

					<div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
						<div className="flex items-center justify-between gap-3">
							<div>
								<p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Peer Pulse</p>
								<p className="mt-1 flex items-baseline gap-1.5">
									<span
										className="font-mono text-3xl font-semibold text-[#60A5FA]"
										style={{ fontFamily: "var(--font-jetbrains), ui-monospace, monospace" }}
									>
										{peerPulse}
									</span>
									<span className="text-sm text-zinc-400">active</span>
								</p>
							</div>
							<span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B82F6]/15 text-[#93C5FD] ring-1 ring-[#3B82F6]/30">
								<Users className="h-6 w-6" aria-hidden />
							</span>
						</div>
						<p className="text-xs leading-relaxed text-zinc-500">
							Live cohort heartbeat for your branch from Firebase Realtime DB.
						</p>
					</div>
				</CardContent>
			</Card>

			<Card className="border-white/10 bg-white/[0.06] lg:col-span-5">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Camera className="h-5 w-5 text-[#60A5FA]" aria-hidden />
						Snap Doubt
					</CardTitle>
					<CardDescription>Capture a problem photo — syllabus-grounded hints flow back.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<label
						htmlFor="doubt-image"
						className="flex cursor-pointer flex-col gap-2 rounded-xl border border-dashed border-white/15 bg-black/30 px-4 py-6 text-center text-sm text-zinc-400 transition hover:border-[#3B82F6]/40 hover:text-zinc-200"
					>
						<input
							id="doubt-image"
							type="file"
							accept="image/*"
							capture="environment"
							className="sr-only"
							onChange={handleImagePick}
						/>
						<span className="font-medium text-zinc-200">{selectedImage ? selectedImage.name : "Tap to attach image"}</span>
						<span className="text-xs">Mobile opens camera; desktop picks a file.</span>
					</label>
					<Button type="button" className="w-full" onClick={handleSnapDoubt} disabled={isLoading}>
						{isLoading ? "Scanning…" : "Run Snap Doubt"}
					</Button>
					{hint ? (
						<p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
							<span className="font-medium text-emerald-300">AI hint:</span> {hint}
						</p>
					) : null}
					{topicTag ? (
						<p className="text-xs uppercase tracking-wider text-zinc-500">
							Topic tag: <span className="text-zinc-300">{topicTag}</span>
						</p>
					) : null}
					{error ? (
						<p className="text-sm text-rose-400" role="alert">
							{error}
						</p>
					) : null}
					{doubtError ? (
						<p className="text-sm text-rose-400" role="alert">
							{doubtError}
						</p>
					) : null}
				</CardContent>
			</Card>

			<Card className="border-white/10 bg-white/[0.06] lg:col-span-12">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<MessageCircle className="h-5 w-5 text-[#60A5FA]" aria-hidden />
						Socratic chatbot
					</CardTitle>
					<CardDescription>Text doubts grounded to the syllabus your teacher uploaded.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="max-h-64 space-y-3 overflow-y-auto rounded-xl border border-white/10 bg-black/40 p-4">
						{chatMessages.length === 0 ? (
							<p className="text-sm text-zinc-500">No messages yet. Ask anything aligned to your PDF context.</p>
						) : null}
						{chatMessages.map((message, index) => (
							<div
								key={`${message.role}-${index}`}
								className={cn(
									"rounded-lg px-3 py-2 text-sm",
									message.role === "user"
										? "ml-8 bg-[#3B82F6]/20 text-zinc-100"
										: "mr-8 border border-white/10 bg-white/5 text-zinc-200"
								)}
							>
								<span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
									{message.role === "user" ? "You" : "Tutor"}
								</span>
								<p className="mt-1 whitespace-pre-wrap">{message.text}</p>
							</div>
						))}
					</div>
					<div className="flex flex-col gap-2 sm:flex-row">
						<input
							type="text"
							value={chatInput}
							placeholder="Ask your doubt in text…"
							onChange={(event) => setChatInput(event.target.value)}
							className="h-10 flex-1 rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#3B82F6]/50 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
							onKeyDown={(e) => {
								if (e.key === "Enter") void handleChatSend();
							}}
						/>
						<Button type="button" onClick={handleChatSend} disabled={isChatLoading} className="sm:w-36">
							{isChatLoading ? "Sending…" : "Ask"}
						</Button>
					</div>
					{chatError ? (
						<p className="text-sm text-rose-400" role="alert">
							{chatError}
						</p>
					) : null}
				</CardContent>
			</Card>
		</div>
	);
}
