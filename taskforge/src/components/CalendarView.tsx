import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, Star, AlertCircle } from "lucide-react";
import { Task, Goal } from "../types";

interface CalendarViewProps {
  tasks: Task[];
  goals: Goal[];
}

export default function CalendarView({ tasks, goals }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get start of the current week (Sunday)
  const getStartOfWeek = (d: Date) => {
    const day = d.getDay();
    const diff = d.getDate() - day; // adjust when day is sunday
    return new Date(d.getFullYear(), d.getMonth(), diff);
  };

  const startOfWeek = getStartOfWeek(currentDate);

  // Generate week days (Sunday - Saturday)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

  const nextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 7);
    setCurrentDate(next);
  };

  const prevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 7);
    setCurrentDate(prev);
  };

  const resetToToday = () => {
    setCurrentDate(new Date());
  };

  // Helper: map tasks matching a specific date (YYYY-MM-DD)
  const getTasksForDay = (day: Date) => {
    const dateStr = day.toISOString().split("T")[0];
    return tasks.filter(task => {
      // Direct match or matching deadline date
      if (task.deadline) {
        const tDate = task.deadline.split(" ")[0]; // handles "YYYY-MM-DD HH:MM" or "YYYY-MM-DD"
        return tDate.startsWith(dateStr);
      }
      return false;
    });
  };

  // Helper: check if a habit was completed on that date
  const getHabitsCompletedForDay = (day: Date) => {
    const dateStr = day.toISOString().split("T")[0];
    return goals.filter(goal => goal.history.includes(dateStr));
  };

  // Month header text
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const yearName = currentDate.getFullYear();

  return (
    <div className="space-y-6" id="calendar-view-root">
      
      {/* Calendar Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2.5">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">
            {monthName} {yearName} Week
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={resetToToday}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition"
            id="cal-today-btn"
          >
            Today
          </button>
          
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg">
            <button 
              onClick={prevWeek}
              className="p-1 px-2.5 text-slate-600 hover:text-slate-900 transition"
              title="Previous Week"
              id="cal-prev-week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-200" />
            <button 
              onClick={nextWeek}
              className="p-1 px-2.5 text-slate-600 hover:text-slate-900 transition"
              title="Next Week"
              id="cal-next-week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Week Timeline Grid rendering */}
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-4" id="calendar-days-grid">
        {weekDays.map((day, idx) => {
          const isToday = new Date().toISOString().split("T")[0] === day.toISOString().split("T")[0];
          const dayTasks = getTasksForDay(day);
          const completedHabits = getHabitsCompletedForDay(day);

          return (
            <div 
              key={idx}
              className={`bg-white rounded-xl border min-h-[160px] p-3 flex flex-col justify-between transition-all ${
                isToday 
                  ? 'border-blue-500 ring-1 ring-blue-500/10' 
                  : 'border-slate-200/80'
              }`}
              id={`cal-day-box-${day.getDate()}`}
            >
              {/* Date Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {day.toLocaleString("default", { weekday: "short" })}
                </span>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                  isToday 
                    ? 'bg-blue-600 text-white animate-pulse' 
                    : 'text-slate-700'
                }`}>
                  {day.getDate()}
                </span>
              </div>

              {/* Tasks and completion cards plotting */}
              <div className="flex-1 py-2.5 space-y-1.5 overflow-y-auto max-h-[180px] scrollbar">
                {dayTasks.length === 0 && completedHabits.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[10px] text-slate-330 text-center italic py-4">
                    Relax, space empty
                  </div>
                ) : (
                  <>
                    {/* Render Tasks */}
                    {dayTasks.map(task => (
                      <div 
                        key={task.id}
                        className={`p-1.5 rounded-lg border text-[10px] leading-snug font-medium transition ${
                          task.status === 'completed'
                            ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                            : task.priority === 'high'
                              ? 'bg-rose-50 border-rose-100 text-rose-950'
                              : 'bg-blue-50 border-blue-100 text-blue-950'
                        }`}
                        title={`${task.title} - Due ${task.deadline}`}
                      >
                        <div className="font-extrabold truncate">{task.title}</div>
                        {task.suggestedTimeSlot && (
                          <div className="text-[8px] opacity-75 font-semibold text-emerald-800 tracking-tight flex items-center gap-0.5 mt-0.5">
                            <Clock className="w-2.5 h-2.5 flex-shrink-0" />
                            {task.suggestedTimeSlot.split(" at ")[1] || task.suggestedTimeSlot}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Render Logged Habits */}
                    {completedHabits.map(g => (
                      <div 
                        key={g.id}
                        className="bg-amber-50/50 border border-amber-100 text-amber-950 p-1 rounded-lg text-[9px] font-semibold flex items-center gap-1"
                        title={`Completed Habit: ${g.title}`}
                      >
                        <span className="w-1 h-1 rounded-full bg-amber-500 flex-shrink-0"></span>
                        <span className="truncate">{g.title}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Day footer statistics counts */}
              <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[8px] font-black tracking-wider text-slate-400 uppercase">
                <span>Task count: {dayTasks.length}</span>
                {isToday && <span className="text-blue-600 font-extrabold">Today</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Advisory guide regarding scheduler accuracy */}
      <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl flex items-start gap-4 hover:shadow-xs transition">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
          <Clock className="w-5 h-5 animate-spin" />
        </div>
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-slate-900">AI Scheduling Allocations</h4>
          <p className="text-slate-500 leading-relaxed font-medium">
            The timeslots represented here are recommended by Gemini. It calculates complexity and optimal rest blocks based on task criteria, creating customized focus hours to combat decision-fatigue and secure high performance.
          </p>
        </div>
      </div>

    </div>
  );
}
