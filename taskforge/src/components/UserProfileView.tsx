import React, { useState } from "react";
import { motion } from "motion/react";
import { User, Mail, Target, Award, LogOut, Trash2, Save, Sparkles, Compass, CheckCircle } from "lucide-react";
import { UserProfile, Task, Goal } from "../types";

const AVATAR_PRESETS = [
  { id: "avatar-rocket", icon: "🚀", label: "Explorer", bg: "bg-rose-50 border-rose-100" },
  { id: "avatar-robot", icon: "🤖", label: "Synthesizer", bg: "bg-blue-50 border-blue-100" },
  { id: "avatar-brain", icon: "🧠", label: "Thinker", bg: "bg-indigo-50 border-indigo-100" },
  { id: "avatar-target", icon: "🎯", label: "Achiever", bg: "bg-emerald-50 border-emerald-100" },
  { id: "avatar-plant", icon: "🌿", label: "Zen Grower", bg: "bg-amber-50 border-amber-100" },
];

const COACH_STYLES = [
  { id: "balanced", title: "Balanced Strategist", desc: "Equal productivity and rest priority advice." },
  { id: "tough", title: "Disciplined Trainer", desc: "Rigid feedback, continuous accountability checks." },
  { id: "supportive", title: "Mindfulness Companion", desc: "Focuses on stress relief and healthy breathing breaks." },
  { id: "analytical", title: "Quantitative Auditor", desc: "Minute-by-minute breakdown and data metrics." },
];

interface UserProfileViewProps {
  profile: UserProfile;
  tasks: Task[];
  goals: Goal[];
  onUpdateProfile: (updated: UserProfile) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  showToast: (msg: string, type: "success" | "info" | "error") => void;
}

