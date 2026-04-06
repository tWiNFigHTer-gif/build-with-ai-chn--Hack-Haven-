import type { ReactNode } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppShell } from "../components/layout/AppShell";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata = {
	title: "LearnSync | Dark Academy",
	description: "AI-powered study sync platform"
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
			<body className={`${inter.className} min-h-screen bg-[#0B0B0B] text-zinc-100 antialiased`}>
				<AppShell>{children}</AppShell>
			</body>
		</html>
	);
}
