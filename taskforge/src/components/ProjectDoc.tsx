import React from "react";
import { BookOpen, CheckCircle, Cpu, FileText, Info, Layers, Layout, ShieldAlert } from "lucide-react";

export default function ProjectDoc() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10" id="project-manifesto-container">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Vibe Coding Competition Submission</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          AI Productivity Companion
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-500">
          A proactive digital executive assistant designed to move users from passive reminders or alert fatigue into meaningful, structured action.
        </p>
      </div>

      {/* Grid containing selected Problem and Solutions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Selected Problem */}
        <div className="bg-rose-50/50 rounded-2xl p-6 border border-rose-100 shadow-sm space-y-4" id="problem-statement-card">
          <div className="inline-flex p-3 bg-rose-100 text-rose-700 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">1. Problem Statement Selected</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Students, professionals, and entrepreneurs frequently miss deadlines, assignments, meetings, bill payments, and critical commitments. 
            Existing productivity tools often rely on standard, passive reminders that are easy to swipe away or ignore, failing to help users actually complete their tasks.
          </p>
          <div className="bg-white rounded-lg p-3 text-xs border border-rose-200/60 text-slate-500 italic">
            "The challenge requires an AI-powered system that proactively assists users in planning, prioritizing, and taking meaningful actions before deadlines are missed."
          </div>
        </div>

        {/* Dynamic Solution */}
        <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-4" id="solution-overview-card">
          <div className="inline-flex p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">2. Solution Overview</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our <strong>AI Productivity Companion</strong> is an ambient full-stack assistant. 
            Instead of simply beeping, it proactively intercepts deadlines to **decompose** tasks into micro-substeps, **recommends** specific scheduling hours, **drafts** copyable message templates (like email templates or code outlines), and conducts interactive **AI coaching** sessions to unblock procrastination.
          </p>
          <div className="bg-white rounded-lg p-3 text-xs border border-emerald-200/60 text-slate-500 italic">
            "Proactive interventions, automatic time-estimation, and structural layout transformations turn commitments into manageable, step-by-step checklists."
          </div>
        </div>
      </div>

      {/* Key Features Block */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6" id="key-features-section">
        <div className="flex items-center space-x-3">
          <div className="p-2 sm:p-3 bg-indigo-100 text-indigo-700 rounded-lg">
            <Layout className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-950">3. Key Features</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Intelligent Task Breakdown
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When adding a task, Gemini decomposes it into actionable checklists and estimates required completion minutes to prevent starting friction.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Dynamic Time-Slot Allocator
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The companion analyzes the due-date and complexity to suggest specific slots (e.g. "Tomorrow 10 AM") directly rendered into an interactive calendar.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Proactive Recommendations Engine
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              A background heuristics processor monitors all streaks and deadlines, flashing tailored Alerts, Insights, and Habits tips to avoid dropoffs.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Autonomous Draft & Plan Generator
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI pre-drafts contextual files (e.g., mail template to unblock homework help, research links, or letters) to bridge the intent-action gap immediately.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Speech-Enabled Visual AI Coach
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              An interactive sidebar with dynamic suggestions chips and speech visualizer indicators, ensuring natural, fast dialogue.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Habit Streaks & Long-term Goals
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Repeated daily or weekly goals with integrated calendar mappings and automated motivation parameters.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack details */}
      <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 sm:p-8 space-y-6" id="technologies-stack-section">
        <div className="flex items-center space-x-3">
          <div className="p-2 sm:p-3 bg-slate-800 text-cyan-400 rounded-xl">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">4. Technologies & Google Ecosystem</h2>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed">
          The app leverages full-stack Node.js + React orchestration, capitalizing heavily on modern Google developer tooling:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Box 1 */}
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50 space-y-2">
            <h3 className="font-bold text-cyan-400 text-sm uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Technologies Used
            </h3>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li><strong>React 19 + TypeScript</strong> for modular, high-performance UI components</li>
              <li><strong>Express.js</strong> serving as full-stack REST API & prompt-pipeline proxies</li>
              <li><strong>Vite + TSX / Esbuild</strong> compiles frontend rapidly and bundles the server</li>
              <li><strong>Tailwind CSS</strong> custom utility styles and responsive interfaces</li>
            </ul>
          </div>

          {/* Box 2 */}
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50 space-y-2">
            <h3 className="font-bold text-indigo-400 text-sm uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Google Technologies Utilized
            </h3>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li><strong>Google Gemini API (@google/genai)</strong>: Drives all reasoning operations server-side</li>
              <li><strong>gemini-3.5-flash model</strong>: Promoted in System Instructions. Outperforms on speed, pricing, and structural JSON parsing</li>
              <li><strong>JSON Schema Enforcement</strong>: Leverages Gemini Structured Output MimeTypes to fully prevent API deserialization crashes</li>
              <li><strong>Web Audio API (Visualizer)</strong>: Simulates real-time microphone activities for the visual AI coaching module</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
