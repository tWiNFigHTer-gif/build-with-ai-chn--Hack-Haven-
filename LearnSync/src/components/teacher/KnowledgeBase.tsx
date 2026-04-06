"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FileUp, FileText, Loader2, ShieldCheck } from "lucide-react";
import { cn } from "../ui/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const TEACHER_SYLLABUS_STORAGE_KEY = "learnsync-teacher-syllabus-uri";

type UploadContextResponse = {
	fileUri: string;
};

export type KnowledgeBaseProps = {
	syllabusFileUri: string | null;
	onSyllabusFileUri: (uri: string | null) => void;
	className?: string;
};

export function KnowledgeBase({ syllabusFileUri, onSyllabusFileUri, className }: KnowledgeBaseProps) {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	useEffect(() => {
		if (syllabusFileUri) {
			return;
		}

		const storedUri = window.localStorage.getItem(TEACHER_SYLLABUS_STORAGE_KEY);
		if (storedUri && storedUri.trim()) {
			onSyllabusFileUri(storedUri);
		}
	}, [syllabusFileUri, onSyllabusFileUri]);

	const uploadFile = useCallback(
		async (file: File) => {
			setIsUploading(true);
			setError(null);

			try {
				const formData = new FormData();
				formData.append("file", file);

				const response = await fetch("/api/upload-context", {
					method: "POST",
					body: formData
				});

				if (!response.ok) {
					throw new Error("Failed to upload teacher syllabus context");
				}

				const payload = (await response.json()) as UploadContextResponse;
				const uri = payload.fileUri ?? null;
				onSyllabusFileUri(uri);
				if (uri) {
					window.localStorage.setItem(TEACHER_SYLLABUS_STORAGE_KEY, uri);
					window.dispatchEvent(new Event("learnsync-syllabus-updated"));
				}
			} catch (uploadError) {
				setError(uploadError instanceof Error ? uploadError.message : "Unexpected upload error");
			} finally {
				setIsUploading(false);
			}
		},
		[onSyllabusFileUri]
	);

	const handleFileSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}
		await uploadFile(file);
		event.target.value = "";
	};

	const onDrop = useCallback(
		async (e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
			const file = e.dataTransfer.files?.[0];
			if (!file) return;
			const ok = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
			if (!ok) {
				setError("Please drop a PDF (syllabus or scheme).");
				return;
			}
			await uploadFile(file);
		},
		[uploadFile]
	);

	return (
		<Card className={cn("border-white/10 bg-white/[0.06]", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<FileText className="h-5 w-5 text-[#60A5FA]" aria-hidden />
					PDF knowledge base
				</CardTitle>
				<CardDescription>
					Upload syllabus or exam scheme — drag a PDF or browse. Powers teacher + student AI context.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div
					role="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
					}}
					onDragEnter={(e) => {
						e.preventDefault();
						setIsDragging(true);
					}}
					onDragOver={(e) => {
						e.preventDefault();
						setIsDragging(true);
					}}
					onDragLeave={() => setIsDragging(false)}
					onDrop={onDrop}
					className={cn(
						"relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-10 text-center transition",
						isDragging
							? "border-[#3B82F6]/60 bg-[#3B82F6]/10 shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]"
							: "border-white/15 bg-black/30 hover:border-[#3B82F6]/35"
					)}
					onClick={() => fileInputRef.current?.click()}
				>
					<input
						ref={fileInputRef}
						type="file"
						accept=".pdf,.txt,.md,application/pdf"
						className="hidden"
						onChange={handleFileSelection}
					/>
					{isUploading ? (
						<Loader2 className="h-10 w-10 animate-spin text-[#60A5FA]" aria-hidden />
					) : (
						<FileUp className="h-10 w-10 text-zinc-500" aria-hidden />
					)}
					<div>
						<p className="text-sm font-medium text-zinc-200">Drop syllabus / scheme PDF here</p>
						<p className="mt-1 text-xs text-zinc-500">PDF preferred · .txt and .md supported</p>
					</div>
					<Button
						type="button"
						variant="outline"
						className="pointer-events-none"
						onClick={(e) => e.stopPropagation()}
					>
						Browse files
					</Button>
				</div>

				<div className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3">
					<ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400/90" aria-hidden />
					<div className="min-w-0 text-sm">
						<p className="font-medium text-zinc-200">Context link</p>
						{syllabusFileUri ? (
							<p className="mt-1 break-all text-xs text-zinc-400">{syllabusFileUri}</p>
						) : (
							<p className="mt-1 text-xs text-zinc-500">No syllabus uploaded yet.</p>
						)}
					</div>
				</div>

				{error ? (
					<p className="text-sm text-rose-400" role="alert">
						{error}
					</p>
				) : null}
			</CardContent>
		</Card>
	);
}
