import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Bot, Sparkles, Shield, Mail, Lock, User, Target, CheckCircle2, ChevronRight, Compass } from "lucide-react";
import { UserAccount, UserProfile } from "../types";

// Dynamic Avatar templates for selection
const AVATAR_PRESETS = [
  { id: "avatar-rocket", icon: "🚀", label: "Explorer", bg: "bg-rose-50 border-rose-100" },
  { id: "avatar-robot", icon: "🤖", label: "Synthesizer", bg: "bg-blue-50 border-blue-100" },
  { id: "avatar-brain", icon: "🧠", label: "Thinker", bg: "bg-indigo-50 border-indigo-100" },
  { id: "avatar-target", icon: "🎯", label: "Achiever", bg: "bg-emerald-50 border-emerald-100" },
  { id: "avatar-plant", icon: "🌿", label: "Zen Grower", bg: "bg-amber-50 border-amber-100" },
];

// Rich AI Coach Styles description
const COACH_STYLES = [
  { id: "balanced", title: "Balanced Strategist", desc: "A standard, mindful guidance approach focusing equally on productivity and energy rest.", color: "border-blue-200 bg-blue-50/10 text-blue-800" },
  { id: "tough", title: "Disciplined Trainer", desc: "Strict, high-accountability focus. Alerts on procrastination and gives high-intensity targets.", color: "border-rose-200 bg-rose-50/10 text-rose-800" },
  { id: "supportive", title: "Mindfulness Companion", desc: "Warm, empathetic and encouraging. Focuses heavily on stress relief, breathing intervals, and wellness.", color: "border-emerald-200 bg-emerald-50/10 text-emerald-800" },
  { id: "analytical", title: "Quantitative Auditor", desc: "Pure telemetry and logic. Breaks everything down into minute-by-minute stats and progress logs.", color: "border-violet-200 bg-violet-50/10 text-violet-800" },
];

interface AuthScreenProps {
  onLoginSuccess: (profile: UserProfile) => void;
  existingAccounts: UserAccount[];
  onRegisterAccount: (newAccount: UserAccount) => void;
}