export default function UserProfileView({
  profile,
  tasks,
  goals,
  onUpdateProfile,
  onLogout,
  onDeleteAccount,
  showToast,
}: UserProfileViewProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [focusGoal, setFocusGoal] = useState(profile.focusGoal);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [aiCoachStyle, setAiCoachStyle] = useState(profile.aiCoachStyle);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  // Compute stats for logged in user
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalHabitStreaks = goals.reduce((acc, curr) => acc + curr.streak, 0);
  const totalHabits = goals.length;

  const currentAvatarInfo = AVATAR_PRESETS.find(av => av.id === avatarUrl) || AVATAR_PRESETS[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Full name cannot be blank", "error");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      showToast("Please supply a valid communication email address", "error");
      return;
    }

    onUpdateProfile({
      ...profile,
      name: name.trim(),
      email: email.trim(),
      focusGoal: focusGoal.trim(),
      avatarUrl,
      aiCoachStyle,
    });
    
    showToast("Profile settings synced and saved!", "success");
  };

  return (
    <div className="space-y-6" id="user-profile-viewport">
      {/* Upper Status Banner card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <div className="w-16 h-16 rounded-2xl border border-blue-100 flex items-center justify-center text-3xl bg-blue-50/50 shadow-inner relative">
            <span>{currentAvatarInfo.icon}</span>
            <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-white border border-white text-[10px] font-bold">
              ✓
            </div>
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900" id="profile-banner-name">{profile.name}</h2>
            <p className="text-xs text-slate-400 font-medium">{profile.email} • Joined on {new Date(profile.registeredAt).toLocaleDateString()}</p>
            <div className="mt-2 flex flex-wrap gap-1.5 justify-center md:justify-start">
              <span className="text-[9px] font-black tracking-widest bg-blue-50 border border-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">
                Coach: {profile.aiCoachStyle}
              </span>
              <span className="text-[9px] font-black tracking-widest bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase">
                Goal Focused
              </span>
            </div>
          </div>
        </div>

        {/* Quick Statistics blocks */}
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto" id="profile-counters-grid">
          <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl text-center min-w-[120px]">
            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Completes</div>
            <div className="text-xl font-black text-slate-900 mt-1">{completedTasks} <span className="text-xs text-slate-400">/ {totalTasks}</span></div>
            <div className="w-full bg-slate-200 h-1 mt-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-1 rounded-full" style={{ width: `${taskProgress}%` }} />
            </div>
            <div className="text-[9px] text-blue-600 font-bold mt-1.5">{taskProgress}% task rate</div>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl text-center min-w-[120px]">
            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Active Streaks</div>
            <div className="text-xl font-black text-slate-900 mt-1">{totalHabitStreaks}🔥</div>
            <div className="text-[9px] text-slate-500 font-bold mt-3">{totalHabits} habit tracking rules</div>
          </div>
        </div>
      </div>

      {/* Main Form Fields vs AI style details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Column Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Identity Settings</h3>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Update Profile Card</span>
          </div>

          <form onSubmit={handleSave} className="space-y-5" id="profile-settings-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                    id="profile-name-editable"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                    id="profile-email-editable"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Primary Focus Target</label>
              <div className="relative">
                <Target className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  value={focusGoal}
                  onChange={(e) => setFocusGoal(e.target.value)}
                  placeholder="What is your ultimate strategist constraint?"
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                  id="profile-goal-editable"
                />
              </div>
            </div>

            {/* In-view Avatar Switcher */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Select Profile Avatar</label>
              <div className="flex flex-wrap gap-2.5" id="profile-avatar-swapper">
                {AVATAR_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setAvatarUrl(p.id)}
                    className={`p-2 rounded-xl border text-xl flex flex-col items-center gap-0.5 transition cursor-pointer ${p.bg} ${
                      avatarUrl === p.id 
                        ? "ring-2 ring-blue-600 border-blue-400 scale-105 font-bold" 
                        : "opacity-50 grayscale-[20%] hover:opacity-100"
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span className="text-[8px] font-black text-slate-600 tracking-tighter">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Advisor Selector inside profile view */}
            <div className="space-y-2 pt-2 border-t border-slate-50">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cognitive AI Copilot Persona</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="profile-coach-swapper">
                {COACH_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setAiCoachStyle(style.id as any)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer ${
                      aiCoachStyle === style.id 
                        ? "border-blue-600 ring-1 ring-blue-600/20 bg-blue-50/10" 
                        : "border-slate-200 hover:border-slate-300 bg-slate-50/30"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-slate-800">{style.title}</span>
                      {aiCoachStyle === style.id && <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal font-medium">{style.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4.5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition"
                id="profile-save-btn"
              >
                <Save className="w-3.5 h-3.5" />
                Commit Updates
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Column - System Context and dangerous zone */}
        <div className="space-y-6">
          {/* AI Advisor Info Widget */}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
              <h3 className="text-sm font-black text-white">Active Coach Dynamics</h3>
            </div>
            
            <p className="text-xs text-slate-300 leading-normal font-medium">
              Your preferred strategist format is currently formulated as:
            </p>

            <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-xs space-y-1">
              <span className="text-blue-400 font-extrabold uppercase tracking-wider text-[10px]">
                {aiCoachStyle === "balanced" ? "Balanced Logic Mode" :
                 aiCoachStyle === "tough" ? "Disciplined Drill Sergeant" :
                 aiCoachStyle === "supportive" ? "Zen Stress-Reliever Companion" : "Deep Empirical Quantitative Audit"}
              </span>
              <p className="text-slate-200 leading-relaxed font-normal mt-0.5">
                {aiCoachStyle === "balanced" && "Gemini analyzes task commitments smoothly, offering time-slot suggestions and structured sub-steps without overriding flexible scheduling parameters."}
                {aiCoachStyle === "tough" && "Gemini takes on high-urgency accountability metrics. It strictly tracks deadlines, advises against passive scrolling, and suggests rigid, sequential micro-goals."}
                {aiCoachStyle === "supportive" && "Gemini acts as a reassuring partner to de-escalate workplace panic. It integrates mental pacing comments and suggests optimal breathing rests inside plan breakdowns."}
                {aiCoachStyle === "analytical" && "Gemini extracts numerical complexities. It estimates ideal durations empirically and calculates work-to-rest percentages to optimize brain output of your tasks."}
              </p>
            </div>

            <div className="border-t border-white/10 pt-3 text-[11px] text-slate-400 font-medium">
              The AI Coach dynamically scans your cognitive state configuration dynamically across all tabs in this app to modify suggestions.
            </div>
          </div>

          {/* Dangerous Zone */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-black text-rose-800 uppercase tracking-widest">Destructive Zone</h4>
            <p className="text-[11px] text-slate-500 leading-normal font-medium">
              Actions in this card are verified immediately. If you clear data or reset accounts, your settings cannot be restored safely.
            </p>

            <div className="space-y-3 pt-1">
              <button
                onClick={onLogout}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all"
                id="profile-logout-btn"
              >
                <LogOut className="w-4 h-4 text-slate-500" />
                Sign Out of Current Vibe
              </button>

              {isConfirmDelete ? (
                <div className="space-y-2 p-3 bg-rose-50 border border-rose-100 rounded-xl" id="delete-confirmation-block">
                  <p className="text-[10px] text-rose-800 font-bold leading-normal">
                    Are you absolutely sure? This cleans the active strategist tasks, chats, and goal records permanently.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={onDeleteAccount}
                      className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black cursor-pointer uppercase tracking-wider"
                    >
                      Yes, Purge Workspace
                    </button>
                    <button
                      onClick={() => setIsConfirmDelete(false)}
                      className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-black cursor-pointer uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsConfirmDelete(true)}
                  className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition"
                  id="profile-purge-btn"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  Reset & Purge All Data
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
