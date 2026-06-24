import React, { useState } from "react";
import { 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  AlertTriangle, 
  HelpCircle, 
  RotateCw, 
  ArrowRight,
  Flame,
  X,
  Plus
} from "lucide-react";
import { Task, Goal, ProductivityRecommendation } from "../types";

interface DashboardOverviewProps {
  tasks: Task[];
  goals: Goal[];
  recommendations: ProductivityRecommendation[];
  loadingRecommendations: boolean;
  refreshRecommendations: () => void;
  onExecuteRecommendation: (actionableId: string, actionLabel: string, type: string) => void;
  onNavigateToTab: (tab: string) => void;
  onQuickAddTask: () => void;
}

export default function DashboardOverview({
  tasks,
  goals,
  recommendations,
  loadingRecommendations,
  refreshRecommendations,
  onExecuteRecommendation,
  onNavigateToTab,
  onQuickAddTask
}: DashboardOverviewProps) {
  // Simple state to dismiss a local recommendation alert
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const activeTasks = tasks.filter(t => t.status !== "completed");
  const completedTasksCount = tasks.filter(t => t.status === "completed").length;
  
  // Calculate completion percentage
  const totalTasks = tasks.length;
  const progressRatio = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  // Active urgency alert
  const urgentTasks = activeTasks.filter(t => t.priority === "high");

  // Sum up all habit streaks
  const totalStreaksCount = goals.reduce((acc, current) => acc + current.streak, 0);

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedIds(prev => [...prev, id]);
  };

  const visibleRecommendations = recommendations.filter(r => !dismissedIds.includes(r.id));

  return (
    <div className="space-y-6" id="dashboard-overview-root">
      
      {/* Dynamic Welcome & High Alert Banner */}
      <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm" id="welcome-banner">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-blue-400" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-500/10 text-blue-400 border border-blue-400/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              ✦ AI-Powered Cognitive Architecture
            </span>
            <div className="flex items-center space-x-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-400">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Voice AI Active</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            TaskForge
          </h2>
          <p className="text-xs text-blue-400 font-extrabold tracking-wider uppercase mt-1">
            Forge Productivity, Finish Strong
          </p>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
            Proactive cognitive execution paths tailored dynamically. Rather than simple, reactive notifications, our platform decomposes milestones, forecasts optimal time slots, and creates custom communication blueprints.
          </p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            <button 
              onClick={onQuickAddTask}
              className="bg-white text-slate-900 hover:bg-slate-100 transition font-bold text-xs px-5 py-3 rounded-xl inline-flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              id="banner-add-task-btn"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              New Action Commitment
            </button>
            <button 
              onClick={() => onNavigateToTab("companion")}
              className="bg-slate-900 hover:bg-slate-800 transition font-bold text-xs px-5 py-3 rounded-xl border border-slate-800 text-white inline-flex items-center gap-2 cursor-pointer"
              id="banner-ask-ai-btn"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              Start Dynamic Strategist Coach
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-bento-grid">
        
        {/* Stat 1: Total Completion Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between" id="stat-rate-card">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Completion Rate</p>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{progressRatio}%</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span className="text-emerald-500 font-medium inline-flex items-center">{completedTasksCount} done</span>
              / {totalTasks} total commitments
            </p>
          </div>
          {/* Custom SVG Ring Progress */}
          <div className="relative w-14 h-14">
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                cx="28" cy="28" r="24" 
                className="text-slate-100" 
                strokeWidth="4" 
                stroke="currentColor" 
                fill="transparent" 
              />
              <circle 
                cx="28" cy="28" r="24" 
                className="text-[#3b82f6] transition-all duration-500 ease-out" 
                strokeWidth="4" 
                strokeDasharray={`${2 * Math.PI * 24}`} 
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - progressRatio / 100)}`}
                strokeLinecap="round" 
                stroke="currentColor" 
                fill="transparent" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-900">
              {completedTasksCount}/{totalTasks}
            </div>
          </div>
        </div>

        {/* Stat 2: Active Commitments */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between" id="stat-active-card">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Commitments</p>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{activeTasks.length}</h3>
            <p className="text-xs text-slate-500">
              Tasks needing manual completion
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3: Habit Streak */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between" id="stat-streak-card">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Habits Momentum</p>
            <h3 className="text-3xl font-extrabold text-amber-600 tracking-tight flex items-center gap-1.5">
              <Flame className="w-7 h-7 text-amber-500 fill-amber-500" />
              {totalStreaksCount}
            </h3>
            <p className="text-xs text-slate-500">
              Total combined daily streak counters
            </p>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 4: High Priority */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between" id="stat-urgent-card">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">High Priority Alerts</p>
            <h3 className="text-3xl font-extrabold text-rose-600 tracking-tight">{urgentTasks.length}</h3>
            <p className="text-xs text-slate-500">
              Items requiring immediate attention
            </p>
          </div>
          <div className="bg-rose-50 p-3 rounded-lg text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Content Split: AI Recommendations Block and Upcoming Tasks overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="bento-split-section">
        
        {/* Column 1 & 2: Proactive Recommendations Powered by Gemini */}
        <div className="lg:col-span-2 bg-gradient-to-b from-blue-50/20 to-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4" id="ai-recommendations-column">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Personalized Proactive Actions</h2>
            </div>
            <button 
              onClick={refreshRecommendations}
              disabled={loadingRecommendations}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl disabled:opacity-50"
              id="refresh-ai-recs-btn"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loadingRecommendations ? 'animate-spin' : ''}`} />
              Re-Analyze Context
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Our background AI model tracks due dates, streaks, and descriptions. Rather than simple beeps, it targets friction by creating instant shortcuts:
          </p>

          {loadingRecommendations ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3" id="recommendations-loading-state">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-blue-800 animate-pulse">Gemini is analyzing commit urgency...</p>
              <p className="text-xs text-slate-405 max-w-xs text-center font-medium">Reading high-priority tasks and habit logs to formulate smart starting guides.</p>
            </div>
          ) : visibleRecommendations.length === 0 ? (
            <div className="bg-white/80 p-6 rounded-xl border border-blue-100 text-center space-y-2 py-8" id="recommendations-empty-state">
              <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-full">
                <CheckCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">Your Slate is Clear!</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                No urgencies detected. Try adding new high-priority tasks or habits, then click &quot;Re-Analyze Context&quot;.
              </p>
            </div>
          ) : (
            <div className="space-y-3" id="recommendations-list">
              {visibleRecommendations.map((recom) => {
                const isAlert = recom.type === "alert";
                const isInsight = recom.type === "insight";
                
                return (
                  <div 
                    key={recom.id}
                    className={`p-4 rounded-xl border transition-all hover:translate-x-0.5 duration-200 flex flex-col sm:flex-row items-start justify-between gap-4 ${
                      isAlert 
                        ? 'bg-rose-50/60 border-rose-100 text-rose-950' 
                        : isInsight 
                          ? 'bg-amber-50/60 border-amber-100 text-amber-950' 
                          : 'bg-white border-slate-205 text-slate-900 shadow-sm'
                    }`}
                    id={`recom-card-${recom.id}`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                          isAlert ? 'bg-rose-500 animate-pulse' : isInsight ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        <h4 className="font-bold text-sm tracking-tight">{recom.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{recom.message}</p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto self-end sm:self-center">
                      <button 
                        onClick={() => recom.actionableId && onExecuteRecommendation(recom.actionableId, recom.actionLabel || "View", recom.type)}
                        className={`text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap shadow-sm w-full sm:w-auto justify-center transition-all ${
                          isAlert 
                            ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                            : isInsight 
                              ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                              : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                        id={`recom-cta-${recom.id}`}
                      >
                        {recom.actionLabel || "Take Action"}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      
                      <button 
                        onClick={(e) => handleDismiss(recom.id, e)}
                        className="p-2 border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                        title="Dismiss"
                        id={`recom-dismiss-${recom.id}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Prompt Guide for the user */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-start gap-2.5 text-xs text-slate-500 hover:shadow-xs transition" id="ai-recs-footer-tip">
            <HelpCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div>
              <span className="font-bold text-slate-700">Cognitive Engine Mode:</span> Our Express backend parses actual user logs with <strong>gemini-3.5-flash</strong> using structured compliance parameters. Keep streaks high to shield peak focus momentum!
            </div>
          </div>
        </div>

        {/* Column 3: Upcoming Urgent Deadlines */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4" id="upcoming-commitments-column">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block"></span>
            Urgent Priorities
          </h2>

          <div className="space-y-3" id="urgent-tasks-sublist">
            {urgentTasks.slice(0, 4).length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400" id="no-urgent-tasks-placeholder">
                <p>No high-priority tasks are active. You&apos;re doing great!</p>
              </div>
            ) : (
              urgentTasks.slice(0, 4).map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => {
                    onNavigateToTab("tasks");
                    // Trigger custom highlight or let them click it
                  }}
                  className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100/70 border border-slate-100 cursor-pointer transition space-y-1"
                  id={`dashboard-task-preview-${task.id}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      task.category === 'bill' ? 'bg-amber-105 text-amber-800' :
                      task.category === 'meeting' ? 'bg-blue-100 text-blue-800' :
                      task.category === 'interview' ? 'bg-violet-100 text-violet-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {task.category}
                    </span>
                    <span className="text-[10px] font-semibold text-rose-600">
                      Due: {task.deadline}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-805 truncate">{task.title}</h4>
                  {task.substeps && task.substeps.length > 0 && (
                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Checklist: {task.substeps.filter(s => s.completed).length}/{task.substeps.length} done</span>
                      <span>~{task.estimatedMinutes}m</span>
                    </div>
                  )}
                </div>
              ))
            )}
            
            <button 
              onClick={() => onNavigateToTab("tasks")}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition w-full text-center py-2 bg-slate-50 rounded-xl hover:bg-blue-50/50 border border-dashed border-slate-300 block cursor-pointer"
              id="view-all-commits-btn"
            >
              Open Full Workboard
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