export default function AuthScreen({ onLoginSuccess, existingAccounts, onRegisterAccount }: AuthScreenProps) {
  const [isLoginModel, setIsLoginModel] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Registration States
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regAvatar, setRegAvatar] = useState("avatar-rocket");
  const [regCoachStyle, setRegCoachStyle] = useState<'balanced' | 'tough' | 'supportive' | 'analytical'>("balanced");
  const [regFocusGoal, setRegFocusGoal] = useState("Optimize cognitive focus & rest balance");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");



  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please provide both your registered email and password.");
      return;
    }

    const account = existingAccounts.find(
      (acc) => acc.profile.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!account) {
      setErrorMsg("No account detected under this email address. Please register above.");
      return;
    }

    // Standard local check
    if (password !== "password" && account.passwordHash !== password) {
      setErrorMsg("Incorrect security credentials. Correct password or try default 'password'.");
      return;
    }

    onLoginSuccess(account.profile);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!regName || !regEmail || !regPassword) {
      setErrorMsg("Please fill out all required credentials to create your strategist profile.");
      return;
    }

    if (regPassword.length < 4) {
      setErrorMsg("Password security must be at least 4 characters long.");
      return;
    }

    const emailTaken = existingAccounts.some(
      (acc) => acc.profile.email.toLowerCase() === regEmail.trim().toLowerCase()
    );

    if (emailTaken) {
      setErrorMsg("Email address is already in use by another strategist.");
      return;
    }

    // Create Profile
    const newId = "user-" + Math.random().toString(36).substring(2, 9);
    const newAccount: UserAccount = {
      profile: {
        id: newId,
        name: regName.trim(),
        email: regEmail.trim(),
        avatarUrl: regAvatar,
        aiCoachStyle: regCoachStyle,
        focusGoal: regFocusGoal || "Establish continuous deep work blocks",
        registeredAt: new Date().toISOString(),
      },
      passwordHash: regPassword,
    };

    onRegisterAccount(newAccount);
    setSuccessMsg("Account successfully verified! Switching to Login screen...");
    
    // Quick delay transition back to login with pre-populated email
    setTimeout(() => {
      setEmail(regEmail.trim());
      setPassword(regPassword);
      setIsLoginModel(true);
      setSuccessMsg("");
    }, 1500);
  };



  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50/50 p-4" id="auth-panel-wrapper">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden"
      >
        {/* Banner with decorative layout */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl mt-[-20px] mr-[-20px]" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl mb-[-10px] ml-[-10px]" />

          <div className="flex items-center gap-2.5">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
              <Bot className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-200">System Gateway</span>
              <h1 className="text-xl font-black tracking-tight" id="auth-header-title">TaskForge</h1>
              <p className="text-[10px] uppercase tracking-widest font-black text-blue-100 mt-1 block">Forge Productivity, Finish Strong</p>
            </div>
          </div>
          <p className="text-xs text-blue-100/90 mt-3 font-medium leading-relaxed">
            Configure your AI Cognitive Space and decompose high-friction requirements through custom Gemini reasoning structures.
          </p>
        </div>

        {/* Tab Swappers */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-1" id="auth-tabs">
          <button
            onClick={() => { setIsLoginModel(true); setErrorMsg(""); }}
            className={`flex-1 py-3 text-xs font-extrabold text-center rounded-xl transition ${
              isLoginModel 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-800"
            }`}
            id="tab-login"
          >
            Sign In to Profile
          </button>
          <button
            onClick={() => { setIsLoginModel(false); setErrorMsg(""); }}
            className={`flex-1 py-3 text-xs font-extrabold text-center rounded-xl transition ${
              !isLoginModel 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-800"
            }`}
            id="tab-register"
          >
            Register Account
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* User notifications block */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl text-xs font-medium flex items-start gap-2 animate-shake" id="auth-error-notification">
              <span className="bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] mt-0.5 font-bold">!</span>
              <div>{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-bounce" id="auth-success-notification">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <div>{successMsg}</div>
            </div>
          )}

          {isLoginModel ? (
            /* Sign In flow */
            <form onSubmit={handleLoginSubmit} className="space-y-4" id="login-form">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. example@gmail.com"
                    className="w-full pl-9 pr-4 py-2.5 text-slate-900 border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    id="login-email-input"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account security key"
                    className="w-full pl-9 pr-4 py-2.5 text-slate-900 border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    id="login-password-input"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-all focus:ring-2 focus:ring-blue-500/30"
                  id="login-submit-btn"
                >
                  Unblock Productivity Space
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>


            </form>
          ) : (
            /* Registration Flow */
            <form onSubmit={handleRegisterSubmit} className="space-y-4" id="register-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Johnathan Doe"
                      className="w-full pl-9 pr-3 py-2.5 text-slate-900 border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      id="reg-name-input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. example@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 text-slate-900 border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      id="reg-email-input"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="At least 4 chars"
                      className="w-full pl-9 pr-3 py-2.5 text-slate-900 border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      id="reg-password-input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Primary Strategy Focus</label>
                  <div className="relative">
                    <Target className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      value={regFocusGoal}
                      onChange={(e) => setRegFocusGoal(e.target.value)}
                      placeholder="e.g. Overcome habit delay"
                      className="w-full pl-9 pr-3 py-2.5 text-slate-900 border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      id="reg-goal-input"
                    />
                  </div>
                </div>
              </div>

              {/* Avatar Picker Row */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Choose Avatar Identifier</label>
                <div className="flex flex-wrap gap-2.5" id="reg-avatar-choices">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setRegAvatar(preset.id)}
                      className={`p-2.5 rounded-xl border text-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${preset.bg} ${
                        regAvatar === preset.id 
                          ? "ring-2 ring-blue-600 border-blue-400 scale-105" 
                          : "opacity-60 grayscale-[40%] hover:opacity-100 hover:scale-102"
                      }`}
                    >
                      <span>{preset.icon}</span>
                      <span className="text-[9px] font-black text-slate-600 block">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cognitive Coach style Selection */}
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Preferred AI Coach Style</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="reg-coach-choices">
                  {COACH_STYLES.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setRegCoachStyle(style.id as any)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        regCoachStyle === style.id 
                          ? "border-blue-600 ring-1 ring-blue-600/30 bg-blue-50/10" 
                          : "border-slate-200 hover:border-slate-300 bg-slate-50/35"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-extrabold text-slate-900">{style.title}</span>
                        {regCoachStyle === style.id && <Compass className="w-3.5 h-3.5 text-blue-500 animate-spin" />}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 leading-normal font-medium">{style.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-all"
                  id="reg-submit-btn"
                >
                  Create Profile & Initialize Sandbox
                  <CheckCircle2 className="w-4 h-4 ml-1" />
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
