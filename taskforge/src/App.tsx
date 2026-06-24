import React, { useState, useEffect } from "react";
import { 
  CheckSquare, 
  Flame, 
  Calendar, 
  Bot, 
  BookOpen, 
  Sparkles, 
  Clock, 
  AlertTriangle,
  Info,
  X,
  BellRing,
  User
} from "lucide-react";

// Import types
import { Task, Goal, ProductivityRecommendation, ChatMessage, UserProfile, UserAccount } from "./types";

// Import subcomponents
import DashboardOverview from "./components/DashboardOverview";
import TaskBoard from "./components/TaskBoard";
import GoalTracker from "./components/GoalTracker";
import CalendarView from "./components/CalendarView";
import AIChatPanel from "./components/AIChatPanel";
import ProjectDoc from "./components/ProjectDoc";
import AuthScreen from "./components/AuthScreen";
import UserProfileView from "./components/UserProfileView";

// Standard preset Mock data to kickstart application
const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Finish financial project proposal slides",
    category: "work",
    priority: "high",
    deadline: "2026-06-25 10:00",
    status: "todo",
    description: "Prepare and structure market size research, budget estimations, and core technical timeline for energy presentation.",
    createdAt: new Date().toISOString(),
    estimatedMinutes: 60,
    substeps: [],
    suggestedTimeSlot: "Tomorrow at 10:00 AM",
    actionPlanDraft: `# PRE-DRAFT OUTLINE FOR PROJECT ENERGY
## Target: Core Executive Team
- **Stage 1 (First 15 mins)**: Review 2025 financial spreadsheet summaries.
- **Stage 2 (Next 25 mins)**: Detail regional market expansion plans.
- **Stage 3 (Final 20 mins)**: Align engineering milestones.
`
  },
  {
    id: "task-2",
    title: "Quarterly broadband internet subscription dues",
    category: "bill",
    priority: "medium",
    deadline: "2026-06-26 23:59",
    status: "todo",
    description: "Log into ISP portal, review speed allocation metrics, and process transaction to preserve active SLA.",
    createdAt: new Date().toISOString(),
    estimatedMinutes: 10,
    substeps: [],
    suggestedTimeSlot: "Friday afternoon",
    actionPlanDraft: `Dear Service Provider,
Ref: Account ID #8234-METRO.
Please process the autopay extension for the premium fiber line. Receipts should go to gamersarena04@gmail.com.`
  },
  {
    id: "task-3",
    title: "Academic assignment review & feedback loop",
    category: "personal",
    priority: "low",
    deadline: "2026-06-28 12:00",
    status: "completed",
    description: "Read peer feedback regarding the AI system modeling project and integrate suggestions.",
    estimatedMinutes: 30,
    substeps: [
      { id: "sub-1", text: "Download peer review PDF folder", completed: true },
      { id: "sub-2", text: "Contrast core algorithms suggestions", completed: true }
    ],
    createdAt: new Date().toISOString(),
  }
];

const INITIAL_GOALS: Goal[] = [
  {
    id: "goal-1",
    title: "Daily algorithm training & problem solving",
    description: "Complete 1 logic scenario to maintain pattern recognition and prepare for interview panels.",
    frequency: "daily",
    category: "Career",
    streak: 4,
    lastCompleted: "",
    history: [],
    aiRecommendation: "Perform this immediately before looking at messages or slack/email. Keeps your cognitive focus clean."
  },
  {
    id: "goal-2",
    title: "Daily 3-Task prioritization audit",
    description: "Log evening plans for the following day. Select precisely three high priorities.",
    frequency: "daily",
    category: "Productivity",
    streak: 12,
    lastCompleted: new Date().toISOString().split("T")[0],
    history: [new Date().toISOString().split("T")[0]],
    aiRecommendation: "Anchor right after dinner. Writing options down releases pressure so you sleep deeper."
  }
];

