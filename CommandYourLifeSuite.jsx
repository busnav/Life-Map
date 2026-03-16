import { useState, useEffect, useRef, useCallback } from "react";

/* ─── STYLES ──────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  if (document.getElementById("cyls-styles")) return;
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #080A0D; color: #F0F2F5; font-family: 'Cormorant Garamond', Georgia, serif; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-thumb { background: #8B6914; border-radius: 2px; }
    ::-webkit-scrollbar-track { background: transparent; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(20px);} to { opacity:1; transform:translateY(0);} }
    @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes borderGlow { 0%,100%{box-shadow:0 0 8px #C9A84C33} 50%{box-shadow:0 0 22px #C9A84C77} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
    @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
    @keyframes typing { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
    .fu  { animation: fadeUp .55s ease both; }
    .fu1 { animation: fadeUp .55s .08s ease both; }
    .fu2 { animation: fadeUp .55s .16s ease both; }
    .fu3 { animation: fadeUp .55s .26s ease both; }
    .fu4 { animation: fadeUp .55s .38s ease both; }
    .gold-shimmer {
      background: linear-gradient(90deg, #7A5810, #E8C96A, #C9A84C, #7A5810);
      background-size: 300% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3.5s linear infinite;
    }
    .glow-border { animation: borderGlow 2.5s ease-in-out infinite; }
    .btn-gold {
      background: linear-gradient(135deg, #7A5810, #C9A84C, #E8C96A, #C9A84C);
      background-size: 200% auto;
      color: #080A0D;
      font-family: 'Bebas Neue', sans-serif;
      letter-spacing: 2px;
      border: none;
      cursor: pointer;
      transition: all .3s;
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    }
    .btn-gold:hover { background-position: right center; transform: translateY(-1px); box-shadow: 0 6px 20px #C9A84C33; }
    .btn-gold:disabled { opacity: .4; cursor: not-allowed; transform: none; }
    .btn-ghost {
      background: transparent;
      border: 1px solid #C9A84C55;
      color: #C9A84C;
      font-family: 'Bebas Neue', sans-serif;
      letter-spacing: 2px;
      cursor: pointer;
      transition: all .3s;
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    }
    .btn-ghost:hover { border-color: #C9A84C; background: #C9A84C0E; }
    .btn-danger { background: #B03A2E22; border: 1px solid #B03A2E55; color: #B03A2E; font-family: 'Bebas Neue'; letter-spacing: 2px; cursor: pointer; transition: all .2s; }
    .btn-danger:hover { background: #B03A2E33; }
    input, select, textarea {
      background: #0F1216;
      border: 1px solid #2C3340;
      color: #F0F2F5;
      font-family: 'Cormorant Garamond', serif;
      font-size: 16px;
      padding: 11px 15px;
      width: 100%;
      outline: none;
      transition: border .2s;
      border-radius: 2px;
    }
    input:focus, select:focus, textarea:focus { border-color: #C9A84C55; }
    select option { background: #0F1216; }
    .card {
      background: #0F1216;
      border: 1px solid #1E2329;
      transition: border .3s;
      border-radius: 3px;
    }
    .card:hover { border-color: #C9A84C22; }
    .divider { border: none; border-top: 1px solid #1E2329; margin: 20px 0; }
    .tag {
      font-family: 'DM Mono', monospace;
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 3px 9px;
      border-radius: 2px;
    }
    .nav { position: sticky; top: 0; z-index: 100; backdrop-filter: blur(16px); background: #080A0Ddd; border-bottom: 1px solid #1E2329; }
    .sidebar { background: #090B0E; border-right: 1px solid #1E2329; }
    .sidebar-item {
      padding: 9px 18px;
      cursor: pointer;
      font-size: 13px;
      color: #8A95A3;
      border-left: 2px solid transparent;
      transition: all .2s;
      display: flex; align-items: center; gap: 10px;
    }
    .sidebar-item:hover { color: #C9A84C; border-left-color: #C9A84C44; background: #C9A84C07; }
    .sidebar-item.active { color: #C9A84C; border-left-color: #C9A84C; background: #C9A84C10; }
    .module-card {
      background: #0F1216;
      border: 1px solid #1E2329;
      padding: 20px;
      cursor: pointer;
      transition: all .25s;
      border-radius: 3px;
    }
    .module-card:hover { border-color: #C9A84C44; transform: translateY(-2px); box-shadow: 0 4px 16px #00000044; }
    .progress-bar-bg { background: #1A1F26; border-radius: 2px; height: 3px; }
    .progress-fill { height: 3px; border-radius: 2px; transition: width .6s ease; }
    .badge { display:inline-block; padding:2px 8px; font-family:'DM Mono',monospace; font-size:10px; letter-spacing:1px; border-radius:2px; }
    .badge-gold { background:#C9A84C18; color:#C9A84C; border:1px solid #C9A84C33; }
    .badge-blue { background:#4A8FBF18; color:#4A8FBF; border:1px solid #4A8FBF33; }
    .badge-green { background:#3AA87618; color:#3AA876; border:1px solid #3AA87633; }
    .badge-red { background:#B03A2E18; color:#B03A2E; border:1px solid #B03A2E33; }
    .badge-muted { background:#1E2329; color:#8A95A3; }

    /* Chat */
    .msg-ai { display:flex; flex-direction:column; align-items:flex-start; margin-bottom:16px; }
    .msg-user { display:flex; flex-direction:column; align-items:flex-end; margin-bottom:16px; }
    .msg-bubble { max-width:82%; padding:12px 16px; font-size:15px; line-height:1.65; border-radius:3px; }
    .msg-ai .msg-bubble { background:#13181E; border:1px solid #1E2329; color:#D4C9B8; }
    .msg-user .msg-bubble { background:#C9A84C18; border:1px solid #C9A84C33; color:#F0F2F5; }
    .msg-sender { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:2px; color:#C9A84C; margin-bottom:6px; }
    .typing-dot { width:6px; height:6px; background:#C9A84C; border-radius:50%; display:inline-block; margin:0 2px; animation:typing 1.4s infinite ease-in-out; }
    .typing-dot:nth-child(2){animation-delay:.2s}
    .typing-dot:nth-child(3){animation-delay:.4s}

    /* Timeline */
    .horizon-bar { height: 40px; border-radius: 2px; position:relative; overflow:hidden; cursor:pointer; transition: transform .2s; }
    .horizon-bar:hover { transform: scaleY(1.05); }

    /* Goal item */
    .goal-item { display:flex; align-items:flex-start; gap:10px; padding:10px 0; border-bottom:1px solid #1A1F26; }
    .goal-item:last-child { border-bottom:none; }
    .goal-check { width:16px; height:16px; border:1px solid #2C3340; border-radius:2px; cursor:pointer; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all .2s; margin-top:2px; }
    .goal-check.done { background:#C9A84C; border-color:#C9A84C; }

    /* Calendar */
    .cal-day { aspect-ratio:1; display:flex; align-items:center; justify-content:center; font-size:13px; cursor:pointer; border-radius:2px; transition:background .15s; position:relative; }
    .cal-day:hover { background:#1E2329; }
    .cal-day.today { background:#C9A84C22; color:#C9A84C; font-weight:600; }
    .cal-day.has-event::after { content:''; position:absolute; bottom:3px; left:50%; transform:translateX(-50%); width:4px; height:4px; background:#C9A84C; border-radius:50%; }

    /* Domain pills */
    .domain-pill { padding:4px 10px; border-radius:2px; font-family:'DM Mono',monospace; font-size:10px; letter-spacing:1px; cursor:pointer; transition:all .15s; }

    /* Onboarding */
    .ob-overlay { position:fixed; inset:0; background:#080A0Dee; z-index:200; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(8px); }
    .ob-card { background:#0F1216; border:1px solid #2C3340; padding:48px; max-width:560px; width:100%; max-height:90vh; overflow-y:auto; border-radius:3px; }
    .ob-step-dot { width:8px; height:8px; border-radius:50%; background:#1E2329; transition:background .2s; }
    .ob-step-dot.active { background:#C9A84C; }

    /* Scroll smooth */
    html { scroll-behavior: smooth; }
  `;
  const style = document.createElement("style");
  style.id = "cyls-styles";
  style.textContent = css;
  document.head.appendChild(style);
};

/* ─── CONSTANTS ───────────────────────────────────────────────────────────── */
const DOMAINS = [
  { key: "career", label: "Career", emoji: "💼", color: "#3B7DD8" },
  { key: "education", label: "Education", emoji: "🎓", color: "#3AA876" },
  { key: "finances", label: "Finances", emoji: "💰", color: "#C9A84C" },
  { key: "health", label: "Health", emoji: "❤️", color: "#D95C5C" },
  { key: "relationships", label: "Relationships", emoji: "🤝", color: "#D4679A" },
  { key: "home", label: "Home & Legacy", emoji: "🏠", color: "#8B6E4A" },
  { key: "growth", label: "Personal Growth", emoji: "🌱", color: "#7B68D4" },
];

const HORIZONS = [
  { key: "1yr", label: "1 Year", years: 1, color: "#C9A84C" },
  { key: "3yr", label: "3–5 Years", years: 3, color: "#4A8FBF" },
  { key: "10yr", label: "10 Years", years: 10, color: "#7B68D4" },
  { key: "20yr", label: "20 Year Dream", years: 20, color: "#3AA876" },
];

const VALUES_OPTIONS = [
  "Adventure", "Balance", "Community", "Creativity", "Education",
  "Faith", "Family", "Financial Security", "Freedom", "Growth",
  "Health", "Integrity", "Joy", "Leadership", "Legacy",
  "Love", "Mindfulness", "Service", "Travel", "Discipline",
];

const QUOTES = [
  ["The best time to plant a tree was 20 years ago. The second best time is now.", "Chinese Proverb"],
  ["A goal without a plan is just a wish.", "Antoine de Saint-Exupéry"],
  ["Discipline is the bridge between goals and accomplishment.", "Jim Rohn"],
  ["Families are the compass that guides us.", "Brad Henry"],
  ["What you do today can improve all your tomorrows.", "Ralph Marston"],
  ["The secret of getting ahead is getting started.", "Mark Twain"],
  ["Command your life or it will command you.", "Command Life Framework™"],
];

const INITIAL_APP = {
  commandSuiteRemaining: 100,
  acceleratorRemaining: 75,
  coupons: ["COMMAND10", "DISCIPLINE20"],
  revokedUsers: [],
  users: [],
};

/* ─── ICONS ───────────────────────────────────────────────────────────────── */
const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const icons = {
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    lock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    book: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    rocket: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    chat: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    target: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    person: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    trophy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="11"/><path d="M7 4V2H17V4"/><path d="M7 4C7 8 5 11 3 11C3 11 6 14 12 14C18 14 21 11 21 11C19 11 17 8 17 4"/></svg>,
  };
  return icons[name] || null;
};

/* ─── HELPER ──────────────────────────────────────────────────────────────── */
const getAge = (dob) => {
  if (!dob) return null;
  const d = new Date(dob), now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
  return age;
};

const memberColors = ["#C9A84C", "#4A8FBF", "#3AA876", "#D4679A", "#7B68D4", "#D95C5C"];
const getMemberColor = (idx) => memberColors[idx % memberColors.length];

const getDomainColor = (key) => DOMAINS.find(d => d.key === key)?.color || "#8A95A3";

/* ─── AI RESPONSE ENGINE ─────────────────────────────────────────────────── */
const generateAIResponse = (userMsg, members, goals, values) => {
  const msg = userMsg.toLowerCase();
  const allGoals = Object.values(goals).flat();
  const firstName = members[0]?.name || "Commander";
  const vals = values.length ? values.join(", ") : "your family's values";

  if (/suicid|kill myself|end my life|harm myself|crisis|emergency/.test(msg)) {
    return `I hear you, and I'm concerned. You're not alone. 💙\n\n**Please reach out right now:**\n• **988 Suicide & Crisis Lifeline**: Call or text 988\n• **Crisis Text Line**: Text HOME to 741741\n• **Emergency**: Call 911\n\nI'm a life planning coach, not a therapist. Please get the right support.`;
  }

  if (/values|what matters|important|priority/.test(msg)) {
    return `What a powerful question. 🌟 Your household holds **${vals}** as core values.\n\nThese aren't just words — they're the compass for every major decision. When I look at your goals, I see these values expressed across multiple horizons.\n\n**A question to sit with:** If you looked back 10 years from now, which of these values would you most want to have been *actively living*, not just aspiring to? What's one concrete step you could take this week to honor that value?`;
  }

  if (/review|goals|progress|how am i/.test(msg)) {
    const done = allGoals.filter(g => g.done).length;
    const total = allGoals.length;
    const pct = total ? Math.round(done / total * 100) : 0;
    return `You're building something remarkable — let's celebrate that first! 🎉\n\nYou have **${total} total goals** with **${done} completed** (${pct}% achievement rate).\n\nHere's what I notice: your 1-year goals need the most attention — those are your leverage points for the longer horizons. Every win at the 1-year mark compounds across your 3, 10, and 20-year vision.\n\nWhat's getting in the way of your next milestone? Let's name the obstacle and build around it.`;
  }

  if (/career|job|work|profession|business/.test(msg)) {
    const careerGoals = allGoals.filter(g => g.domain === "career");
    return `Career is one of your most powerful levers. 💼\n\nI see ${careerGoals.length} career goal${careerGoals.length !== 1 ? "s" : ""} in your plan${careerGoals.length ? `, including **"${careerGoals[0]?.text}"**` : ""}.\n\nHere's a stretch question: What would your career look like in 10 years if *nothing held you back*? Articulating the dream version helps identify which small steps today create the biggest momentum.\n\nWhat's one thing you could do in the next 30 days to advance your career vision?`;
  }

  if (/financ|money|saving|invest|budget|wealth/.test(msg)) {
    return `Financial planning is the gift you give your future selves and your children. 💰\n\nFamilies with strong values alignment — like yours — make the best long-term financial decisions because they know *why* they're building wealth.\n\n**Three questions to anchor your financial strategy:**\n• What does "financially free" look like specifically for your family?\n• Are there any money stories from your upbringing that might be holding you back?\n• What's one financial habit you could install this week?\n\nWhat's your biggest financial goal for the next 12 months?`;
  }

  if (/kid|child|school|education|learn/.test(msg)) {
    const kids = members.filter(m => m.role === "Child");
    return `Your children are your family's most important long-term mission. 💛\n\n${kids.length ? kids.map(k => `**${k.name}** (age ${getAge(k.dob) ?? "?"}) is at an age where the foundations you build now echo for decades.`).join(" ") : "Your children's development is the most powerful investment in your family's legacy."}\n\nResearch consistently shows: children thrive with consistency, warmth, and high expectations. What they *feel* about their childhood shapes their entire adult identity.\n\n**What's one thing you want your children to feel about growing up in your household?** Let that answer guide your planning.`;
  }

  if (/health|fitness|exercise|wellness|mental/.test(msg)) {
    return `Health is the foundation everything else stands on. ❤️\n\nFamilies who make health a *shared value* — not just individual achievement — sustain it far better than those who treat it as separate goals.\n\n**A powerful idea:** What if you created one shared family health ritual? Sunday hikes, morning movement, cooking real food together. Shared rituals build identity, not just habits.\n\nWhat does "health" mean for your family beyond the physical — mental, emotional, relational?`;
  }

  if (/relationship|marriage|partner|connect|family/.test(msg)) {
    return `Relationships are the richest domain in your whole life plan. 🤝\n\nHere's what I find remarkable about long-horizon family planning: every financial, career, and growth goal ultimately *serves* your relationships. The question is whether you're investing in them proportionally.\n\n**In 20 years, when your kids are grown and thinking about their upbringing — what feeling do you most want them to have?**\n\nThat feeling becomes your north star. Let's make sure your current goals are building toward it.`;
  }

  if (/stretch|bigger|dream|ambitious|what if/.test(msg)) {
    const member = members[0];
    const age = member ? (getAge(member.dob) ?? 35) : 35;
    return `This is the energy that changes everything. 🚀\n\n**Stretch vision for your household:**\n\n💼 **Career**: By the time ${member?.name || "you"}'s ${age + 10}, what if you'd built something that creates opportunities for others?\n🌍 **Impact**: What if your family became known in your community for a specific, meaningful contribution?\n💰 **Finances**: What if you structured things so that in 15 years, work becomes a *choice* rather than a requirement?\n🌱 **Legacy**: What if your children grew up watching you pursue and *achieve* a lifelong dream?\n\nStretch goals aren't about pressure — they're about giving your planning a north star worth navigating toward. Which resonates most?`;
  }

  const reflections = [
    `What I see in your planning is someone who is deeply intentional about their life — and that's your greatest asset. 🌟\n\nThe fact that you're thinking across multiple horizons shows uncommon vision. Most people plan for next month. You're planning for the next generation.\n\n**A question to sit with:** What would it mean for your family if everything went *right*? Not just okay — but genuinely, beautifully right? Let's build toward that.\n\nWhat area feels most alive for you right now?`,
    `That's a powerful perspective. 💫 Here's what I notice as your coach: you think carefully before acting. That quality will serve your family extraordinarily well over the long horizons you're building toward.\n\nBased on your values of **${vals}**, you're on a path that could be genuinely remarkable. The question is: what does your next *courageous step* look like?\n\nSometimes the best planning isn't about adding more goals — it's about getting clearer on the *sequence* of what you're already pursuing.`,
    `Thank you for bringing this to your planning. 🙏 What I hear is someone who cares deeply — about their family, about the future, about doing things *right*.\n\nHere's a strengths-based reframe: instead of focusing on what isn't done yet, let's acknowledge what you've already built. A family plan. Long-term vision. Clear values. That puts you ahead of the vast majority.\n\nWhat's one thing — if you made real progress in the next 30 days — that would make you genuinely proud?`,
  ];

  return reflections[Math.floor(Math.random() * reflections.length)];
};

/* ─── LANDING PAGE ────────────────────────────────────────────────────────── */
const LandingPage = ({ app, onNavigate }) => {
  const suiteFull = app.commandSuiteRemaining <= 0;
  const accFull = app.acceleratorRemaining <= 0;

  return (
    <div style={{ minHeight: "100vh", background: "#080A0D" }}>
      <nav className="nav" style={{ padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, border: "1px solid #C9A84C", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="shield" size={14} color="#C9A84C" />
          </div>
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: 18, letterSpacing: 3, color: "#C9A84C" }}>CYLS™</span>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          <button className="btn-ghost" style={{ padding: "8px 20px", fontSize: 13 }} onClick={() => onNavigate("login")}>LOGIN</button>
          <button className="btn-gold" style={{ padding: "8px 24px", fontSize: 13 }} onClick={() => onNavigate("checkout")}>ENLIST NOW</button>
        </div>
      </nav>

      <section style={{ maxWidth: 960, margin: "0 auto", padding: "90px 40px 70px", textAlign: "center" }}>
        <div className="fu" style={{ marginBottom: 18 }}>
          <span className="tag" style={{ background: "#C9A84C12", color: "#C9A84C", border: "1px solid #C9A84C33" }}>
            FOUNDING ACCESS — LIMITED ALLOCATION
          </span>
        </div>
        <h1 className="fu1" style={{ fontFamily: "'Bebas Neue'", fontSize: "clamp(52px, 9vw, 88px)", lineHeight: 0.95, letterSpacing: 3, marginBottom: 22 }}>
          <span className="gold-shimmer">Command Your</span>
          <br />
          <span style={{ color: "#F0F2F5" }}>Life Suite™</span>
        </h1>
        <p className="fu2" style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, fontStyle: "italic", color: "#8A95A3", marginBottom: 10 }}>
          Empowering Families &amp; Teams to Excel
        </p>
        <p className="fu3" style={{ fontSize: 18, color: "#BEC8D4", maxWidth: 540, margin: "0 auto 44px", lineHeight: 1.75 }}>
          A military-grade life planning system for civilian leaders who refuse to leave their family's future to chance.
          AI coaching. Multi-horizon goals. Family command center.
        </p>
        <div className="fu4" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-gold" style={{ padding: "15px 40px", fontSize: 16 }} onClick={() => onNavigate("checkout")}>
            SECURE YOUR POSITION
          </button>
          <button className="btn-ghost" style={{ padding: "15px 32px", fontSize: 14 }}>
            LEARN MORE
          </button>
        </div>
        <p style={{ marginTop: 18, fontFamily: "'DM Mono'", fontSize: 11, color: "#3A4450", letterSpacing: 1 }}>
          Comment "DISCIPLINE" or message "COMMAND" for early access
        </p>
      </section>

      {/* Counters */}
      <div style={{ background: "#090B0E", borderTop: "1px solid #1E2329", borderBottom: "1px solid #1E2329", padding: "18px 40px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 34, color: suiteFull ? "#B03A2E" : "#C9A84C" }}>
              {suiteFull ? "0" : app.commandSuiteRemaining}
            </div>
            <div style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#6A7585" }}>
              {suiteFull ? "BONUS ALLOCATION CLOSED" : "COMMAND SUITE SPOTS REMAINING"}
            </div>
          </div>
          <div style={{ width: 1, background: "#1E2329" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 34, color: accFull ? "#B03A2E" : "#C9A84C" }}>
              {accFull ? "0" : app.acceleratorRemaining}
            </div>
            <div style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#6A7585" }}>
              {accFull ? "FOUNDERS ALLOCATION CLOSED" : "ACCELERATOR SPOTS REMAINING"}
            </div>
          </div>
        </div>
      </div>

      {/* Features preview */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "60px 40px" }}>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 36, letterSpacing: 3, textAlign: "center", marginBottom: 12 }}>What's Inside</h2>
        <p style={{ textAlign: "center", color: "#8A95A3", fontSize: 17, marginBottom: 44, fontStyle: "italic" }}>Everything a commanding family needs in one suite</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {[
            { icon: "chat", title: "AI Life Coach", desc: "Personalized coaching conversations for goals, values, and family planning", color: "#C9A84C" },
            { icon: "chart", title: "4-Horizon Timeline", desc: "Visual planning across 1, 3–5, 10, and 20-year horizons", color: "#4A8FBF" },
            { icon: "users", title: "Family Command", desc: "Individual goal tracking for each family member across 7 life domains", color: "#3AA876" },
            { icon: "calendar", title: "Strategic Calendar", desc: "Milestone tracking and family event coordination", color: "#D4679A" },
            { icon: "target", title: "Domain Planning", desc: "Career, education, finances, health, relationships, home & growth", color: "#7B68D4" },
            { icon: "trophy", title: "Progress Tracking", desc: "Achievement tracking, completion rates, and family alignment scores", color: "#C9A84C" },
          ].map((f, i) => (
            <div key={i} className="module-card" style={{ padding: 24 }}>
              <div style={{ width: 36, height: 36, background: f.color + "18", border: `1px solid ${f.color}33`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Icon name={f.icon} size={18} color={f.color} />
              </div>
              <p style={{ fontFamily: "'Bebas Neue'", fontSize: 18, letterSpacing: 1, marginBottom: 6 }}>{f.title}</p>
              <p style={{ color: "#8A95A3", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "20px 40px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 40, letterSpacing: 3, marginBottom: 10 }}>Select Your Entry Path</h2>
          <p style={{ color: "#8A95A3", fontSize: 17 }}>Three tiers. One mission. Your family's future.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 22 }}>
          {/* CORE */}
          <div className="card" style={{ padding: 34, display: "flex", flexDirection: "column" }}>
            <span className="tag" style={{ background: "#1E2329", color: "#8A95A3", display: "inline-block", marginBottom: 18, width: "fit-content" }}>CORE ENTRY</span>
            <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: 26, letterSpacing: 2, marginBottom: 6 }}>The Discipline Code™</h3>
            <p style={{ color: "#8A95A3", fontSize: 14, marginBottom: 22, fontStyle: "italic" }}>Digital Edition</p>
            <div style={{ marginBottom: 22 }}>
              <span style={{ fontFamily: "'Bebas Neue'", fontSize: 44, color: "#C9A84C" }}>$44.99</span>
            </div>
            <ul style={{ listStyle: "none", marginBottom: 28, flex: 1 }}>
              {["Immediate eBook access", "Lifetime digital license", "Unlock Command Suite (if available)"].map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: "#BEC8D4", fontSize: 15 }}>
                  <Icon name="check" size={13} color="#C9A84C" /> {f}
                </li>
              ))}
            </ul>
            <button className="btn-gold" style={{ padding: "13px 22px", fontSize: 14, width: "100%" }} onClick={() => onNavigate("checkout")}>ACQUIRE NOW</button>
          </div>

          {/* SUITE */}
          <div className="card glow-border" style={{ padding: 34, borderColor: "#C9A84C44", display: "flex", flexDirection: "column", position: "relative" }}>
            <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#C9A84C", color: "#080A0D", fontFamily: "'Bebas Neue'", fontSize: 11, letterSpacing: 2, padding: "4px 14px", whiteSpace: "nowrap" }}>
              {suiteFull ? "ALLOCATION CLOSED" : "MOST POPULAR"}
            </div>
            <span className="tag" style={{ background: "#C9A84C12", color: "#C9A84C", border: "1px solid #C9A84C33", display: "inline-block", marginBottom: 18, width: "fit-content" }}>BONUS TIER</span>
            <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: 26, letterSpacing: 2, marginBottom: 6 }}>Command Your Life Suite™</h3>
            <p style={{ color: "#8A95A3", fontSize: 14, marginBottom: 22, fontStyle: "italic" }}>Full Planning Dashboard — Free with Core</p>
            <div style={{ marginBottom: 22 }}>
              <span style={{ textDecoration: "line-through", color: "#3A4450", fontFamily: "'DM Mono'", fontSize: 16, marginRight: 10 }}>$349</span>
              {suiteFull
                ? <span style={{ fontFamily: "'Bebas Neue'", fontSize: 26, color: "#B03A2E" }}>ALLOCATION CLOSED</span>
                : <span style={{ fontFamily: "'Bebas Neue'", fontSize: 32, color: "#C9A84C" }}>INCLUDED FREE</span>}
            </div>
            {!suiteFull && (
              <div style={{ background: "#C9A84C12", border: "1px solid #C9A84C33", padding: "7px 12px", marginBottom: 18, fontFamily: "'DM Mono'", fontSize: 10, color: "#C9A84C", letterSpacing: 1 }}>
                ⚡ {app.commandSuiteRemaining} OF 100 SPOTS REMAINING
              </div>
            )}
            <ul style={{ listStyle: "none", marginBottom: 28, flex: 1 }}>
              {["AI Life Coach (chat)", "4-Horizon Timeline", "Family goal tracking", "7-domain planning", "Calendar & milestones"].map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: "#BEC8D4", fontSize: 15 }}>
                  <Icon name="check" size={13} color="#C9A84C" /> {f}
                </li>
              ))}
            </ul>
            <button className="btn-gold" style={{ padding: "13px 22px", fontSize: 14, width: "100%" }} onClick={() => onNavigate("checkout")}>
              {suiteFull ? "GET CORE ENTRY" : "CLAIM FREE SUITE"}
            </button>
          </div>

          {/* ACCELERATOR */}
          <div className="card" style={{ padding: 34, display: "flex", flexDirection: "column" }}>
            <span className="tag" style={{ background: "#4A8FBF12", color: "#4A8FBF", border: "1px solid #4A8FBF33", display: "inline-block", marginBottom: 18, width: "fit-content" }}>PREMIUM UPGRADE</span>
            <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: 26, letterSpacing: 2, marginBottom: 6 }}>Master Coaching Accelerator™</h3>
            <p style={{ color: "#8A95A3", fontSize: 14, marginBottom: 22, fontStyle: "italic" }}>3-Month Founders Access</p>
            <div style={{ marginBottom: 22 }}>
              <span style={{ textDecoration: "line-through", color: "#3A4450", fontFamily: "'DM Mono'", fontSize: 16, marginRight: 10 }}>$849</span>
              {accFull
                ? <span style={{ fontFamily: "'Bebas Neue'", fontSize: 26, color: "#B03A2E" }}>FOUNDERS CLOSED</span>
                : <span style={{ fontFamily: "'Bebas Neue'", fontSize: 44, color: "#4A8FBF" }}>$349</span>}
            </div>
            {!accFull && (
              <div style={{ background: "#4A8FBF12", border: "1px solid #4A8FBF33", padding: "7px 12px", marginBottom: 18, fontFamily: "'DM Mono'", fontSize: 10, color: "#4A8FBF", letterSpacing: 1 }}>
                ⚡ {app.acceleratorRemaining} OF 75 FOUNDERS SPOTS LEFT
              </div>
            )}
            <ul style={{ listStyle: "none", marginBottom: 28, flex: 1 }}>
              {["Everything in Core + Suite", "Monthly book drops", "Coaching technique library", "Discounted leadership tools", "Curated professional coaches", "Private community portal"].map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: "#BEC8D4", fontSize: 15 }}>
                  <Icon name="check" size={13} color="#4A8FBF" /> {f}
                </li>
              ))}
            </ul>
            <button className="btn-ghost" style={{ padding: "13px 22px", fontSize: 14, width: "100%", borderColor: accFull ? "#2C3340" : "#4A8FBF55", color: accFull ? "#3A4450" : "#4A8FBF" }}
              onClick={() => !accFull && onNavigate("checkout")}>
              {accFull ? "FOUNDERS ALLOCATION CLOSED" : "UPGRADE TO ACCELERATOR"}
            </button>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid #1E2329", padding: "36px 40px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Bebas Neue'", fontSize: 15, letterSpacing: 3, color: "#C9A84C", marginBottom: 6 }}>COMMAND YOUR LIFE SUITE™</p>
        <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: "#3A4450", letterSpacing: 1 }}>EMPOWERING FAMILIES &amp; TEAMS TO EXCEL</p>
      </footer>
    </div>
  );
};

