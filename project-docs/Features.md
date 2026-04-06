# Features.md: LearnSync

## 1. Project Overview
**Project Name:** LearnSync
**Tagline:** The AI-Driven Academic Operating System for Focused Learning.
**Theme:** Sustainable Futures (Focus: Human Capital & Educational Resilience).

**Purpose:** LearnSync is a high-performance educational ecosystem that acts as the "cognitive thread" between a student’s independent study and a teacher’s classroom instruction. It provides students with AI-optimized focus tools and Socratic support while giving teachers forensic data to automate revision strategies.

---

## 2. Problem Statement
* **The "Friction Wall" (Student):** Students hitting mental blocks during independent study often lose focus entirely. Traditional chatbots provide direct answers, which bypasses the learning process.
* **Planning Paralysis (Student):** Students struggle to prioritize study topics based on syllabus weightage and their own personal weaknesses.
* **Instructional Blindness (Teacher):** Teachers have no data on student struggles outside the classroom, leading to inefficient revision sessions.

---

## 3. Objectives and Goals
* **Maintain Flow State:** Keep students in a "Deep Work" state through Socratic coaching (hints, not answers).
* **Adaptive Navigation:** Provide AI-generated timetables and dynamic to-do lists that evolve based on student progress and syllabus weightage.
* **Data-Driven Pedagogy:** Identify class-wide conceptual gaps to automate teacher revision plans and reduce instructional burnout.

---

## 4. Target Users
* **The Proactive Student:** Needs a distraction-free environment, syllabus-aligned guidance, and automated task prioritization.
* **The Strategic Teacher:** Wants to maximize classroom impact by automating gap identification and worksheet generation.

---

## 5. Core Features (8-Hour MVP Scope)

### 5.1 Student "Deep Work" HUD
* **High-Focus Timer:** A minimalist, distraction-free digital timer designed for "Monk Mode" study sessions.
* **Peer Pulse (Live Telemetry):** A real-time counter showing the number of active peers studying within the same syllabus branch to foster a competitive environment.
* **Syllabus Timetable Generator:** One-click generation of a study plan based on exam dates and hardcoded syllabus weightage.
* **AI-Dynamic To-Do List:** An editable task list where the AI automatically injects "Review" tasks if a student fails a doubt in a specific topic.
* **Socratic Doubt Capture:** A multimodal (Vision) interface where students upload photos of problems to receive syllabus-locked hints.

### 5.2 Teacher "Oracle" Dashboard
* **Friction Heatmap:** A visual dashboard (Recharts) aggregating student doubts into visual "Red Zones" of conceptual failure.
* **Automated Revision Sheets:** Instant generation of model papers targeting the specific weak topics identified in the heatmap.
* **Sustainable Report Cards:** PDF generation (jsPDF) summarizing study hours, conceptual mastery, and cognitive load scores.

---

## 6. User Flows

### 6.1 Student Flow
`Open HUD` $\rightarrow$ `Generate Timetable` $\rightarrow$ `Start Timer` $\rightarrow$ `Hit Friction` $\rightarrow$ `Capture Doubt` $\rightarrow$ `Get Socratic Hint` $\rightarrow$ `AI Updates To-Do List`.

### 6.2 Teacher Flow
`View Analytics` $\rightarrow$ `Identify Weak Topics (Red Zones)` $\rightarrow$ `Generate Revision Sheet` $\rightarrow$ `Export Performance Reports`.

---

## 7. Success Metrics
* **Instructional Efficiency:** Reclaiming $\approx 66\%$ of classroom revision time by eliminating manual "Gap Identification".
* **Response Latency:** Multimodal hints and schedule updates delivered in $<2$ seconds via Gemini 1.5 Flash.
* **Systemic Loop Integrity:** Proof of student "Struggle Data" directly influencing the teacher's generated revision materials.

---

## 8. Technical Stack
* **Frontend:** Next.js (App Router), Tailwind CSS, Shadcn UI.
* **Intelligence:** Google Gemini 1.5 Flash (Multimodal Vision + JSON Mode).
* **Real-time Data:** Firebase (Firestore for doubt logs, Realtime DB for "Peer Pulse").
* **File Export:** jsPDF (for Reports and Question Papers).

---

## 9. Constraints and Assumptions
* **Stateless Logic:** Timetables and To-Do edits are generated on-the-fly via LLM prompts to avoid complex database state management.
* **Hardcoded Context:** The AI is pre-loaded with specific syllabus context to ensure 100% demo stability.
* **Auth Bypass:** Uses hardcoded demo personas to bypass login friction during the hackathon pitch.

---

## 10. AI System Instructions (System Prompt)
"You are the LearnSync engine. When a student uploads a doubt, identify the syllabus topic and provide a Socratic hint. Output a hidden JSON command: `{"action": "UPDATE_TODO", "item": "Review [Topic]", "priority": "High"}`. When a teacher requests a revision sheet, generate model questions based on the highest-frequency topics in the doubt logs."