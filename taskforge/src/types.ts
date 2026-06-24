export interface SubStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  category: 'work' | 'personal' | 'meeting' | 'bill' | 'interview' | 'commitment';
  priority: 'low' | 'medium' | 'high';
  deadline: string; // YYYY-MM-DD HH:MM
  status: 'todo' | 'in_progress' | 'completed';
  description: string;
  substeps: SubStep[];
  estimatedMinutes: number;
  suggestedTimeSlot?: string; // AI recommendations
  actionPlanDraft?: string; // AI-generated draft of action to complete the task
  overdueNotified?: boolean;
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly';
  category: string;
  streak: number;
  lastCompleted?: string; // YYYY-MM-DD
  history: string[]; // List of completed dates (YYYY-MM-DD)
  aiRecommendation?: string; // Auto-generated tips
}

export interface ProductivityRecommendation {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'insight' | 'tip';
  actionableId?: string; // Reference to a Task or Goal ID
  actionLabel?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestions?: string[]; // Clickable quick actions or chips
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  aiCoachStyle: 'balanced' | 'tough' | 'supportive' | 'analytical';
  focusGoal: string;
  registeredAt: string;
}

export interface UserAccount {
  profile: UserProfile;
  passwordHash: string; // local password verification
}