/* ─── AUTH PAGE ───────────────────────────────────────────────────────────── */
const AuthPage = ({ mode = "login", onAuth, onSwitch }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const isReg = mode === "register";
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#080A0D" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ width: 50, height: 50, border: "1px solid #C9A84C", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
            <Icon name="shield" size={22} color="#C9A84C" />
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 30, letterSpacing: 3, marginBottom: 6 }}>
            {isReg ? "CREATE YOUR COMMAND" : "ACCESS YOUR COMMAND"}
          </h1>
          <p style={{ color: "#8A95A3", fontSize: 14, fontStyle: "italic" }}>Command Your Life Suite™</p>
        </div>
        <div className="card" style={{ padding: 32 }}>
          {isReg && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 7 }}>FULL NAME</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Commander's name" />
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 7 }}>EMAIL ADDRESS</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
          </div>
          <div style={{ marginBottom: 26 }}>
            <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 7 }}>PASSWORD</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>
          <button className="btn-gold" style={{ width: "100%", padding: "14px", fontSize: 15 }}
            onClick={() => onAuth({ name: form.name || form.email.split("@")[0], email: form.email })}>
            {isReg ? "CREATE ACCOUNT & CONTINUE" : "ACCESS DASHBOARD"}
          </button>
          <hr className="divider" />
          <p style={{ textAlign: "center", color: "#8A95A3", fontSize: 14 }}>
            {isReg ? "Already have access? " : "New commander? "}
            <span style={{ color: "#C9A84C", cursor: "pointer" }} onClick={onSwitch}>
              {isReg ? "Sign in" : "Create account"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─── CHECKOUT ────────────────────────────────────────────────────────────── */
const CheckoutPage = ({ app, user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [card, setCard] = useState({ num: "", exp: "", cvc: "", name: "" });

  const suiteFull = app.commandSuiteRemaining <= 0;
  const accFull = app.acceleratorRemaining <= 0;

  const tiers = [
    { id: "core", label: "The Discipline Code™", price: 44.99, desc: "Digital Edition + eBook Access" },
    ...(!suiteFull ? [{ id: "suite", label: "Command Your Life Suite™", price: 44.99, desc: "Core + Full Dashboard FREE ($349 value)", bonus: "$349 VALUE FREE" }] : []),
    ...(!accFull ? [{ id: "accelerator", label: "Full Accelerator Bundle", price: 393.99, desc: "Core + Suite + Master Coaching Accelerator™", bonus: "FOUNDERS RATE: Save $500" }] : []),
  ];

  const finalPrice = selectedTier
    ? couponApplied
      ? (tiers.find(t => t.id === selectedTier)?.price * 0.9).toFixed(2)
      : tiers.find(t => t.id === selectedTier)?.price.toFixed(2)
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "#080A0D", padding: "56px 24px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 11, letterSpacing: 3, color: "#C9A84C", marginBottom: 10 }}>STEP {step} OF 3</p>
          <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 34, letterSpacing: 3 }}>
            {step === 1 ? "SELECT YOUR PATH" : step === 2 ? "SECURE PAYMENT" : "ACCESS UNLOCKED"}
          </h1>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 18 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ width: s <= step ? 36 : 18, height: 3, background: s <= step ? "#C9A84C" : "#1E2329", transition: "all .3s", borderRadius: 2 }} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="fu">
            {tiers.map(t => (
              <div key={t.id} onClick={() => setSelectedTier(t.id)} className="card" style={{
                padding: 22, marginBottom: 14, cursor: "pointer",
                borderColor: selectedTier === t.id ? "#C9A84C" : "#1E2329",
                background: selectedTier === t.id ? "#C9A84C07" : "#0F1216"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontFamily: "'Bebas Neue'", fontSize: 19, letterSpacing: 1, marginBottom: 3 }}>{t.label}</p>
                    <p style={{ color: "#8A95A3", fontSize: 13, fontStyle: "italic" }}>{t.desc}</p>
                    {t.bonus && <span className="tag badge-gold" style={{ marginTop: 7, display: "inline-block" }}>{t.bonus}</span>}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                    <p style={{ fontFamily: "'Bebas Neue'", fontSize: 26, color: "#C9A84C" }}>${t.price.toFixed(2)}</p>
                    {selectedTier === t.id && <Icon name="check" size={16} color="#C9A84C" />}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, marginTop: 22, marginBottom: 28 }}>
              <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon or unlock code" style={{ flex: 1 }} />
              <button className="btn-ghost" style={{ padding: "11px 18px", whiteSpace: "nowrap", fontSize: 12 }}
                onClick={() => app.coupons.includes(coupon.toUpperCase()) && setCouponApplied(true)}>APPLY</button>
            </div>
            {couponApplied && <p style={{ color: "#C9A84C", fontFamily: "'DM Mono'", fontSize: 11, marginBottom: 14, letterSpacing: 1 }}>✓ COUPON APPLIED — 10% DISCOUNT</p>}
            <button className="btn-gold" style={{ width: "100%", padding: 14, fontSize: 15, opacity: selectedTier ? 1 : 0.4, cursor: selectedTier ? "pointer" : "not-allowed" }}
              disabled={!selectedTier} onClick={() => setStep(2)}>
              CONTINUE TO PAYMENT
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="fu">
            <div className="card" style={{ padding: 30, marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
                <Icon name="shield" size={14} color="#C9A84C" />
                <span style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3" }}>256-BIT ENCRYPTED · SECURE CHECKOUT</span>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 7 }}>CARDHOLDER NAME</label>
                <input value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} placeholder="Name on card" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 7 }}>CARD NUMBER</label>
                <input value={card.num} onChange={e => setCard({ ...card, num: e.target.value })} placeholder="0000 0000 0000 0000" style={{ fontFamily: "'DM Mono'" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
                <div>
                  <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 7 }}>EXPIRY</label>
                  <input value={card.exp} onChange={e => setCard({ ...card, exp: e.target.value })} placeholder="MM / YY" style={{ fontFamily: "'DM Mono'" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 7 }}>CVC</label>
                  <input value={card.cvc} onChange={e => setCard({ ...card, cvc: e.target.value })} placeholder="•••" style={{ fontFamily: "'DM Mono'" }} />
                </div>
              </div>
              <div style={{ background: "#080A0D", padding: 18, marginBottom: 22, borderRadius: 2 }}>
                <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 10 }}>ORDER SUMMARY</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 15 }}>
                  <span style={{ color: "#BEC8D4" }}>{tiers.find(t => t.id === selectedTier)?.label}</span>
                  <span>${tiers.find(t => t.id === selectedTier)?.price.toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, color: "#C9A84C" }}>
                    <span>Coupon discount</span><span>-10%</span>
                  </div>
                )}
                <hr className="divider" style={{ margin: "10px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Bebas Neue'", fontSize: 21, letterSpacing: 1 }}>
                  <span>TOTAL</span>
                  <span style={{ color: "#C9A84C" }}>${finalPrice}</span>
                </div>
              </div>
              <button className="btn-gold" style={{ width: "100%", padding: 14, fontSize: 15 }} onClick={() => { onComplete(selectedTier); setStep(3); }}>
                COMPLETE PURCHASE · ${finalPrice}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fu" style={{ textAlign: "center" }}>
            <div style={{ width: 68, height: 68, border: "1px solid #C9A84C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 26px" }}>
              <Icon name="check" size={30} color="#C9A84C" />
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 3, marginBottom: 10 }}>ACCESS CONFIRMED</h2>
            <p style={{ color: "#8A95A3", fontSize: 17, fontStyle: "italic", marginBottom: 32 }}>Welcome to Command Your Life Suite™</p>
            <p style={{ color: "#BEC8D4", fontSize: 15, marginBottom: 36, lineHeight: 1.75 }}>
              A confirmation has been dispatched to your registered address.<br />
              Your command center is ready.
            </p>
            <button className="btn-gold" style={{ padding: "15px 44px", fontSize: 15 }} onClick={() => onComplete(selectedTier, true)}>
              ENTER YOUR COMMAND CENTER
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── ONBOARDING ──────────────────────────────────────────────────────────── */
const Onboarding = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const TOTAL = 4;
  const [data, setData] = useState({
    members: [{ id: 1, name: user?.name || "", dob: "", role: "Self" }],
    values: [],
    goals: {},
  });
  const [newMember, setNewMember] = useState({ name: "", dob: "", role: "Partner" });

  const roles = ["Self", "Partner", "Child", "Parent", "Other"];

  const addMember = () => {
    if (!newMember.name) return;
    setData(d => ({ ...d, members: [...d.members, { ...newMember, id: Date.now() }] }));
    setNewMember({ name: "", dob: "", role: "Child" });
  };

  const toggleValue = (v) => {
    setData(d => ({
      ...d,
      values: d.values.includes(v) ? d.values.filter(x => x !== v) : d.values.length < 5 ? [...d.values, v] : d.values
    }));
  };

  const addGoal = (memberId, domain, horizon, text) => {
    if (!text.trim()) return;
    setData(d => {
      const key = memberId;
      const existing = d.goals[key] || [];
      return { ...d, goals: { ...d.goals, [key]: [...existing, { id: Date.now(), domain, horizon, text, done: false }] } };
    });
  };

  return (
    <div className="ob-overlay">
      <div className="ob-card fu">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
            {Array.from({ length: TOTAL }).map((_, i) => (
              <div key={i} className={`ob-step-dot ${i + 1 <= step ? "active" : ""}`} />
            ))}
          </div>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 3, color: "#C9A84C", marginBottom: 8 }}>
            STEP {step} OF {TOTAL}
          </p>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 30, letterSpacing: 3 }}>
            {step === 1 ? "YOUR HOUSEHOLD" : step === 2 ? "CORE VALUES" : step === 3 ? "FIRST GOALS" : "READY TO COMMAND"}
          </h2>
          <p style={{ color: "#8A95A3", fontSize: 15, fontStyle: "italic", marginTop: 6 }}>
            {step === 1 ? "Add your family members" : step === 2 ? "Choose up to 5 values that guide your family" : step === 3 ? "Set your first goals across horizons" : "Your command center is configured"}
          </p>
        </div>

        {/* Step 1: Members */}
        {step === 1 && (
          <div>
            {data.members.map((m, i) => (
              <div key={m.id} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: getMemberColor(i) + "22", color: getMemberColor(i), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue'", fontSize: 14, flexShrink: 0 }}>
                  {m.name[0] || "?"}
                </div>
                <input value={m.name} onChange={e => setData(d => ({ ...d, members: d.members.map(x => x.id === m.id ? { ...x, name: e.target.value } : x) }))} placeholder="Name" style={{ flex: 2 }} />
                <input type="date" value={m.dob} onChange={e => setData(d => ({ ...d, members: d.members.map(x => x.id === m.id ? { ...x, dob: e.target.value } : x) }))} style={{ flex: 2 }} />
                <select value={m.role} onChange={e => setData(d => ({ ...d, members: d.members.map(x => x.id === m.id ? { ...x, role: e.target.value } : x) }))} style={{ flex: 1.5 }}>
                  {roles.map(r => <option key={r}>{r}</option>)}
                </select>
                {i > 0 && <button onClick={() => setData(d => ({ ...d, members: d.members.filter(x => x.id !== m.id) }))} className="btn-danger" style={{ padding: "8px 10px", flexShrink: 0 }}><Icon name="x" size={12} /></button>}
              </div>
            ))}
            <hr className="divider" />
            <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 10 }}>ADD FAMILY MEMBER</p>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <input value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} placeholder="Name" style={{ flex: 2 }} />
              <input type="date" value={newMember.dob} onChange={e => setNewMember({ ...newMember, dob: e.target.value })} style={{ flex: 2 }} />
              <select value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })} style={{ flex: 1.5 }}>
                {roles.map(r => <option key={r}>{r}</option>)}
              </select>
              <button className="btn-ghost" style={{ padding: "8px 12px", flexShrink: 0 }} onClick={addMember}><Icon name="plus" size={14} /></button>
            </div>
          </div>
        )}

        {/* Step 2: Values */}
        {step === 2 && (
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {VALUES_OPTIONS.map(v => {
                const selected = data.values.includes(v);
                return (
                  <button key={v} onClick={() => toggleValue(v)} style={{
                    padding: "8px 14px", fontFamily: "'DM Mono'", fontSize: 11, letterSpacing: 1, cursor: "pointer", transition: "all .2s", borderRadius: 2, border: `1px solid ${selected ? "#C9A84C" : "#2C3340"}`,
                    background: selected ? "#C9A84C18" : "transparent", color: selected ? "#C9A84C" : "#8A95A3"
                  }}>
                    {v.toUpperCase()}
                  </button>
                );
              })}
            </div>
            <p style={{ marginTop: 16, fontFamily: "'DM Mono'", fontSize: 10, color: "#4A5568", letterSpacing: 1 }}>
              {data.values.length}/5 SELECTED: {data.values.join(", ") || "—"}
            </p>
          </div>
        )}

        {/* Step 3: First Goals */}
        {step === 3 && (
          <div>
            {data.members.slice(0, 2).map((m, mi) => (
              <div key={m.id} style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: "'Bebas Neue'", fontSize: 18, letterSpacing: 2, color: getMemberColor(mi), marginBottom: 12 }}>
                  {m.name || "Member"}'s First Goal
                </p>
                <GoalForm memberId={m.id} onAdd={addGoal} />
                {(data.goals[m.id] || []).map(g => (
                  <div key={g.id} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 0", fontSize: 13, color: "#8A95A3" }}>
                    <Icon name="check" size={12} color="#C9A84C" />
                    <span>{g.text}</span>
                    <span className="badge badge-muted" style={{ marginLeft: "auto" }}>{HORIZONS.find(h => h.key === g.horizon)?.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Step 4: Ready */}
        {step === 4 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
            <p style={{ color: "#BEC8D4", fontSize: 16, lineHeight: 1.75, marginBottom: 24 }}>
              <strong style={{ color: "#C9A84C" }}>{data.members.length} family member{data.members.length !== 1 ? "s" : ""}</strong> configured.<br />
              <strong style={{ color: "#C9A84C" }}>{data.values.length} core values</strong> set.<br />
              <strong style={{ color: "#C9A84C" }}>{Object.values(data.goals).flat().length} goals</strong> entered.
            </p>
            <p style={{ color: "#8A95A3", fontSize: 15, fontStyle: "italic" }}>
              Your command center is ready. Begin your first coaching session, explore your timeline, or dive into strategic planning.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
          {step > 1 ? (
            <button className="btn-ghost" style={{ padding: "11px 22px", fontSize: 13 }} onClick={() => setStep(s => s - 1)}>← BACK</button>
          ) : <div />}
          {step < TOTAL ? (
            <button className="btn-gold" style={{ padding: "11px 28px", fontSize: 14 }} onClick={() => setStep(s => s + 1)}>CONTINUE →</button>
          ) : (
            <button className="btn-gold" style={{ padding: "11px 28px", fontSize: 14 }} onClick={() => onComplete(data)}>ENTER COMMAND CENTER →</button>
          )}
        </div>
      </div>
    </div>
  );
};

const GoalForm = ({ memberId, onAdd }) => {
  const [text, setText] = useState("");
  const [domain, setDomain] = useState("career");
  const [horizon, setHorizon] = useState("1yr");
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Describe this goal..." style={{ flex: 3 }} onKeyDown={e => e.key === "Enter" && text && (onAdd(memberId, domain, horizon, text), setText(""))} />
      <select value={domain} onChange={e => setDomain(e.target.value)} style={{ flex: 1.5, fontSize: 13 }}>
        {DOMAINS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
      </select>
      <select value={horizon} onChange={e => setHorizon(e.target.value)} style={{ flex: 1.2, fontSize: 13 }}>
        {HORIZONS.map(h => <option key={h.key} value={h.key}>{h.label}</option>)}
      </select>
      <button className="btn-gold" style={{ padding: "10px 14px", flexShrink: 0 }} onClick={() => { if (text) { onAdd(memberId, domain, horizon, text); setText(""); } }}>
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
};

/* ─── DASHBOARD ───────────────────────────────────────────────────────────── */
const Dashboard = ({ user, tier, app, lifeData, setLifeData, onLogout }) => {
  const [section, setSection] = useState("overview");
  const hasAccelerator = tier === "accelerator";
  const hasSuite = tier === "suite" || hasAccelerator;

  const sidebarLinks = [
    { id: "overview", icon: "home", label: "Command Overview" },
    { id: "coaching", icon: "chat", label: "AI Life Coach" },
    { id: "timeline", icon: "chart", label: "4-Horizon Timeline" },
    { id: "planning", icon: "target", label: "Goals & Planning" },
    { id: "family", icon: "users", label: "Family Members" },
    { id: "calendar", icon: "calendar", label: "Calendar" },
    ...(hasAccelerator ? [{ id: "community", icon: "rocket", label: "Community Portal" }] : []),
    { id: "settings", icon: "settings", label: "Account Settings" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div className="sidebar" style={{ width: 232, flexShrink: 0, position: "sticky", top: 0, height: "100vh", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ padding: "22px 18px", borderBottom: "1px solid #1E2329" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 30, height: 30, border: "1px solid #C9A84C", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="shield" size={13} color="#C9A84C" />
            </div>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: 14, letterSpacing: 2, color: "#C9A84C" }}>CYLS™</span>
          </div>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 1, color: "#6A7585", marginBottom: 3 }}>COMMANDER</p>
          <p style={{ fontSize: 14, color: "#F0F2F5", fontWeight: 600 }}>{user?.name}</p>
          <div style={{ marginTop: 8 }}>
            <span className={`badge ${hasAccelerator ? "badge-blue" : hasSuite ? "badge-gold" : "badge-muted"}`}>
              {hasAccelerator ? "ACCELERATOR" : hasSuite ? "COMMAND SUITE" : "CORE"}
            </span>
          </div>
        </div>

        <div style={{ padding: "12px 0", flex: 1 }}>
          {sidebarLinks.map(link => (
            <div key={link.id} className={`sidebar-item ${section === link.id ? "active" : ""}`}
              onClick={() => setSection(link.id)}>
              <Icon name={link.icon} size={13} color={section === link.id ? "#C9A84C" : "#6A7585"} />
              <span>{link.label}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid #1E2329" }}>
          <div className="sidebar-item" onClick={onLogout}>
            <Icon name="logout" size={13} color="#6A7585" />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: "auto", background: "#080A0D" }}>
        <div style={{ padding: "18px 36px", borderBottom: "1px solid #1E2329", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#080A0Ddd", backdropFilter: "blur(12px)", zIndex: 10 }}>
          <div>
            <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#6A7585" }}>COMMAND YOUR LIFE SUITE™</p>
            <p style={{ fontSize: 11, color: "#3A4450", fontStyle: "italic" }}>Empowering Families &amp; Teams to Excel</p>
          </div>
          {hasAccelerator && (
            <div style={{ background: "#4A8FBF12", border: "1px solid #4A8FBF33", padding: "5px 12px", fontFamily: "'DM Mono'", fontSize: 10, color: "#4A8FBF", letterSpacing: 1 }}>
              ACCELERATOR — 90 DAYS ACTIVE
            </div>
          )}
        </div>

        <div style={{ padding: "36px" }}>
          {section === "overview" && <OverviewPanel user={user} tier={tier} app={app} lifeData={lifeData} hasSuite={hasSuite} hasAccelerator={hasAccelerator} onNavigate={setSection} />}
          {section === "coaching" && <CoachingPanel lifeData={lifeData} setLifeData={setLifeData} />}
          {section === "timeline" && <TimelinePanel lifeData={lifeData} />}
          {section === "planning" && <PlanningPanel lifeData={lifeData} setLifeData={setLifeData} />}
          {section === "family" && <FamilyPanel lifeData={lifeData} setLifeData={setLifeData} />}
          {section === "calendar" && <CalendarPanel lifeData={lifeData} />}
          {section === "community" && hasAccelerator && <CommunityPanel />}
          {section === "settings" && <SettingsPanel user={user} lifeData={lifeData} setLifeData={setLifeData} />}
        </div>
      </div>
    </div>
  );
};

/* ─── OVERVIEW PANEL ──────────────────────────────────────────────────────── */
const OverviewPanel = ({ user, tier, app, lifeData, hasSuite, hasAccelerator, onNavigate }) => {
  const today = new Date();
  const quote = QUOTES[today.getDate() % QUOTES.length];
  const members = lifeData.members || [];
  const goals = lifeData.goals || {};
  const allGoals = Object.values(goals).flat();
  const doneGoals = allGoals.filter(g => g.done);

  return (
    <div className="fu">
      <div style={{ marginBottom: 32 }}>
        <div style={{ background: "#0A0C10", border: "1px solid #C9A84C22", padding: "20px 24px", marginBottom: 28 }}>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#C9A84C66", marginBottom: 8 }}>TODAY'S COMMAND</p>
          <blockquote style={{ fontFamily: "'Cormorant Garamond'", fontSize: 19, fontStyle: "italic", color: "#BEC8D4", lineHeight: 1.6, marginBottom: 6 }}>
            "{quote[0]}"
          </blockquote>
          <cite style={{ fontFamily: "'DM Mono'", fontSize: 10, color: "#6A7585" }}>— {quote[1]}</cite>
        </div>

        <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 34, letterSpacing: 3, marginBottom: 4 }}>
          Welcome Back, {user?.name?.split(" ")[0]}
        </h1>
        <p style={{ color: "#8A95A3", fontSize: 17, fontStyle: "italic", marginBottom: 28 }}>Your command center is active</p>

        {/* Status cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18, marginBottom: 36 }}>
          <div className="card" style={{ padding: 22 }}>
            <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 10 }}>TOTAL GOALS</p>
            <p style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: "#C9A84C", letterSpacing: 2 }}>{allGoals.length}</p>
            <p style={{ color: "#4A5568", fontSize: 12, marginTop: 3 }}>{doneGoals.length} completed</p>
          </div>
          <div className="card" style={{ padding: 22 }}>
            <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 10 }}>FAMILY MEMBERS</p>
            <p style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: "#4A8FBF", letterSpacing: 2 }}>{members.length}</p>
            <p style={{ color: "#4A5568", fontSize: 12, marginTop: 3 }}>In your household</p>
          </div>
          <div className="card" style={{ padding: 22 }}>
            <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 10 }}>ACHIEVEMENT RATE</p>
            <p style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: "#3AA876", letterSpacing: 2 }}>
              {allGoals.length ? Math.round(doneGoals.length / allGoals.length * 100) : 0}%
            </p>
            <p style={{ color: "#4A5568", fontSize: 12, marginTop: 3 }}>Overall completion</p>
          </div>
          <div className="card" style={{ padding: 22 }}>
            <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 10 }}>ACTIVE VALUES</p>
            <p style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: "#7B68D4", letterSpacing: 2 }}>{(lifeData.values || []).length}</p>
            <p style={{ color: "#4A5568", fontSize: 12, marginTop: 3 }}>Core values guiding you</p>
          </div>
        </div>

        {/* Domain progress */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 36 }}>
          <div className="card" style={{ padding: 24 }}>
            <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 18 }}>PROGRESS BY DOMAIN</p>
            {DOMAINS.map(d => {
              const dGoals = allGoals.filter(g => g.domain === d.key);
              const pct = dGoals.length ? Math.round(dGoals.filter(g => g.done).length / dGoals.length * 100) : 0;
              return (
                <div key={d.key} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13 }}>
                    <span style={{ color: "#BEC8D4" }}>{d.emoji} {d.label}</span>
                    <span style={{ fontFamily: "'DM Mono'", fontSize: 11, color: "#6A7585" }}>{dGoals.length}g · {pct}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: d.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card" style={{ padding: 24 }}>
            <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 18 }}>RECENT WINS</p>
            {doneGoals.length === 0 ? (
              <div style={{ color: "#3A4450", fontSize: 14, fontStyle: "italic" }}>Complete goals to see your wins here</div>
            ) : doneGoals.slice(-5).reverse().map((g, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #13181E" }}>
                <span style={{ fontSize: 16 }}>{DOMAINS.find(d => d.key === g.domain)?.emoji || "✓"}</span>
                <span style={{ fontSize: 13, color: "#BEC8D4", flex: 1 }}>{g.text}</span>
                <span className="badge badge-green">✓</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
          {[
            { label: "Start Coaching", icon: "chat", section: "coaching", color: "#C9A84C" },
            { label: "View Timeline", icon: "chart", section: "timeline", color: "#4A8FBF" },
            { label: "Add Goals", icon: "target", section: "planning", color: "#3AA876" },
            { label: "Family Hub", icon: "users", section: "family", color: "#D4679A" },
          ].map(a => (
            <button key={a.section} onClick={() => onNavigate(a.section)} className="btn-ghost" style={{
              padding: "14px 16px", borderColor: a.color + "44", color: a.color, display: "flex", alignItems: "center", gap: 8, fontSize: 13, justifyContent: "center"
            }}>
              <Icon name={a.icon} size={14} color={a.color} /> {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── COACHING PANEL ──────────────────────────────────────────────────────── */
const CoachingPanel = ({ lifeData, setLifeData }) => {
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messages = lifeData.chatHistory || [];

  useEffect(() => {
    if (messages.length === 0) {
      const members = lifeData.members || [];
      const firstName = members[0]?.name || "Commander";
      const vals = (lifeData.values || []).join(", ") || "your family's values";
      addAI(`Welcome to your personal command coaching session. 🌟\n\nI'm your Command Life Coach — built to help **${firstName}** and your household build a life of intention, discipline, and legacy.\n\nI see your family is focused on **${vals}**. That's a powerful foundation.\n\nWhat's on your mind today? We can explore your goals, work through a challenge, think bigger about your vision, or simply reflect on where you are.\n\nWhat would you like to command today?`);
    } else {
      messagesEndRef.current?.scrollIntoView();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const addAI = (text) => {
    setLifeData(d => ({ ...d, chatHistory: [...(d.chatHistory || []), { role: "ai", content: text }] }));
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setLifeData(d => ({ ...d, chatHistory: [...(d.chatHistory || []), { role: "user", content: text }] }));
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const resp = generateAIResponse(text, lifeData.members || [], lifeData.goals || {}, lifeData.values || []);
      setLifeData(d => ({ ...d, chatHistory: [...(d.chatHistory || []), { role: "ai", content: resp }] }));
    }, 1000 + Math.random() * 800);
  };

  const quickPrompts = [
    "Review my goals",
    "Think bigger — stretch goals",
    "5-year family vision",
    "What are my biggest opportunities?",
  ];

  const formatMsg = (text) => text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#E8C96A">$1</strong>')
    .replace(/\n/g, '<br>');

  return (
    <div className="fu" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 130px)" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 32, letterSpacing: 3, marginBottom: 4 }}>AI LIFE COACH</h1>
        <p style={{ color: "#8A95A3", fontSize: 15, fontStyle: "italic" }}>Your personal planning coach — powered by AI</p>
      </div>

      {/* Topic pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {DOMAINS.map(d => (
          <button key={d.key} className="domain-pill" onClick={() => { setInput(`Let's talk about ${d.label.toLowerCase()}`); }}
            style={{ background: d.color + "18", color: d.color, border: `1px solid ${d.color}44`, fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 1 }}>
            {d.emoji} {d.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", marginBottom: 16, paddingRight: 4 }}>
        {messages.map((m, i) => (
          <div key={i} className={m.role === "ai" ? "msg-ai" : "msg-user"}>
            {m.role === "ai" && <div className="msg-sender">🛡 COMMAND LIFE COACH</div>}
            <div className="msg-bubble" dangerouslySetInnerHTML={{ __html: formatMsg(m.content) }} />
          </div>
        ))}
        {typing && (
          <div className="msg-ai">
            <div className="msg-sender">🛡 COMMAND LIFE COACH</div>
            <div className="msg-bubble" style={{ padding: "14px 18px" }}>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {quickPrompts.map(p => (
          <button key={p} onClick={() => { setInput(p); }} style={{
            padding: "5px 12px", fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 1, cursor: "pointer",
            background: "transparent", border: "1px solid #2C3340", color: "#6A7585", borderRadius: 2, transition: "all .15s"
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9A84C44"; e.currentTarget.style.color = "#C9A84C"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#2C3340"; e.currentTarget.style.color = "#6A7585"; }}>
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 10 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask your coach anything about your goals, family, or future..."
          rows={2}
          style={{ flex: 1, resize: "none", fontFamily: "'Cormorant Garamond'", fontSize: 16, lineHeight: 1.5 }}
        />
        <button className="btn-gold" style={{ padding: "12px 18px", alignSelf: "flex-end" }} onClick={send}>
          <Icon name="send" size={15} />
        </button>
      </div>
    </div>
  );
};

/* ─── TIMELINE PANEL ──────────────────────────────────────────────────────── */
const TimelinePanel = ({ lifeData }) => {
  const goals = lifeData.goals || {};
  const allGoals = Object.values(goals).flat();

  return (
    <div className="fu">
      <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 32, letterSpacing: 3, marginBottom: 6 }}>4-HORIZON TIMELINE</h1>
      <p style={{ color: "#8A95A3", fontStyle: "italic", marginBottom: 36 }}>Long-horizon vision for leaders who think generationally</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 48 }}>
        {HORIZONS.map(h => {
          const hGoals = allGoals.filter(g => g.horizon === h.key);
          const done = hGoals.filter(g => g.done).length;
          const pct = hGoals.length ? Math.round(done / hGoals.length * 100) : 0;
          return (
            <div key={h.key} className="card" style={{ padding: 26, borderColor: h.color + "33" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <p style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: h.color, letterSpacing: 2 }}>{h.label}</p>
                <span className="badge" style={{ background: h.color + "18", color: h.color, border: `1px solid ${h.color}33` }}>
                  {hGoals.length} GOALS
                </span>
              </div>
              <div className="progress-bar-bg" style={{ marginBottom: 8 }}>
                <div className="progress-fill" style={{ width: `${pct}%`, background: h.color }} />
              </div>
              <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: "#6A7585", letterSpacing: 1, marginBottom: 18 }}>
                {done}/{hGoals.length} COMPLETE · {pct}%
              </p>
              <div>
                {hGoals.slice(0, 4).map((g, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: g.done ? h.color : "#2C3340", marginTop: 5, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: g.done ? "#6A7585" : "#BEC8D4", textDecoration: g.done ? "line-through" : "none" }}>{g.text}</span>
                  </div>
                ))}
                {hGoals.length === 0 && <p style={{ fontSize: 13, color: "#3A4450", fontStyle: "italic" }}>No goals yet for this horizon</p>}
                {hGoals.length > 4 && <p style={{ fontSize: 12, color: "#6A7585", fontFamily: "'DM Mono'" }}>+{hGoals.length - 4} MORE</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline bars visualization */}
      <div className="card" style={{ padding: 28 }}>
        <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 22 }}>VISUAL TIMELINE</p>
        {HORIZONS.map(h => {
          const hGoals = allGoals.filter(g => g.horizon === h.key);
          const width = h.key === "1yr" ? "8%" : h.key === "3yr" ? "25%" : h.key === "10yr" ? "55%" : "100%";
          return (
            <div key={h.key} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: "'DM Mono'", fontSize: 10, color: h.color, letterSpacing: 1 }}>{h.label.toUpperCase()}</span>
                <span style={{ fontFamily: "'DM Mono'", fontSize: 10, color: "#6A7585" }}>{hGoals.length} goals across {DOMAINS.filter(d => hGoals.some(g => g.domain === d.key)).length} domains</span>
              </div>
              <div style={{ background: "#0D1117", height: 36, borderRadius: 2, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: width, background: `linear-gradient(90deg, ${h.color}44, ${h.color}22)`, borderRight: `2px solid ${h.color}` }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
                  {DOMAINS.filter(d => hGoals.some(g => g.domain === d.key)).map((d, i) => (
                    <span key={i} style={{ fontSize: 14 }} title={d.label}>{d.emoji}</span>
                  ))}
                  {hGoals.length === 0 && <span style={{ fontSize: 12, color: "#3A4450", fontStyle: "italic" }}>Set goals for this horizon →</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── PLANNING PANEL ──────────────────────────────────────────────────────── */
const PlanningPanel = ({ lifeData, setLifeData }) => {
  const [activeMember, setActiveMember] = useState(lifeData.members?.[0]?.id || null);
  const [filterDomain, setFilterDomain] = useState("all");
  const [filterHorizon, setFilterHorizon] = useState("all");
  const members = lifeData.members || [];
  const goals = lifeData.goals || {};

  const member = members.find(m => m.id === activeMember);
  const memberGoals = (goals[activeMember] || []).filter(g => {
    const domainOk = filterDomain === "all" || g.domain === filterDomain;
    const horizonOk = filterHorizon === "all" || g.horizon === filterHorizon;
    return domainOk && horizonOk;
  });

  const toggleGoal = (goalId) => {
    setLifeData(d => ({
      ...d, goals: {
        ...d.goals,
        [activeMember]: (d.goals[activeMember] || []).map(g => g.id === goalId ? { ...g, done: !g.done } : g)
      }
    }));
  };

  const addGoal = (memberId, domain, horizon, text) => {
    setLifeData(d => ({
      ...d, goals: {
        ...d.goals,
        [memberId]: [...(d.goals[memberId] || []), { id: Date.now(), domain, horizon, text, done: false }]
      }
    }));
  };

  const removeGoal = (goalId) => {
    setLifeData(d => ({
      ...d, goals: {
        ...d.goals,
        [activeMember]: (d.goals[activeMember] || []).filter(g => g.id !== goalId)
      }
    }));
  };

  return (
    <div className="fu">
      <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 32, letterSpacing: 3, marginBottom: 6 }}>GOALS & PLANNING</h1>
      <p style={{ color: "#8A95A3", fontStyle: "italic", marginBottom: 28 }}>Strategic goals across all horizons and domains</p>

      {/* Member tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {members.map((m, i) => (
          <button key={m.id} onClick={() => setActiveMember(m.id)} style={{
            padding: "8px 16px", fontFamily: "'DM Mono'", fontSize: 11, letterSpacing: 1, cursor: "pointer", borderRadius: 2,
            transition: "all .2s", border: `1px solid ${activeMember === m.id ? getMemberColor(i) : "#2C3340"}`,
            background: activeMember === m.id ? getMemberColor(i) + "18" : "transparent",
            color: activeMember === m.id ? getMemberColor(i) : "#6A7585",
          }}>
            {m.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Add goal */}
      {activeMember && (
        <div className="card" style={{ padding: 20, marginBottom: 24 }}>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 12 }}>ADD NEW GOAL</p>
          <GoalForm memberId={activeMember} onAdd={addGoal} />
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585" }}>FILTER:</span>
        <select value={filterDomain} onChange={e => setFilterDomain(e.target.value)} style={{ width: "auto", fontSize: 12, fontFamily: "'DM Mono'", padding: "6px 10px" }}>
          <option value="all">All Domains</option>
          {DOMAINS.map(d => <option key={d.key} value={d.key}>{d.emoji} {d.label}</option>)}
        </select>
        <select value={filterHorizon} onChange={e => setFilterHorizon(e.target.value)} style={{ width: "auto", fontSize: 12, fontFamily: "'DM Mono'", padding: "6px 10px" }}>
          <option value="all">All Horizons</option>
          {HORIZONS.map(h => <option key={h.key} value={h.key}>{h.label}</option>)}
        </select>
      </div>

      {/* Goals list */}
      {memberGoals.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 24px", color: "#3A4450", fontSize: 16, fontStyle: "italic" }}>
          No goals yet for {member?.name || "this member"}. Add one above to begin your command.
        </div>
      ) : (
        <div>
          {HORIZONS.map(h => {
            const hGoals = memberGoals.filter(g => g.horizon === h.key);
            if (hGoals.length === 0) return null;
            return (
              <div key={h.key} style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 3, height: 18, background: h.color, borderRadius: 2 }} />
                  <p style={{ fontFamily: "'Bebas Neue'", fontSize: 18, letterSpacing: 2, color: h.color }}>{h.label}</p>
                  <span className="badge" style={{ background: h.color + "18", color: h.color, border: `1px solid ${h.color}33` }}>{hGoals.length}</span>
                </div>
                <div className="card" style={{ padding: "4px 20px" }}>
                  {hGoals.map(g => {
                    const domain = DOMAINS.find(d => d.key === g.domain);
                    return (
                      <div key={g.id} className="goal-item">
                        <div className={`goal-check ${g.done ? "done" : ""}`} onClick={() => toggleGoal(g.id)}>
                          {g.done && <Icon name="check" size={10} color="#080A0D" />}
                        </div>
                        <span style={{ fontSize: 16, marginTop: 1 }}>{domain?.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 15, color: g.done ? "#4A5568" : "#D4C9B8", textDecoration: g.done ? "line-through" : "none" }}>
                            {g.text}
                          </span>
                          <div style={{ marginTop: 3 }}>
                            <span style={{ fontFamily: "'DM Mono'", fontSize: 10, color: domain?.color || "#6A7585" }}>{domain?.label}</span>
                          </div>
                        </div>
                        <button onClick={() => removeGoal(g.id)} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.4, padding: 4 }}>
                          <Icon name="x" size={13} color="#B03A2E" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─── FAMILY PANEL ────────────────────────────────────────────────────────── */
const FamilyPanel = ({ lifeData, setLifeData }) => {
  const [adding, setAdding] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", dob: "", role: "Partner" });
  const members = lifeData.members || [];
  const goals = lifeData.goals || {};

  const addMember = () => {
    if (!newMember.name) return;
    const m = { ...newMember, id: Date.now() };
    setLifeData(d => ({ ...d, members: [...(d.members || []), m] }));
    setNewMember({ name: "", dob: "", role: "Child" });
    setAdding(false);
  };

  const removeMember = (id) => {
    setLifeData(d => ({ ...d, members: d.members.filter(m => m.id !== id) }));
  };

  return (
    <div className="fu">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 32, letterSpacing: 3, marginBottom: 4 }}>FAMILY COMMAND HUB</h1>
          <p style={{ color: "#8A95A3", fontStyle: "italic" }}>Every member of your household</p>
        </div>
        <button className="btn-gold" style={{ padding: "10px 20px", fontSize: 13 }} onClick={() => setAdding(true)}>
          <Icon name="plus" size={14} /> ADD MEMBER
        </button>
      </div>

      {adding && (
        <div className="card" style={{ padding: 24, marginBottom: 24, borderColor: "#C9A84C33" }}>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#C9A84C", marginBottom: 16 }}>NEW MEMBER</p>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 6 }}>NAME</label>
              <input value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} placeholder="Full name" />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 6 }}>DATE OF BIRTH</label>
              <input type="date" value={newMember.dob} onChange={e => setNewMember({ ...newMember, dob: e.target.value })} />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 6 }}>ROLE</label>
              <select value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })}>
                {["Self", "Partner", "Child", "Parent", "Other"].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-gold" style={{ padding: "10px 22px", fontSize: 13 }} onClick={addMember}>ADD TO HOUSEHOLD</button>
            <button className="btn-ghost" style={{ padding: "10px 18px", fontSize: 13 }} onClick={() => setAdding(false)}>CANCEL</button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
        {members.map((m, i) => {
          const mGoals = goals[m.id] || [];
          const done = mGoals.filter(g => g.done).length;
          const pct = mGoals.length ? Math.round(done / mGoals.length * 100) : 0;
          const age = getAge(m.dob);
          const color = getMemberColor(i);

          return (
            <div key={m.id} className="card" style={{ padding: 24, borderColor: color + "22" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: color + "22", border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue'", fontSize: 20, color, flexShrink: 0 }}>
                  {m.name[0]?.toUpperCase() || "?"}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Bebas Neue'", fontSize: 20, letterSpacing: 1 }}>{m.name}</p>
                  <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: "#6A7585" }}>
                    {m.role.toUpperCase()} {age !== null ? `· AGE ${age}` : ""}
                  </p>
                </div>
                {i > 0 && (
                  <button onClick={() => removeMember(m.id)} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.3 }}>
                    <Icon name="x" size={14} color="#B03A2E" />
                  </button>
                )}
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: "#8A95A3" }}>{done}/{mGoals.length} goals</span>
                  <span style={{ fontFamily: "'DM Mono'", fontSize: 11, color }}>  {pct}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {DOMAINS.filter(d => mGoals.some(g => g.domain === d.key)).map(d => (
                  <span key={d.key} style={{ fontSize: 14 }} title={d.label}>{d.emoji}</span>
                ))}
                {mGoals.length === 0 && <span style={{ fontSize: 12, color: "#3A4450", fontStyle: "italic" }}>No goals yet</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── CALENDAR PANEL ──────────────────────────────────────────────────────── */
const CalendarPanel = ({ lifeData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const goals = lifeData.goals || {};
  const allGoals = Object.values(goals).flat().filter(g => !g.done);
  const today = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="fu">
      <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 32, letterSpacing: 3, marginBottom: 6 }}>STRATEGIC CALENDAR</h1>
      <p style={{ color: "#8A95A3", fontStyle: "italic", marginBottom: 28 }}>Milestones and family events</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
        {/* Calendar */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <button className="btn-ghost" style={{ padding: "7px 14px", fontSize: 12 }} onClick={prevMonth}>← PREV</button>
            <p style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 3, color: "#C9A84C" }}>
              {MONTHS[month]} {year}
            </p>
            <button className="btn-ghost" style={{ padding: "7px 14px", fontSize: 12 }} onClick={nextMonth}>NEXT →</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(d => (
              <div key={d} style={{ textAlign: "center", fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 1, color: "#6A7585", padding: "4px 0" }}>{d}</div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
              return (
                <div key={day} className={`cal-day ${isToday ? "today" : ""}`}>
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming goals */}
        <div>
          <div className="card" style={{ padding: 22, marginBottom: 18 }}>
            <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 14 }}>ACTIVE GOALS</p>
            {allGoals.length === 0 ? (
              <p style={{ fontSize: 13, color: "#3A4450", fontStyle: "italic" }}>No active goals yet</p>
            ) : allGoals.slice(0, 8).map((g, i) => {
              const domain = DOMAINS.find(d => d.key === g.domain);
              const horizon = HORIZONS.find(h => h.key === g.horizon);
              return (
                <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid #13181E" }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{domain?.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: "#BEC8D4", lineHeight: 1.4 }}>{g.text}</p>
                    <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: domain?.color || "#6A7585", marginTop: 3 }}>{horizon?.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card" style={{ padding: 22 }}>
            <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 14 }}>FAMILY VALUES</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(lifeData.values || []).map((v, i) => (
                <span key={i} className="badge badge-gold">{v}</span>
              ))}
              {(lifeData.values || []).length === 0 && (
                <p style={{ fontSize: 13, color: "#3A4450", fontStyle: "italic" }}>Set your values in onboarding</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── COMMUNITY PANEL ─────────────────────────────────────────────────────── */
const CommunityPanel = () => (
  <div className="fu">
    <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 32, letterSpacing: 3, marginBottom: 6 }}>COMMUNITY PORTAL</h1>
    <p style={{ color: "#8A95A3", fontStyle: "italic", marginBottom: 36 }}>Master Coaching Accelerator™ — Exclusive Access</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginBottom: 32 }}>
      {[
        { label: "Coaching Library", icon: "book", desc: "Curated coaching techniques and frameworks", color: "#C9A84C" },
        { label: "Monthly Strategy Drops", icon: "rocket", desc: "Monthly book drops and leadership insights", color: "#4A8FBF" },
        { label: "Professional Coaches", icon: "users", desc: "Access to vetted leadership coaches", color: "#3AA876" },
        { label: "Live Events", icon: "calendar", desc: "Exclusive sessions and live workshops", color: "#7B68D4" },
      ].map((item, i) => (
        <div key={i} className="module-card" style={{ borderColor: item.color + "22" }}>
          <div style={{ width: 36, height: 36, background: item.color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <Icon name={item.icon} size={18} color={item.color} />
          </div>
          <p style={{ fontFamily: "'Bebas Neue'", fontSize: 19, letterSpacing: 1, marginBottom: 6 }}>{item.label}</p>
          <p style={{ color: "#8A95A3", fontSize: 13 }}>{item.desc}</p>
        </div>
      ))}
    </div>
    <div style={{ background: "#4A8FBF08", border: "1px solid #4A8FBF22", padding: 22 }}>
      <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#4A8FBF", marginBottom: 6 }}>ACCESS WINDOW</p>
      <p style={{ fontSize: 15, color: "#BEC8D4" }}>90-day access active · Renewal available at month 3</p>
    </div>
  </div>
);

/* ─── SETTINGS PANEL ──────────────────────────────────────────────────────── */
const SettingsPanel = ({ user, lifeData, setLifeData }) => {
  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);

  const toggleValue = (v) => {
    setLifeData(d => ({
      ...d,
      values: d.values?.includes(v) ? d.values.filter(x => x !== v) : (d.values || []).length < 5 ? [...(d.values || []), v] : (d.values || [])
    }));
  };

  return (
    <div className="fu">
      <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 32, letterSpacing: 3, marginBottom: 32 }}>ACCOUNT SETTINGS</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 800 }}>
        <div className="card" style={{ padding: 28 }}>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 18 }}>PROFILE</p>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 7 }}>NAME</label>
            <input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 7 }}>EMAIL</label>
            <input defaultValue={user?.email} />
          </div>
          <button className="btn-gold" style={{ padding: "11px 24px", fontSize: 13 }} onClick={() => setSaved(true)}>
            {saved ? "✓ SAVED" : "SAVE CHANGES"}
          </button>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 18 }}>CORE VALUES ({(lifeData.values || []).length}/5)</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {VALUES_OPTIONS.map(v => {
              const sel = (lifeData.values || []).includes(v);
              return (
                <button key={v} onClick={() => toggleValue(v)} style={{
                  padding: "5px 10px", fontFamily: "'DM Mono'", fontSize: 10, cursor: "pointer", borderRadius: 2,
                  border: `1px solid ${sel ? "#C9A84C" : "#2C3340"}`, background: sel ? "#C9A84C18" : "transparent",
                  color: sel ? "#C9A84C" : "#6A7585", transition: "all .15s"
                }}>
                  {v}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── ADMIN PANEL ─────────────────────────────────────────────────────────── */
const AdminPanel = ({ app, setApp, onBack }) => {
  const [tab, setTab] = useState("counters");
  const [newCoupon, setNewCoupon] = useState("");
  const [overrideSuite, setOverrideSuite] = useState(app.commandSuiteRemaining);
  const [overrideAcc, setOverrideAcc] = useState(app.acceleratorRemaining);

  return (
    <div style={{ minHeight: "100vh", background: "#080A0D", padding: "36px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
          <div>
            <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 3, color: "#B03A2E", marginBottom: 6 }}>⬛ ADMIN ACCESS</p>
            <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 34, letterSpacing: 3 }}>COMMAND CONTROL</h1>
          </div>
          <button className="btn-ghost" style={{ padding: "9px 18px", fontSize: 12 }} onClick={onBack}>← BACK TO SITE</button>
        </div>

        <div style={{ display: "flex", gap: 2, marginBottom: 28, borderBottom: "1px solid #1E2329" }}>
          {["counters", "coupons", "users", "revoke"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "9px 18px", fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, background: "none",
              border: "none", cursor: "pointer", textTransform: "uppercase", color: tab === t ? "#C9A84C" : "#6A7585",
              borderBottom: tab === t ? "2px solid #C9A84C" : "2px solid transparent", transition: "all .2s"
            }}>{t}</button>
          ))}
        </div>

        {tab === "counters" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
              <div className="card" style={{ padding: 24 }}>
                <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 10 }}>COMMAND SUITE REMAINING</p>
                <p style={{ fontFamily: "'Bebas Neue'", fontSize: 44, color: "#C9A84C" }}>{app.commandSuiteRemaining}</p>
                <div className="progress-bar-bg" style={{ marginTop: 12 }}>
                  <div className="progress-fill" style={{ width: `${(app.commandSuiteRemaining / 100) * 100}%` }} />
                </div>
              </div>
              <div className="card" style={{ padding: 24 }}>
                <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 10 }}>ACCELERATOR REMAINING</p>
                <p style={{ fontFamily: "'Bebas Neue'", fontSize: 44, color: "#4A8FBF" }}>{app.acceleratorRemaining}</p>
                <div className="progress-bar-bg" style={{ marginTop: 12 }}>
                  <div className="progress-fill" style={{ width: `${(app.acceleratorRemaining / 75) * 100}%`, background: "#4A8FBF" }} />
                </div>
              </div>
            </div>
            <div className="card" style={{ padding: 24 }}>
              <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 18 }}>MANUAL OVERRIDE</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <div>
                  <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 7 }}>SUITE COUNT</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="number" value={overrideSuite} onChange={e => setOverrideSuite(Number(e.target.value))} style={{ width: 80 }} min="0" max="100" />
                    <button className="btn-ghost" style={{ padding: "10px 14px", fontSize: 11 }} onClick={() => setApp({ ...app, commandSuiteRemaining: overrideSuite })}>SET</button>
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 7 }}>ACCELERATOR COUNT</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="number" value={overrideAcc} onChange={e => setOverrideAcc(Number(e.target.value))} style={{ width: 80 }} min="0" max="75" />
                    <button className="btn-ghost" style={{ padding: "10px 14px", fontSize: 11 }} onClick={() => setApp({ ...app, acceleratorRemaining: overrideAcc })}>SET</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "coupons" && (
          <div>
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 14 }}>ADD COUPON CODE</p>
              <div style={{ display: "flex", gap: 10 }}>
                <input value={newCoupon} onChange={e => setNewCoupon(e.target.value.toUpperCase())} placeholder="e.g. COMMAND25" />
                <button className="btn-gold" style={{ padding: "11px 18px", fontSize: 12, whiteSpace: "nowrap" }}
                  onClick={() => { if (newCoupon) { setApp({ ...app, coupons: [...app.coupons, newCoupon] }); setNewCoupon(""); } }}>
                  ADD
                </button>
              </div>
            </div>
            <div className="card" style={{ overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["CODE", "STATUS", "ACTION"].map(h => <th key={h} style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", textAlign: "left", padding: "10px 14px", borderBottom: "1px solid #1E2329" }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {app.coupons.map((c, i) => (
                    <tr key={i}>
                      <td style={{ padding: "11px 14px", fontFamily: "'DM Mono'", color: "#C9A84C", fontSize: 13 }}>{c}</td>
                      <td style={{ padding: "11px 14px" }}><span className="badge badge-green">ACTIVE</span></td>
                      <td style={{ padding: "11px 14px" }}>
                        <button onClick={() => setApp({ ...app, coupons: app.coupons.filter((_, j) => j !== i) })} style={{ background: "none", border: "none", cursor: "pointer" }}>
                          <Icon name="x" size={14} color="#B03A2E" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div className="card" style={{ overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["USER", "TIER", "JOIN DATE", "STATUS"].map(h => <th key={h} style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", textAlign: "left", padding: "10px 14px", borderBottom: "1px solid #1E2329" }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {app.users.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: "center", color: "#3A4450", padding: "36px", fontStyle: "italic", fontSize: 14 }}>No users registered yet</td></tr>
                ) : app.users.map((u, i) => (
                  <tr key={i}>
                    <td style={{ padding: "11px 14px", fontSize: 14, color: "#BEC8D4" }}>{u.email}</td>
                    <td style={{ padding: "11px 14px" }}><span className="badge badge-gold">{u.tier?.toUpperCase()}</span></td>
                    <td style={{ padding: "11px 14px", fontFamily: "'DM Mono'", fontSize: 11, color: "#6A7585" }}>{u.date}</td>
                    <td style={{ padding: "11px 14px" }}>
                      <span className={`badge ${app.revokedUsers.includes(u.email) ? "badge-red" : "badge-green"}`}>
                        {app.revokedUsers.includes(u.email) ? "REVOKED" : "ACTIVE"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "revoke" && (
          <div>
            <div className="card" style={{ padding: 26, borderColor: "#B03A2E22", marginBottom: 20 }}>
              <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#B03A2E", marginBottom: 14 }}>ACCESS REVOCATION</p>
              <div style={{ display: "flex", gap: 10 }}>
                <input id="revoke-email" placeholder="user@email.com" />
                <button className="btn-danger" style={{ padding: "11px 18px", fontSize: 12, whiteSpace: "nowrap" }}
                  onClick={() => {
                    const email = document.getElementById("revoke-email").value;
                    if (email && !app.revokedUsers.includes(email)) {
                      setApp({ ...app, revokedUsers: [...app.revokedUsers, email] });
                    }
                  }}>REVOKE ACCESS</button>
              </div>
            </div>
            {app.revokedUsers.length > 0 && (
              <div className="card" style={{ padding: 24 }}>
                <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#6A7585", marginBottom: 14 }}>REVOKED ACCOUNTS</p>
                {app.revokedUsers.map((u, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1E2329" }}>
                    <span style={{ fontFamily: "'DM Mono'", fontSize: 13, color: "#B03A2E" }}>{u}</span>
                    <button onClick={() => setApp({ ...app, revokedUsers: app.revokedUsers.filter(r => r !== u) })}
                      className="btn-ghost" style={{ padding: "5px 12px", fontSize: 11 }}>
                      RESTORE
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── ROOT APP ────────────────────────────────────────────────────────────── */
export default function App() {
  const [appState, setAppState] = useState({ ...INITIAL_APP });
  const [view, setView] = useState("landing");
  const [user, setUser] = useState(null);
  const [tier, setTier] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [lifeData, setLifeData] = useState({
    members: [],
    values: [],
    goals: {},
    chatHistory: [],
  });

  useEffect(() => { injectStyles(); }, []);

  const handleAuth = (userData) => {
    setUser(userData);
    if (tier) setView("dashboard");
    else setView("checkout");
  };

  const handlePurchaseComplete = (selectedTier, goToDashboard = false) => {
    setTier(selectedTier);
    if (selectedTier === "suite" || selectedTier === "accelerator") {
      setAppState(prev => ({ ...prev, commandSuiteRemaining: Math.max(0, prev.commandSuiteRemaining - 1) }));
    }
    if (selectedTier === "accelerator") {
      setAppState(prev => ({ ...prev, acceleratorRemaining: Math.max(0, prev.acceleratorRemaining - 1) }));
    }
    const newUser = { ...(user || {}), tier: selectedTier, date: new Date().toLocaleDateString() };
    setAppState(prev => ({ ...prev, users: [...prev.users, newUser] }));
    if (goToDashboard) {
      setShowOnboarding(true);
      setView("dashboard");
    }
  };

  const handleOnboardingComplete = (data) => {
    setLifeData(d => ({
      ...d,
      members: data.members,
      values: data.values,
      goals: data.goals,
    }));
    setShowOnboarding(false);
  };

  const navigate = (dest) => {
    if (dest === "checkout" && !user) { setView("register"); return; }
    if (dest === "login") { setView("login"); return; }
    setView(dest);
  };

  return (
    <>
      {/* Hidden admin button */}
      {view !== "admin" && (
        <div onClick={() => setView("admin")} style={{
          position: "fixed", bottom: 18, right: 18, zIndex: 999,
          width: 32, height: 32, background: "#0D1117", border: "1px solid #1E2329",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: 0.3, borderRadius: 2
        }} title="Admin Panel">
          <Icon name="settings" size={13} color="#6A7585" />
        </div>
      )}

      {showOnboarding && user && (
        <Onboarding user={user} onComplete={handleOnboardingComplete} />
      )}

      {view === "landing" && <LandingPage app={appState} onNavigate={navigate} />}
      {view === "login" && <AuthPage mode="login" onAuth={handleAuth} onSwitch={() => setView("register")} />}
      {view === "register" && <AuthPage mode="register" onAuth={handleAuth} onSwitch={() => setView("login")} />}
      {view === "checkout" && user && <CheckoutPage app={appState} user={user} onComplete={handlePurchaseComplete} />}
      {view === "dashboard" && user && tier && !showOnboarding && (
        <Dashboard
          user={user}
          tier={tier}
          app={appState}
          lifeData={lifeData}
          setLifeData={setLifeData}
          onLogout={() => { setUser(null); setTier(null); setLifeData({ members: [], values: [], goals: {}, chatHistory: [] }); setView("landing"); }}
        />
      )}
      {view === "admin" && <AdminPanel app={appState} setApp={setAppState} onBack={() => setView("landing")} />}
    </>
  );
}
