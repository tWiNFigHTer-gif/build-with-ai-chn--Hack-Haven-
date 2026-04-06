"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, GraduationCap, LayoutDashboard, Sparkles } from "lucide-react";
import { cn } from "../ui/utils";

const nav = [
	{ href: "/", label: "Home", icon: LayoutDashboard },
	{ href: "/student", label: "Student", icon: GraduationCap },
	{ href: "/teacher", label: "Teacher", icon: BookOpen }
];

export function AppShell({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	return (
		<div className="flex min-h-screen bg-[#0B0B0B] text-zinc-100">
			<aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-black/40 px-4 py-6 backdrop-blur-xl lg:flex">
				<Link href="/" className="mb-10 flex items-center gap-2 px-2">
					<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B82F6]/20 text-[#60A5FA] ring-1 ring-[#3B82F6]/40">
						<Sparkles className="h-5 w-5" aria-hidden />
					</span>
					<div className="leading-tight">
						<p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Workspace</p>
						<p className="text-lg font-semibold text-white">LearnSync</p>
					</div>
				</Link>
				<nav className="flex flex-1 flex-col gap-1" aria-label="Primary">
					{nav.map(({ href, label, icon: Icon }) => {
						const active = pathname === href || (href !== "/" && pathname.startsWith(href));
						return (
							<Link
								key={href}
								href={href}
								className={cn(
									"flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
									active
										? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(59,130,246,0.35)]"
										: "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
								)}
							>
								<Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
								{label}
							</Link>
						);
					})}
				</nav>
				<p className="mt-auto px-2 text-xs leading-relaxed text-zinc-500">
					Student focus HUD and teacher analytics dashboard.
				</p>
			</aside>

			<div className="flex min-h-screen min-w-0 flex-1 flex-col">
				<header className="sticky top-0 z-10 border-b border-white/10 bg-[#0B0B0B]/80 backdrop-blur-md">
					<div className="flex h-14 items-center justify-between gap-4 px-4 lg:px-6">
						<p className="text-sm text-zinc-400">
							<span className="text-zinc-200">Workspace</span>
							<span className="mx-2 text-zinc-600">/</span>
							{pathname === "/" ? "Overview" : pathname.replace("/", "")}
						</p>
						<div className="flex items-center gap-3">
							<span className="hidden rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-3 py-1 text-xs font-medium text-[#93C5FD] sm:inline">
								AI syllabus sync
							</span>
							<span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" title="Live" />
						</div>
					</div>
					<nav className="flex items-center gap-1 border-t border-white/10 px-3 py-2 lg:hidden" aria-label="Mobile">
						{nav.map(({ href, label }) => {
							const active = pathname === href || (href !== "/" && pathname.startsWith(href));
							return (
								<Link
									key={href}
									href={href}
									className={cn(
										"rounded-lg px-3 py-1.5 text-xs font-medium transition",
										active ? "bg-[#3B82F6]/20 text-[#93C5FD]" : "text-zinc-400 hover:bg-white/5"
									)}
								>
									{label}
								</Link>
							);
						})}
					</nav>
				</header>
				<main className="flex-1 p-4 lg:p-6">{children}</main>
			</div>
		</div>
	);
}