const INITIAL_RECOMMENDATIONS: ProductivityRecommendation[] = [
  {
    id: "rec-1",
    title: "Shield habit streak",
    message: "Your 'Daily algorithm training & problem solving' habit hasn't been completed yet today. Retain your 4-day continuous streak!",
    type: "insight",
    actionableId: "goal-1",
    actionLabel: "Log Completion",
    timestamp: new Date().toISOString()
  },
  {
    id: "rec-2",
    title: "Imminent Slide project deadline",
    message: "Your 'Finish financial project proposal slides' task is due in 3 days. We decomposed this into 4 actionable macro-stages.",
    type: "alert",
    actionableId: "task-1",
    actionLabel: "View Blueprint",
    timestamp: new Date().toISOString()
  }
];

const getSafeLocalStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn("Storage access failed inside sandboxed iframe context:", e);
    return null;
  }
};

const setSafeLocalStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn("Storage save failed inside sandboxed iframe context:", e);
  }
};

const DEFAULT_ACCOUNT: UserAccount = {
  profile: {
    id: "user-default-1",
    name: "Gamers Arena HQ",
    email: "gamersarena04@gmail.com",
    avatarUrl: "avatar-robot",
    aiCoachStyle: "balanced",
    focusGoal: "Coordinate next-generation Vibe Plan",
    registeredAt: new Date().toISOString(),
  },
  passwordHash: "password",
};

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // User Authentication & Profiles state
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const cached = getSafeLocalStorage("ai_companion_accounts");
    return cached ? JSON.parse(cached) : [DEFAULT_ACCOUNT];
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const cached = getSafeLocalStorage("ai_companion_current_user");
    return cached ? JSON.parse(cached) : null;
  });

  // State collections (hydrated reactively based on active profile)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recommendations, setRecommendations] = useState<ProductivityRecommendation[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Loaders
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [generatingPlanTaskId, setGeneratingPlanTaskId] = useState<string | null>(null);

  // Quick toast messages
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  // Sync general accounts and session
  useEffect(() => {
    setSafeLocalStorage("ai_companion_accounts", JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (currentUser) {
      setSafeLocalStorage("ai_companion_current_user", JSON.stringify(currentUser));
    } else {
      try {
        localStorage.removeItem("ai_companion_current_user");
      } catch (e) {}
    }
  }, [currentUser]);

  // Reactive Data Hydration for multi-user session isolation
  useEffect(() => {
    if (!currentUser) return;

    const taskKey = `ai_companion_tasks_${currentUser.id}`;
    const cachedTasks = getSafeLocalStorage(taskKey);
    if (cachedTasks) {
      setTasks(JSON.parse(cachedTasks));
    } else {
      setTasks(currentUser.email === "gamersarena04@gmail.com" ? INITIAL_TASKS : []);
    }

    const goalKey = `ai_companion_goals_${currentUser.id}`;
    const cachedGoals = getSafeLocalStorage(goalKey);
    if (cachedGoals) {
      setGoals(JSON.parse(cachedGoals));
    } else {
      setGoals(currentUser.email === "gamersarena04@gmail.com" ? INITIAL_GOALS : []);
    }

    const recKey = `ai_companion_recommendations_${currentUser.id}`;
    const cachedRecs = getSafeLocalStorage(recKey);
    if (cachedRecs) {
      setRecommendations(JSON.parse(cachedRecs));
    } else {
      setRecommendations(currentUser.email === "gamersarena04@gmail.com" ? INITIAL_RECOMMENDATIONS : []);
    }

    const chatKey = `ai_companion_chats_${currentUser.id}`;
    const cachedChats = getSafeLocalStorage(chatKey);
    if (cachedChats) {
      setChatHistory(JSON.parse(cachedChats));
    } else {
      const welcomeText = `Hello ${currentUser.name}! I am your AI Strategist configured with a **${currentUser.aiCoachStyle}** tactical methodology. How can I help decompose your day?`;
      setChatHistory([
        {
          id: "welcome-1",
          sender: "ai",
          text: welcomeText,
          timestamp: new Date().toISOString(),
          suggestions: ["Examine overdue commitments", "Draft action plans", "Calibrate target streaks"]
        }
      ]);
    }
  }, [currentUser?.id]);

  // Sync to localstorage with account specificity
  useEffect(() => {
    if (currentUser) {
      setSafeLocalStorage(`ai_companion_tasks_${currentUser.id}`, JSON.stringify(tasks));
    }
  }, [tasks, currentUser?.id]);

  useEffect(() => {
    if (currentUser) {
      setSafeLocalStorage(`ai_companion_goals_${currentUser.id}`, JSON.stringify(goals));
    }
  }, [goals, currentUser?.id]);

  useEffect(() => {
    if (currentUser) {
      setSafeLocalStorage(`ai_companion_recommendations_${currentUser.id}`, JSON.stringify(recommendations));
    }
  }, [recommendations, currentUser?.id]);

  useEffect(() => {
    if (currentUser) {
      setSafeLocalStorage(`ai_companion_chats_${currentUser.id}`, JSON.stringify(chatHistory));
    }
  }, [chatHistory, currentUser?.id]);

  // Auth Operations handlers
  const handleLoginSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    showToast(`Welcome back, ${profile.name}! Status: Synced`, "success");
    setActiveTab("dashboard");
  };

  const handleRegisterAccount = (newAccount: UserAccount) => {
    setAccounts((prev) => [newAccount, ...prev]);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setCurrentUser(updatedProfile);
    // Sync into details roster as well
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.profile.id === updatedProfile.id ? { ...acc, profile: updatedProfile } : acc
      )
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast("Session closed. Returning to gateway...", "info");
  };

  const handleDeleteAccount = () => {
    if (!currentUser) return;
    const deletedId = currentUser.id;
    
    // Clean specific collections
    try {
      localStorage.removeItem(`ai_companion_tasks_${deletedId}`);
      localStorage.removeItem(`ai_companion_goals_${deletedId}`);
      localStorage.removeItem(`ai_companion_recommendations_${deletedId}`);
      localStorage.removeItem(`ai_companion_chats_${deletedId}`);
    } catch (e) {}

    setAccounts((prev) => prev.filter((acc) => acc.profile.id !== deletedId));
    setCurrentUser(null);
    showToast("Workspace wiped successfully.", "info");
  };

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // REST CALL: Add commitment and trigger active decomposition with Gemini
  const handleAddTask = async (
    newTaskData: Omit<Task, "id" | "createdAt" | "substeps" | "estimatedMinutes" | "status"> & { generateAI: boolean }
  ) => {
    const { title, description, category, priority, deadline, generateAI } = newTaskData;
    
    // Create baseline local shell
    const newId = "task-" + Math.random().toString(36).substr(2, 9);
    const tempTask: Task = {
      id: newId,
      title,
      description,
      category,
      priority,
      deadline,
      status: "todo",
      substeps: [],
      estimatedMinutes: 30,
      createdAt: new Date().toISOString()
    };

    // Append instantly so their UI is responsive
    setTasks(prev => [tempTask, ...prev]);
    showToast("Commitment recorded local-state", "info");

    if (generateAI) {
      setGeneratingPlanTaskId(newId);
      try {
        const response = await fetch("/api/generate-substeps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, category, deadline })
        });

        if (!response.ok) throw new Error("Server payload crash");
        const details = await response.json();

        // Map checklist to unique IDs
        const formattedSubsteps = (details.substeps || []).map((text: string) => ({
          id: "sub-" + Math.random().toString(36).substr(2, 9),
          text,
          completed: false
        }));

        setTasks(prev => 
          prev.map(t => t.id === newId ? {
            ...t,
            substeps: formattedSubsteps,
            estimatedMinutes: details.estimatedMinutes || 45,
            suggestedTimeSlot: details.suggestedTimeSlot,
            actionPlanDraft: details.actionPlanDraft
          } : t)
        );

        showToast("Gemini parsed task checkpoints!", "success");
      } catch (error) {
        console.error("AI breakdown failed", error);
        showToast("AI assistant offline. Proceeding manually", "error");
      } finally {
        setGeneratingPlanTaskId(null);
      }
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast("Commitment discarded.");
  };

  // Manual Trigger: Generates/Re-generates substeps and outlines for existing tasks
  const handleTriggerAIPlan = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setGeneratingPlanTaskId(taskId);
    showToast("Querying Gemini prioritization matrix...", "info");

    try {
      const response = await fetch("/api/generate-substeps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          category: task.category,
          deadline: task.deadline
        })
      });

      if (!response.ok) throw new Error("Substeps API failed");
      const details = await response.json();

      const formattedSubsteps = (details.substeps || []).map((text: string) => ({
        id: "sub-" + Math.random().toString(36).substr(2, 9),
        text,
        completed: false
      }));

      setTasks(prev => 
        prev.map(t => t.id === taskId ? {
          ...t,
          substeps: formattedSubsteps,
          estimatedMinutes: details.estimatedMinutes || 45,
          suggestedTimeSlot: details.suggestedTimeSlot,
          actionPlanDraft: details.actionPlanDraft
        } : t)
      );

      showToast("Checkpoints updated successfully!");
    } catch (e) {
      console.error(e);
      showToast("Failed to formulate new AI checklist.", "error");
    } finally {
      setGeneratingPlanTaskId(null);
    }
  };

  // REST CALL: Generate context recommendations using user's actual items list
  const handleRefreshRecommendations = async () => {
    setLoadingRecommendations(true);
    showToast("Gemini is reading task compliance ratios...", "info");

    try {
      const response = await fetch("/api/generate-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks,
          goals,
          currentTime: new Date().toLocaleString()
        })
      });

      if (!response.ok) throw new Error("Recommendations service crash");
      const data = await response.json();

      if (data.recommendations) {
        // Map unique IDs
        const parsed = data.recommendations.map((r: any) => ({
          id: "rec-" + Math.random().toString(36).substr(2, 9),
          title: r.title,
          message: r.message,
          type: r.type,
          actionableId: r.actionableId,
          actionLabel: r.actionLabel,
          timestamp: new Date().toISOString()
        }));

        setRecommendations(parsed);
        showToast("Tailored proactive alerts updated!", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to refresh recommendations.", "error");
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Execute recommendation shortcut CTA
  const handleExecuteRecommendation = (actionableId: string, actionLabel: string, type: string) => {
    if (actionLabel.toLowerCase().includes("log") && type === "insight") {
      // Find goal and complete it
      const targetGoal = goals.find(g => g.id === actionableId);
      if (targetGoal) {
        const todayStr = new Date().toISOString().split("T")[0];
        if (!targetGoal.history.includes(todayStr)) {
          const updatedHistory = [...targetGoal.history, todayStr];
          setGoals(prev => prev.map(g => g.id === actionableId ? {
            ...g,
            streak: g.streak + 1,
            lastCompleted: todayStr,
            history: updatedHistory
          } : g));
          showToast("Streak updated from recommendations short-circuit!", "success");
        } else {
          showToast("Intention already checked off for today!");
        }
      }
    } else {
      // General task lookup, redirect directly to board
      setActiveTab("tasks");
    }
  };

  const handleAddGoal = (newGoalData: Omit<Goal, "id" | "streak" | "history">) => {
    const nid = "goal-" + Math.random().toString(36).substr(2, 9);
    const newObj: Goal = {
      ...newGoalData,
      id: nid,
      streak: 0,
      history: []
    };
    setGoals(prev => [newObj, ...prev]);
    showToast("Habit loop defined. Good luck!");
  };

  const handleUpdateGoal = (updated: Goal) => {
    setGoals(prev => prev.map(g => g.id === updated.id ? updated : g));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    showToast("Habit loop discontinued.");
  };

  // REST CALL: Conversational chat with full tasks and goals sync
  const handleSendMessage = async (rawMessage: string) => {
    const userMsg: ChatMessage = {
      id: "msg-" + Math.random().toString(36).substr(2, 9),
      sender: "user",
      text: rawMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setLoadingChat(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: rawMessage,
          chatHistory,
          tasks,
          goals
        })
      });

      if (!response.ok) throw new Error("Chat model timed out.");
      const details = await response.json();

      const aiMsg: ChatMessage = {
        id: "msg-" + Math.random().toString(36).substr(2, 9),
        sender: "ai",
        text: details.text || "I was unable to analyze your current dashboard priorities. Please type your target query.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: details.suggestions || []
      };

      setChatHistory(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      showToast("Companion connection timeout.", "error");
    } finally {
      setLoadingChat(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans tracking-tight text-slate-900 flex flex-col justify-center py-12 relative">
        {toast && (
          <div 
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-xl shadow-lg border text-xs font-semibold flex items-center justify-between gap-3 animate-fade-in ${
              toast.type === "success" ? "bg-blue-50 border-blue-200 text-blue-800" :
              toast.type === "error" ? "bg-rose-50 border-rose-250 text-rose-800" : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
            id="toast-notification"
          >
            <div className="flex items-center gap-1.5">
              <BellRing className="w-4 h-4 text-blue-600 animate-bounce" />
              <span>{toast.message}</span>
            </div>
            <button onClick={() => setToast(null)} className="opacity-60 hover:opacity-100 font-extrabold pb-0.5">✕</button>
          </div>
        )}
        <AuthScreen 
          onLoginSuccess={handleLoginSuccess}
          existingAccounts={accounts}
          onRegisterAccount={handleRegisterAccount}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans tracking-tight text-slate-900 flex flex-col justify-between">
      
      {/* Toast Notification block */}
      {toast && (
        <div 
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-xl shadow-lg border text-xs font-semibold flex items-center justify-between gap-3 animate-fade-in ${
            toast.type === "success" ? "bg-blue-50 border-blue-200 text-blue-800" :
            toast.type === "error" ? "bg-rose-50 border-rose-250 text-rose-800" : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
          id="toast-notification"
        >
          <div className="flex items-center gap-1.5">
            <BellRing className="w-4 h-4 text-blue-600 animate-bounce" />
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="opacity-60 hover:opacity-100 font-extrabold pb-0.5">✕</button>
        </div>
      )}

      {/* Main Structural Layout Wrapper */}
      <div className="flex flex-col flex-1">
        
        {/* Horizontal Nav Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30" id="main-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              
              {/* Launcher Logotype */}
              <div className="flex items-center space-x-2.5">
                <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-sm flex items-center justify-center">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-950 flex flex-col lg:flex-row lg:items-center gap-1.5">
                    <span>TaskForge</span>
                    <span className="bg-blue-50 border border-blue-100 text-blue-700 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase sm:inline-block hidden">
                      AI Active: {currentUser.aiCoachStyle} Coach
                    </span>
                  </span>
                </div>
              </div>

              {/* Central Nav Rails */}
              <nav className="hidden md:flex bg-slate-100 p-1 rounded-xl border border-slate-200/50 space-x-0.5" id="desktop-nav-rails">
                <button 
                  onClick={() => setActiveTab("dashboard")}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                    activeTab === "dashboard" ? "bg-white text-blue-600 shadow-sm font-extrabold" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setActiveTab("tasks")}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                    activeTab === "tasks" ? "bg-white text-blue-600 shadow-sm font-extrabold" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Board
                </button>
                <button 
                  onClick={() => setActiveTab("habits")}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                    activeTab === "habits" ? "bg-white text-blue-600 shadow-sm font-extrabold" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Habits
                </button>
                <button 
                  onClick={() => setActiveTab("calendar")}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                    activeTab === "calendar" ? "bg-white text-blue-600 shadow-sm font-extrabold" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Weekly Planner
                </button>
                <button 
                  onClick={() => setActiveTab("companion")}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                    activeTab === "companion" ? "bg-white text-blue-600 shadow-sm font-extrabold" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  AI Coach
                </button>
                <button 
                  onClick={() => setActiveTab("profile")}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                    activeTab === "profile" ? "bg-white text-blue-600 shadow-sm font-extrabold" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  Profile
                </button>
              </nav>

              {/* Manifesto CTA and Header Badge */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab("manifesto")}
                  className={`text-xs font-extrabold inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border transition ${
                    activeTab === "manifesto" 
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm" 
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                  id="manifesto-toggle-btn"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden lg:inline">Manifesto</span>
                </button>

                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-2 p-1.5 border rounded-xl hover:bg-slate-50 transition text-left ${
                    activeTab === "profile" ? "border-blue-400 bg-blue-50/10 text-blue-800" : "border-slate-200 text-slate-700"
                  }`}
                  id="header-profile-badge"
                >
                  <div className="w-7 h-7 rounded-lg border border-slate-200/60 bg-slate-50 flex items-center justify-center text-lg shadow-sm">
                    {currentUser.avatarUrl === "avatar-rocket" ? "🚀" :
                     currentUser.avatarUrl === "avatar-robot" ? "🤖" :
                     currentUser.avatarUrl === "avatar-brain" ? "🧠" :
                     currentUser.avatarUrl === "avatar-target" ? "🎯" : "🌿"}
                  </div>
                  <div className="hidden sm:block text-xs leading-none">
                    <div className="font-extrabold text-[11px] text-slate-800">{currentUser.name}</div>
                    <div className="text-[8px] text-slate-400 font-black uppercase tracking-wider mt-0.5">{currentUser.aiCoachStyle} mode</div>
                  </div>
                </button>
              </div>

            </div>
          </div>
        </header>

        {/* Tab content renderer inside main frame */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8" id="tab-viewport">
          {activeTab === "dashboard" && (
            <DashboardOverview 
              tasks={tasks}
              goals={goals}
              recommendations={recommendations}
              loadingRecommendations={loadingRecommendations}
              refreshRecommendations={handleRefreshRecommendations}
              onExecuteRecommendation={handleExecuteRecommendation}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onQuickAddTask={() => setActiveTab("tasks")}
            />
          )}

          {activeTab === "tasks" && (
            <TaskBoard 
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onTriggerAIPlan={handleTriggerAIPlan}
              generatingPlanTaskId={generatingPlanTaskId}
            />
          )}

          {activeTab === "habits" && (
            <GoalTracker 
              goals={goals}
              onAddGoal={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={handleDeleteGoal}
            />
          )}

          {activeTab === "calendar" && (
            <CalendarView 
              tasks={tasks}
              goals={goals}
            />
          )}

          {activeTab === "companion" && (
            <AIChatPanel 
              chatHistory={chatHistory}
              loadingChat={loadingChat}
              onSendMessage={handleSendMessage}
              tasks={tasks}
              goals={goals}
            />
          )}

          {activeTab === "manifesto" && (
            <ProjectDoc />
          )}

          {activeTab === "profile" && (
            <UserProfileView 
              profile={currentUser}
              tasks={tasks}
              goals={goals}
              onUpdateProfile={handleUpdateProfile}
              onLogout={handleLogout}
              onDeleteAccount={handleDeleteAccount}
              showToast={showToast}
            />
          )}
        </main>

      </div>

      {/* Floating Bottom Nav for Mobile viewports */}
      <div className="md:hidden bg-white border-t border-slate-200 sticky bottom-0 z-30" id="mobile-bottom-nav">
        <div className="grid grid-cols-5 gap-0 justify-items-center h-16 text-slate-500 text-[10px] font-bold">
          <button 
            onClick={() => setActiveTab("dashboard")} 
            className={`flex flex-col items-center justify-center w-full h-full space-y-0.5 ${activeTab === "dashboard" ? "text-blue-600 font-extrabold" : ""}`}
          >
            <Clock className="w-4 h-4" />
            <span>Home</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("tasks")} 
            className={`flex flex-col items-center justify-center w-full h-full space-y-0.5 ${activeTab === "tasks" ? "text-blue-600 font-extrabold" : ""}`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Board</span>
          </button>

          <button 
            onClick={() => setActiveTab("companion")} 
            className={`flex flex-col items-center justify-center w-full h-full space-y-0.5 ${activeTab === "companion" ? "text-blue-600 font-extrabold" : ""}`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Coach</span>
          </button>

          <button 
            onClick={() => setActiveTab("habits")} 
            className={`flex flex-col items-center justify-center w-full h-full space-y-0.5 ${activeTab === "habits" ? "text-blue-600 font-extrabold" : ""}`}
          >
            <Flame className="w-4 h-4" />
            <span>Habits</span>
          </button>

          <button 
            onClick={() => setActiveTab("calendar")} 
            className={`flex flex-col items-center justify-center w-full h-full space-y-0.5 ${activeTab === "calendar" ? "text-blue-600 font-extrabold" : ""}`}
          >
            <Calendar className="w-4 h-4" />
            <span>Weeks</span>
          </button>
        </div>
      </div>

    </div>
  );
}
