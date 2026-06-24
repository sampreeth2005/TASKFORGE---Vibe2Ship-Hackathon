import React, { useState } from "react";
import { 
  Plus, 
  Trash2, 
  CheckSquare, 
  ExternalLink, 
  Clock, 
  Calendar, 
  AlertCircle, 
  Sparkles, 
  CornerDownRight, 
  Bookmark, 
  FileText,
  Copy,
  Check,
  Zap
} from "lucide-react";
import { Task, SubStep } from "../types";

interface TaskBoardProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, "id" | "createdAt" | "substeps" | "estimatedMinutes" | "status"> & { generateAI: boolean }) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onTriggerAIPlan: (taskId: string) => void;
  generatingPlanTaskId: string | null;
}

export default function TaskBoard({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onTriggerAIPlan,
  generatingPlanTaskId
}: TaskBoardProps) {
  // Modal & Form States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Task["category"]>("work");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [deadline, setDeadline] = useState("");
  const [generateAI, setGenerateAI] = useState(true);

  // Filters
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title,
      description,
      category,
      priority,
      deadline: deadline || new Date().toISOString().slice(0, 16).replace("T", " "),
      generateAI
    });

    // Reset Form
    setTitle("");
    setDescription("");
    setCategory("work");
    setPriority("medium");
    setDeadline("");
    setGenerateAI(true);
    setIsAddOpen(false);
  };

  const handleToggleSubStep = (task: Task, subStepId: string) => {
    const updatedSubsteps = task.substeps.map(step => {
      if (step.id === subStepId) {
        return { ...step, completed: !step.completed };
      }
      return step;
    });

    // Check if all substeps are done and promote task auto-completion if appropriate
    const allDone = updatedSubsteps.every(s => s.completed);

    onUpdateTask({
      ...task,
      substeps: updatedSubsteps,
      status: allDone ? "completed" : task.status
    });
  };

  const handleToggleTaskStatus = (task: Task) => {
    const newStatus = task.status === "completed" ? "todo" : "completed";
    onUpdateTask({
      ...task,
      status: newStatus
    });
  };

  const handleCopyDraft = (text: string) => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        setCopiedDraft(true);
        setTimeout(() => setCopiedDraft(false), 2000);
      } else {
        fallbackCopyTextToClipboard(text);
      }
    } catch (e) {
      console.warn("Clipboard access not allowed in this environment constraint:", e);
      fallbackCopyTextToClipboard(text);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        setCopiedDraft(true);
        setTimeout(() => setCopiedDraft(false), 2000);
      }
    } catch (err) {
      console.warn("Fallback clipboard copy failed:", err);
    }
  };

  const handleAddCustomSubstep = (task: Task, text: string) => {
    if (!text.trim()) return;
    const newSub: SubStep = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      completed: false
    };
    onUpdateTask({
      ...task,
      substeps: [...(task.substeps || []), newSub]
    });
  };

  // Filter Tasks
  const filteredTasks = tasks.filter(task => {
    if (filterCategory !== "all" && task.category !== filterCategory) return false;
    if (filterPriority !== "all" && task.priority !== filterPriority) return false;
    if (filterStatus !== "all" && task.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6" id="tasks-board-root">
      
      {/* Header and Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-slate-900">Interactive Workboard</h2>
          <p className="text-xs text-slate-500">View commitments, toggle substeps, or inspect AI planning drafts.</p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
            id="filter-category"
          >
            <option value="all">All Categories</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="meeting">Meeting</option>
            <option value="bill">Bill</option>
            <option value="interview">Interview</option>
            <option value="commitment">Commitment</option>
          </select>

          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
            id="filter-priority"
          >
            <option value="all">All Priorities</option>
            <option value="high">🔥 High</option>
            <option value="medium">⚡ Medium</option>
            <option value="low">💤 Low</option>
          </select>

          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
            id="filter-status"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 focus:outline-none cursor-pointer transition-all"
            id="open-add-task-modal-btn"
          >
            <Plus className="w-4 h-4" />
            Add Commitment
          </button>
        </div>
      </div>

      {/* Task Cards Column Listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="tasks-list-grid">
        {filteredTasks.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 py-16 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200 space-y-2">
            <CheckSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold">No commitments meet current filters.</p>
            <p className="text-xs">Click &quot;Add Commitment&quot; to define a new plan!</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const completedSubsCount = task.substeps?.filter(s => s.completed).length || 0;
            const totalSubsCount = task.substeps?.length || 0;
            const currentSelected = selectedTask?.id === task.id;

            return (
              <div 
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between task-card relative ${
                  task.status === "completed" ? "bg-slate-50 border-slate-200 select-none opacity-80" : 
                  task.priority === "high" ? "border-rose-200 hover:border-rose-300" : "border-slate-200 hover:border-slate-300"
                }`}
                id={`task-item-${task.id}`}
              >
                <div className="space-y-3">
                  {/* Category & Status Indicator Row */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      task.category === 'bill' ? 'bg-amber-100 text-amber-800' :
                      task.category === 'meeting' ? 'bg-blue-100 text-blue-800' :
                      task.category === 'interview' ? 'bg-violet-100 text-violet-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {task.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      task.priority === "high" ? "bg-rose-50 text-rose-700" :
                      task.priority === "medium" ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-600"
                    }`}>
                      {task.priority === "high" ? "🔥 High" : task.priority === "medium" ? "⚡ Medium" : "💤 Low"}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className={`font-bold text-sm text-slate-900 leading-snug line-clamp-2 ${
                      task.status === "completed" ? 'line-through text-slate-400' : ''
                    }`}>
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {task.description || "No description provided."}
                    </p>
                  </div>

                  {/* Date & Time block */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">Due: {task.deadline}</span>
                  </div>

                  {/* Substeps progress bar */}
                  {totalSubsCount > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-blue-500" />
                          AI Actions Status
                        </span>
                        <span>{completedSubsCount}/{totalSubsCount} Done</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                          style={{ width: `${(completedSubsCount / totalSubsCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Schedler slot tip if present */}
                  {task.suggestedTimeSlot && (
                    <div className="text-[11px] font-medium text-emerald-700 bg-emerald-50 rounded-lg p-2 flex items-center gap-1 border border-emerald-100">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">AI Slot: {task.suggestedTimeSlot}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 mt-4 pt-3 text-xs">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleTaskStatus(task);
                    }}
                    className={`font-semibold inline-flex items-center gap-1 ${
                      task.status === "completed" ? "text-slate-400 hover:text-slate-600" : "text-emerald-700 hover:text-emerald-900"
                    }`}
                    id={`toggle-complete-btn-${task.id}`}
                  >
                    {task.status === "completed" ? "Mark Active" : "✔ Complete"}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id);
                      }}
                      className="p-1 px-2 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Commitment"
                      id={`delete-task-btn-${task.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="text-blue-600 font-bold hover:underline inline-flex items-center gap-0.5">
                      Open <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DETAILED COMMITMENT VIEW MODAL */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4" id="task-detail-modal">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className={`p-4 sm:p-6 text-white flex justify-between items-start ${
              selectedTask.priority === "high" ? 'bg-slate-950' : 'bg-blue-900'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white/20 text-white uppercase text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10">
                    {selectedTask.category}
                  </span>
                  <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10">
                    {selectedTask.status === 'completed' ? '✔ Completed' : '⚡ Action Pending'}
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">{selectedTask.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedTask(null)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold"
                id="close-detail-modal"
              >
                Close
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Task Meta details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 text-xs">
                  <div className="text-slate-400 font-medium">Critical Deadline</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedTask.deadline}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 text-xs">
                  <div className="text-slate-400 font-medium">AI Scheduler Allocation</div>
                  <div className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedTask.suggestedTimeSlot || "Not suggested yet"}
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 text-xs">
                  <div className="text-slate-400 font-medium">AI Workload Estimate</div>
                  <div className="font-bold text-blue-700 mt-0.5 animate-pulse">
                    ~{selectedTask.estimatedMinutes || 30} minutes total
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Context description</h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  {selectedTask.description || "No supplemental descriptions."}
                </p>
              </div>

              {/* AI Sequential Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-blue-500" />
                    AI Actionable substeps breakdown
                  </h4>
                  <button
                    onClick={() => onTriggerAIPlan(selectedTask.id)}
                    disabled={generatingPlanTaskId === selectedTask.id}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 disabled:opacity-50 inline-flex items-center gap-1 cursor-pointer"
                    id="trigger-rebreakdown-ai-btn"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    Re-Analyze Substeps
                  </button>
                </div>

                {generatingPlanTaskId === selectedTask.id ? (
                  <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 text-center space-y-2 py-8" id="substeps-generating-state">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs font-medium text-blue-800 animate-pulse">Recalculating actionable stages...</p>
                  </div>
                ) : !selectedTask.substeps || selectedTask.substeps.length === 0 ? (
                  <div className="p-4 bg-slate-50 rounded-xl text-center text-xs space-y-2 border border-slate-200/60 text-slate-500">
                    <p>No substeps are currently defined.</p>
                    <button 
                      onClick={() => onTriggerAIPlan(selectedTask.id)}
                      className="bg-blue-600 font-bold px-3 py-1.5 rounded-lg text-white text-[11px] cursor-pointer"
                    >
                      Analyze Task with Gemini
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 bg-slate-50/50 p-4 border border-slate-200/60 rounded-2xl" id="substeps-checklist">
                    {selectedTask.substeps.map((sub, index) => (
                      <div 
                        key={sub.id} 
                        onClick={() => handleToggleSubStep(selectedTask, sub.id)}
                        className={`flex items-center gap-3 p-2.5 rounded-xl transition cursor-pointer hover:bg-white border text-xs ${
                          sub.completed ? 'bg-slate-100/50 border-slate-200/40 text-slate-400 line-through' : 'bg-white border-transparent shadow-sm text-slate-700 font-medium'
                        }`}
                        id={`substep-item-${sub.id}`}
                      >
                        <div className={`p-1 rounded-md ${sub.completed ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          {sub.completed ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5" />}
                        </div>
                        <span className="flex-1">
                          <span className="text-[10px] text-slate-400 mr-1.5 font-bold">Step {index + 1}</span>
                          {sub.text}
                        </span>
                      </div>
                    ))}
                    
                    {/* Inline Quick Add Substep */}
                    <input 
                      type="text"
                      placeholder="+ Add custom checklist item (press Enter)..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddCustomSubstep(selectedTask, e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                      className="w-full text-xs bg-white border border-slate-100 hover:border-slate-200 rounded-xl px-3 p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      id="add-custom-substep-input"
                    />
                  </div>
                )}
              </div>

              {/* AI Draft Material / Copyable Plan */}
              {selectedTask.actionPlanDraft && (
                <div className="space-y-2.5" id="ai-draft-material-block">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      Proactive starting companion draft
                    </h4>
                    <button
                      onClick={() => handleCopyDraft(selectedTask.actionPlanDraft || "")}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 border border-emerald-100 px-2.5 py-1 rounded-lg bg-emerald-50/50"
                      id="copy-draft-btn"
                    >
                      {copiedDraft ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Material
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-xs text-slate-600 leading-relaxed font-mono whitespace-pre-wrap bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-700 overflow-x-auto max-h-48 scrollbar">
                    {selectedTask.actionPlanDraft}
                  </pre>
                  <p className="text-[10px] text-slate-400 italic">
                    💡 Swipe or copy this AI model raw template (e.g. outline summary or email mock) immediately to eliminate starting blockages.
                  </p>
                </div>
              )}

            </div>

            {/* Modal Action footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  onDeleteTask(selectedTask.id);
                  setSelectedTask(null);
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 bg-rose-50 px-3 py-2 rounded-lg"
                id="modal-delete-task-btn"
              >
                <Trash2 className="w-4 h-4" />
                Discard commitment
              </button>
              <button
                onClick={() => {
                  handleToggleTaskStatus(selectedTask);
                  setSelectedTask(prev => prev ? { ...prev, status: prev.status === "completed" ? "todo" : "completed" } : null);
                }}
                className={`text-xs font-bold px-4 py-2 rounded-lg ${
                  selectedTask.status === "completed" 
                    ? "bg-amber-100 text-amber-700 border border-amber-200" 
                    : "bg-emerald-600 text-white"
                }`}
                id="modal-toggle-status-btn"
              >
                {selectedTask.status === "completed" ? "Mark as Active" : "✔ Mark Completed"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* COMMITMENT ADD CREATOR MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4" id="task-create-modal">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 overflow-hidden shadow-xl">
            <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
              <h3 className="font-extrabold tracking-tight text-base">Record New Commitment</h3>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-white"
                id="close-create-modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Prep pitch deck for final pitch, pay broadband subscription"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  id="task-title-input"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Supplement descriptions</label>
                <textarea 
                  placeholder="Add details, notes, links or context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 h-20 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  id="task-desc-input"
                />
              </div>

              {/* Category, Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Task["category"])}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    id="task-category-select"
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="meeting">Meeting</option>
                    <option value="bill">Bill</option>
                    <option value="interview">Interview</option>
                    <option value="commitment">Commitment</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Priority Urgency</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Task["priority"])}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    id="task-priority-select"
                  >
                    <option value="low">💤 Low Urgency</option>
                    <option value="medium">⚡ Medium</option>
                    <option value="high">🔥 High Urgency</option>
                  </select>
                </div>
              </div>

              {/* Deadline */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Target Deadline</label>
                <input 
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  id="task-deadline-input"
                />
              </div>

              {/* Toggle to trigger AI Analysis instantly */}
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex items-start gap-2.5">
                <input 
                  type="checkbox" 
                  checked={generateAI}
                  onChange={(e) => setGenerateAI(e.target.checked)}
                  className="mt-1 border-blue-300 rounded text-blue-600 focus:ring-blue-500"
                  id="task-trigger-ai-checkbox"
                />
                <div>
                  <label htmlFor="task-trigger-ai-checkbox" className="text-xs font-bold text-blue-950 flex items-center gap-1 cursor-pointer">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Proactively Decompose with Gemini AI
                  </label>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-medium">
                    Instantly break down sequential micro-steps, estimate ideal task duration, suggest time-slots, and draft unblocking materials automatically!
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-4 py-2 rounded-lg"
                  id="cancel-create-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs font-bold bg-slate-900 border hover:bg-slate-850 px-4 py-2 text-white rounded-lg inline-flex items-center gap-1"
                  id="submit-create-btn"
                >
                  Record Commitment
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
