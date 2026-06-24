import React, { useState } from "react";
import { 
  Flame, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Info, 
  Award,
  Sparkles,
  RefreshCw,
  Heart
} from "lucide-react";
import { Goal } from "../types";

interface GoalTrackerProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, "id" | "streak" | "history">) => void;
  onUpdateGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
}

export default function GoalTracker({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal
}: GoalTrackerProps) {
  // Modal states
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [category, setCategory] = useState("Wellness");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddGoal({
      title,
      description,
      frequency,
      category,
      aiRecommendation: "Establish a fixed anchor trigger (e.g., 'Right after my morning coffee') to lock this habit in place, preventing decision fatigue."
    });

    setTitle("");
    setDescription("");
    setFrequency("daily");
    setCategory("Wellness");
    setIsNewOpen(false);
  };

  const handleToggleHabitComplete = (goal: Goal) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const isCompletedStr = goal.history.includes(todayStr);

    let updatedHistory = [...goal.history];
    let newStreak = goal.streak;

    if (isCompletedStr) {
      // Toggle back off
      updatedHistory = updatedHistory.filter(d => d !== todayStr);
      newStreak = Math.max(0, newStreak - 1);
    } else {
      // Log completion
      updatedHistory.push(todayStr);
      newStreak += 1;
      // Trigger a check to see if yesterday was completed
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      // If they haven't logged yesterday or today, streak resumes
    }

    onUpdateGoal({
      ...goal,
      streak: newStreak,
      lastCompleted: isCompletedStr ? undefined : todayStr,
      history: updatedHistory
    });
  };

  return (
    <div className="space-y-6" id="goal-tracker-root">
      
      {/* Header card with metrics overview */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-slate-900">Habit Streaks & Long-term Goals</h2>
          <p className="text-xs text-slate-500">Log repeated micro-tasks daily or weekly and stack continuous momentum.</p>
        </div>

        <button 
          onClick={() => setIsNewOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 self-start sm:self-center"
          id="open-add-habit-modal"
        >
          <Plus className="w-4 h-4" />
          Define Habit
        </button>
      </div>

      {/* Habits list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="habits-cards-grid">
        {goals.length === 0 ? (
          <div className="md:col-span-2 py-16 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200 space-y-2">
            <Flame className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="text-sm font-semibold">No habits listed yet.</p>
            <p className="text-xs">Establish repeated commitments to train automation loops!</p>
          </div>
        ) : (
          goals.map((goal) => {
            const todayStr = new Date().toISOString().split('T')[0];
            const isDoneToday = goal.history.includes(todayStr);

            return (
              <div 
                key={goal.id} 
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition duration-200"
                id={`habit-card-${goal.id}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                      {goal.category} • {goal.frequency}
                    </span>

                    {/* Streak flame badge */}
                    <div className="flex items-center gap-1 text-amber-600 font-bold text-xs" title={`${goal.streak} days continuous streak!`}>
                      <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>{goal.streak} Day Streak</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">{goal.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{goal.description}</p>
                  </div>

                  {/* AI Anchored Trigger/Advice if present */}
                  {goal.aiRecommendation && (
                    <div className="p-2.5 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-2 text-xs text-slate-600">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="leading-relaxed font-medium">
                        <span className="font-bold text-blue-950">AI Anchor Strategy:</span> {goal.aiRecommendation}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 mt-4 pt-3 text-xs">
                  <button 
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition"
                    title="Discontinue Habit"
                    id={`delete-goal-${goal.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button 
                    onClick={() => handleToggleHabitComplete(goal)}
                    className={`font-semibold inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border transition ${
                      isDoneToday
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-slate-900 border-slate-900 text-white hover:bg-slate-800"
                    }`}
                    id={`toggle-complete-goal-${goal.id}`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isDoneToday ? "Logged Today" : "Log Completion"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* NEW HABIT CREATOR MODAL */}
      {isNewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4" id="habit-creator-modal">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 overflow-hidden shadow-xl">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-sm uppercase tracking-wide">Define Repeated Habit</h3>
              <button 
                onClick={() => setIsNewOpen(false)}
                className="text-slate-400 hover:text-white"
                id="close-habit-modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Habit Title *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Write 500 words draft, Review Next-Day Action plan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="habit-title-input"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Detailed intention statement</label>
                <textarea 
                  placeholder="Describe your motivation or conditions to lock habit triggers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 h-16 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="habit-desc-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Cadence Loop</label>
                  <select 
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly')}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    id="habit-freq-select"
                  >
                    <option value="daily">Daily Loop</option>
                    <option value="weekly">Weekly Loop</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Category Group</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    id="habit-cat-select"
                  >
                    <option value="Wellness">Wellness & Health</option>
                    <option value="Career">Career & Skill</option>
                    <option value="Finance">Financial Care</option>
                    <option value="Productivity">Personal Systems</option>
                  </select>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsNewOpen(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-4 py-2 rounded-lg"
                  id="cancel-habit-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg"
                  id="submit-habit-btn"
                >
                  Define Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
