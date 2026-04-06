"use client";

import { useState } from "react";
import { Download, FileDown } from "lucide-react";
import { jsPDF } from "jspdf";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export type ReportGeneratorProps = {
	title?: string;
	lines?: string[];
	className?: string;
};

const DEFAULT_LINES = [
	"LearnSync · Dark Academy — performance snapshot (mock data).",
	"Top friction topics: Integration, Quadratics, Trigonometric identities.",
	"Cohort pulse held above 140 concurrent learners during peak sessions.",
	"Generated for syllabus branch: syllabus-main."
];

export function ReportGenerator({
	title = "LearnSync class report",
	lines = DEFAULT_LINES,
	className
}: ReportGeneratorProps) {
	const [busy, setBusy] = useState(false);

	const exportPdf = () => {
		setBusy(true);
		try {
			const doc = new jsPDF({ unit: "pt", format: "a4" });
			const margin = 48;
			let y = margin;

			doc.setFont("helvetica", "bold");
			doc.setFontSize(18);
			doc.setTextColor(30, 64, 175);
			doc.text(title, margin, y);
			y += 28;

			doc.setFont("helvetica", "normal");
			doc.setFontSize(11);
			doc.setTextColor(60, 60, 60);
			doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
			y += 36;

			doc.setTextColor(30, 30, 30);
			lines.forEach((line) => {
				const wrapped = doc.splitTextToSize(line, 515);
				doc.text(wrapped, margin, y);
				y += wrapped.length * 14 + 8;
			});

			doc.save("learnsync-report.pdf");
		} finally {
			setBusy(false);
		}
	};

	return (
		<Card className={`border-white/10 bg-white/[0.06] ${className ?? ""}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<FileDown className="h-5 w-5 text-[#60A5FA]" aria-hidden />
					Report generator
				</CardTitle>
				<CardDescription>
					One-click PDF export — mock narrative for demos; wire real analytics later.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Button type="button" className="w-full gap-2 sm:w-auto" onClick={exportPdf} disabled={busy}>
					<Download className="h-4 w-4" aria-hidden />
					{busy ? "Preparing PDF…" : "Export PDF"}
				</Button>
			</CardContent>
		</Card>
	);
}
