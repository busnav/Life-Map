import { useState, useEffect, useCallback } from "react";

/* ─── LICENSE & SAAS CONSTANTS ────────────────────────────────────────────── */
const TRIAL_DAYS = 7;
const LICENSE_TYPES = {
  trial:      { label: "Trial License",      days: 7,    color: "#C9A84C" },
  annual:     { label: "Annual License",     days: 365,  color: "#4A8FBF" },
  enterprise: { label: "Enterprise License", days: 9999, color: "#7A5E25" },
  expired:    { label: "Expired",            days: 0,    color: "#B03A2E" },
};

const TIERS = {
  core:        { label: "Discipline Code™",          color: "#8A95A3", price: 44.99 },
  suite:       { label: "Command Life Suite™",       color: "#C9A84C", price: 44.99 },
  accelerator: { label: "Master Coaching Accelerator™", color: "#4A8FBF", price: 393.99 },
};

const MODULES = [
  { id: "timeline",    icon: "chart",    label: "Life Strategy Timeline",     sub: "1 · 3–5 · 10 · 20 Year Horizons", tier: "suite" },
  { id: "career",      icon: "rocket",   label: "Career Command Planner",      sub: "Federal & civilian pathways",       tier: "suite" },
  { id: "family",      icon: "users",    label: "Family Strategy Map",         sub: "Partner & children planning",       tier: "suite" },
  { id: "financial",   icon: "chart",    label: "Financial Decision Matrix",   sub: "Investment & real estate",          tier: "suite" },
  { id: "mission",     icon: "shield",   label: "Mission Planning System",     sub: "Personal operating system",         tier: "suite" },
  { id: "horizon",     icon: "star",     label: "20-Year Strategic Horizon",   sub: "Generational legacy planning",      tier: "suite" },
  { id: "coaching",    icon: "book",     label: "Coaching Technique Library",  sub: "Curated professional coaches",      tier: "accelerator" },
  { id: "community",   icon: "community",label: "Private Community Portal",    sub: "Exclusive accelerator network",     tier: "accelerator" },
];

const STRATEGIC_CATEGORIES = [
  "Education & Graduate Planning",
  "Career & Federal Pathways",
  "Certifications & AI Skills",
  "Real Estate & Investment Planning",
  "Insurance & Risk Protection",
  "Side Hustle Planning",
  "Hobby Monetization",
  "Family Milestones",
];

/* ─── INITIAL STATE ───────────────────────────────────────────────────────── */
const INITIAL_APP = {
  commandSuiteRemaining: 100,
  acceleratorRemaining: 75,
  coupons: ["COMMAND10", "DISCIPLINE20"],
  revokedUsers: [],
  users: [],
  versions: [
    { id: "v2.1", date: "2026-03-10", desc: "SaaS licensing & trial system", type: "Major", requiredLicense: "trial" },
    { id: "v2.0", date: "2026-02-14", desc: "Command Life Suite modules launched", type: "Major", requiredLicense: "trial" },
    { id: "v1.5", date: "2026-01-20", desc: "4-Horizon Timeline redesign", type: "Minor", requiredLicense: "trial" },
  ],
};

/* ─── LICENSE ENGINE ──────────────────────────────────────────────────────── */
const createLicense = (type = "trial", tier = "core") => {
  const now = new Date();
  const expDate = new Date(now);
  expDate.setDate(expDate.getDate() + (LICENSE_TYPES[type]?.days || 7));
  return {
    id: `LIC-${Math.random().toString(36).toUpperCase().slice(2, 10)}`,
    type,
    tier,
    issueDate: now.toISOString(),
    expirationDate: expDate.toISOString(),
    status: "active",
    deviceCount: 1,
    lastValidated: now.toISOString(),
  };
};

const getLicenseStatus = (license) => {
  if (!license) return "none";
  if (license.status === "revoked") return "revoked";
  const now = new Date();
  const exp = new Date(license.expirationDate);
  if (now > exp && license.type === "trial") return "expired";
  return "active";
};

const getDaysRemaining = (license) => {
  if (!license) return 0;
  const now = new Date();
  const exp = new Date(license.expirationDate);
  return Math.max(0, Math.ceil((exp - now) / (1000 * 60 * 60 * 24)));
};

/* ─── STYLES ──────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #080A0D; color: #F0F2F5; font-family: 'Cormorant Garamond', Georgia, serif; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-thumb { background: #8B6914; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(24px);} to { opacity:1; transform:translateY(0);} }
    @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
    @keyframes borderGlow { 0%,100%{box-shadow:0 0 8px #C9A84C44} 50%{box-shadow:0 0 22px #C9A84C99} }
    @keyframes trialPulse { 0%,100%{box-shadow:0 0 6px #B03A2E44} 50%{box-shadow:0 0 16px #B03A2E88} }
    @keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
    .fu  { animation: fadeUp .6s ease both; }
    .fu1 { animation: fadeUp .6s .1s ease both; }
    .fu2 { animation: fadeUp .6s .2s ease both; }
    .fu3 { animation: fadeUp .6s .35s ease both; }
    .fu4 { animation: fadeUp .6s .5s ease both; }
    .slide-in { animation: slideIn .4s ease both; }
    .gold-shimmer {
      background: linear-gradient(90deg, #8B6914, #E8C96A, #C9A84C, #8B6914);
      background-size: 300% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3s linear infinite;
    }
    .glow-border { animation: borderGlow 2.5s ease-in-out infinite; }
    .trial-warning { animation: trialPulse 2s ease-in-out infinite; }
    .btn-gold {
      background: linear-gradient(135deg, #8B6914, #C9A84C, #E8C96A, #C9A84C);
      background-size: 200% auto;
      color: #080A0D;
      font-family: 'Bebas Neue', sans-serif;
      letter-spacing: 2px;
      border: none;
      cursor: pointer;
      transition: all .3s;
    }
    .btn-gold:hover { background-position: right center; transform: translateY(-1px); box-shadow: 0 8px 24px #C9A84C44; }
    .btn-red {
      background: #B03A2E;
      color: #F0F2F5;
      font-family: 'Bebas Neue', sans-serif;
      letter-spacing: 2px;
      border: none;
      cursor: pointer;
      transition: all .3s;
    }
    .btn-red:hover { background: #C0392B; transform: translateY(-1px); }
    .btn-ghost {
      background: transparent;
      border: 1px solid #C9A84C66;
      color: #C9A84C;
      font-family: 'Bebas Neue', sans-serif;
      letter-spacing: 2px;
      cursor: pointer;
      transition: all .3s;
    }
    .btn-ghost:hover { border-color: #C9A84C; background: #C9A84C11; }
    .btn-blue {
      background: transparent;
      border: 1px solid #4A8FBF66;
      color: #4A8FBF;
      font-family: 'Bebas Neue', sans-serif;
      letter-spacing: 2px;
      cursor: pointer;
      transition: all .3s;
    }
    .btn-blue:hover { border-color: #4A8FBF; background: #4A8FBF11; }
    input, select, textarea {
      background: #0F1216;
      border: 1px solid #2C3340;
      color: #F0F2F5;
      font-family: 'Cormorant Garamond', serif;
      font-size: 16px;
      padding: 12px 16px;
      width: 100%;
      outline: none;
      transition: border .2s;
    }
    input:focus, select:focus, textarea:focus { border-color: #C9A84C66; }
    .card { background: #0F1216; border: 1px solid #1E2329; transition: border .3s; }
    .card:hover { border-color: #C9A84C33; }
    .divider { border: none; border-top: 1px solid #1E2329; margin: 24px 0; }
    .tag { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; padding: 4px 10px; border-radius: 2px; }
    .nav { position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px); background: #080A0Dcc; border-bottom: 1px solid #1E2329; }
    .sidebar { background: #0A0C0F; border-right: 1px solid #1E2329; min-height: 100vh; }
    .sidebar-item { padding: 10px 20px; cursor: pointer; font-size: 14px; color: #8A95A3; border-left: 2px solid transparent; transition: all .2s; display: flex; align-items: center; gap: 10px; }
    .sidebar-item:hover { color: #C9A84C; border-left-color: #C9A84C44; background: #C9A84C08; }
    .sidebar-item.active { color: #C9A84C; border-left-color: #C9A84C; background: #C9A84C11; font-weight: 600; }
    .module-card { background: #0F1216; border: 1px solid #1E2329; padding: 20px; cursor: pointer; transition: all .25s; }
    .module-card:hover:not(.locked-card) { border-color: #C9A84C55; transform: translateY(-2px); }
    .locked-card { opacity: .45; cursor: not-allowed; }
    .progress-bar { background: #1E2329; border-radius: 2px; height: 3px; }
    .progress-fill { background: linear-gradient(90deg, #8B6914, #E8C96A); height: 3px; border-radius: 2px; transition: width .5s; }
    .stripe-input { background: #0F1216; border: 1px solid #2C3340; color: #F0F2F5; padding: 13px 16px; font-family: 'DM Mono', monospace; font-size: 14px; width: 100%; outline: none; transition: border .2s; }
    .stripe-input:focus { border-color: #C9A84C66; }
    table { width: 100%; border-collapse: collapse; }
    th { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 2px; color: #8A95A3; text-align: left; padding: 10px 14px; border-bottom: 1px solid #1E2329; }
    td { padding: 12px 14px; font-size: 14px; border-bottom: 1px solid #1E2329; color: #BEC8D4; }
    tr:hover td { background: #C9A84C06; }
    .badge { display:inline-block; padding:2px 8px; font-family:'DM Mono',monospace; font-size:10px; letter-spacing:1px; border-radius:2px; }
    .modal-overlay { position:fixed; inset:0; background:#000000cc; z-index:200; display:flex; align-items:center; justify-content:center; padding:24px; }
    .modal { background:#0F1216; border:1px solid #2C3340; max-width:480px; width:100%; padding:40px; }
    .trial-bar { background: linear-gradient(90deg, #B03A2E22, #B03A2E11); border-bottom: 1px solid #B03A2E33; padding: 10px 40px; display:flex; align-items:center; justify-content:space-between; }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
};

/* ─── ICONS ───────────────────────────────────────────────────────────────── */
const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const icons = {
    star:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    lock:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    check:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    shield:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    users:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    chart:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    book:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    home:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    settings:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    rocket:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
    logout:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    arrow:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    copy:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
    x:         <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    plus:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    community: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    calendar:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    download:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    key:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
    alert:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    update:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
    trash:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  };
  return icons[name] || null;
};

/* ─── TRIAL EXPIRED WALL ──────────────────────────────────────────────────── */
const TrialExpiredWall = ({ user, onUpgrade, onDelete }) => (
  <div style={{ minHeight: "100vh", background: "#080A0D", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
    <div style={{ maxWidth: 540, width: "100%", textAlign: "center" }}>
      <div style={{ width: 72, height: 72, border: "1px solid #B03A2E", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
        <Icon name="lock" size={30} color="#B03A2E" />
      </div>
      <div className="tag" style={{ background: "#B03A2E15", color: "#B03A2E", border: "1px solid #B03A2E33", display: "inline-block", marginBottom: 20 }}>
        TRIAL EXPIRED
      </div>
      <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 44, letterSpacing: 3, marginBottom: 12 }}>
        Your 7-Day Trial Has Ended
      </h1>
      <p style={{ color: "#8A95A3", fontSize: 17, fontStyle: "italic", marginBottom: 16, lineHeight: 1.7 }}>
        Per the Command Life Framework™ License Agreement,<br />
        continued access requires an active license.
      </p>
      <div className="card" style={{ padding: 24, marginBottom: 32, textAlign: "left", background: "#0A0C0F" }}>
        <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 12 }}>LICENSE AGREEMENT — EXCERPT</p>
        <p style={{ fontSize: 14, color: "#BEC8D4", lineHeight: 1.8, fontStyle: "italic" }}>
          "At the conclusion of the trial period, the user must either purchase an active annual license,
          or elect to delete their account and terminate access."
        </p>
      </div>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn-gold" style={{ padding: "16px 40px", fontSize: 15 }} onClick={onUpgrade}>
          PURCHASE LICENSE — FROM $44.99
        </button>
        <button className="btn-red" style={{ padding: "16px 28px", fontSize: 14 }} onClick={onDelete}>
          DELETE ACCOUNT
        </button>
      </div>
      <p style={{ marginTop: 20, fontFamily: "'DM Mono'", fontSize: 10, color: "#4A5568", letterSpacing: 1 }}>
        AUTO-PURGE IN 30 DAYS IF NO ACTION TAKEN
      </p>
    </div>
  </div>
);

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
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: 18, letterSpacing: 2, color: "#C9A84C" }}>CLF™</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <button className="btn-ghost" style={{ padding: "8px 20px", fontSize: 13 }} onClick={() => onNavigate("login")}>LOGIN</button>
          <button className="btn-gold" style={{ padding: "8px 24px", fontSize: 13 }} onClick={() => onNavigate("register")}>
            START FREE TRIAL
          </button>
        </div>
      </nav>

      <section style={{ maxWidth: 960, margin: "0 auto", padding: "100px 40px 80px", textAlign: "center" }}>
        <div className="fu" style={{ marginBottom: 20 }}>
          <span className="tag" style={{ background: "#C9A84C15", color: "#C9A84C", border: "1px solid #C9A84C33" }}>
            7-DAY FREE TRIAL · NO CREDIT CARD REQUIRED
          </span>
        </div>
        <h1 className="fu1" style={{ fontFamily: "'Bebas Neue'", fontSize: "clamp(56px, 10vw, 96px)", lineHeight: 0.95, letterSpacing: 3, marginBottom: 24 }}>
          <span className="gold-shimmer">The Command Life</span><br />
          <span style={{ color: "#F0F2F5" }}>Framework™</span>
        </h1>
        <p className="fu2" style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, fontStyle: "italic", color: "#8A95A3", marginBottom: 10 }}>
          Empowering Families &amp; Teams to Excel
        </p>
        <p className="fu3" style={{ fontSize: 18, color: "#BEC8D4", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7 }}>
          A military-grade family planning system. Start your 7-day free trial today — full access, no card required.
        </p>
        <div className="fu4" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-gold" style={{ padding: "16px 40px", fontSize: 16 }} onClick={() => onNavigate("register")}>
            START FREE TRIAL
          </button>
          <button className="btn-ghost" style={{ padding: "16px 32px", fontSize: 14 }} onClick={() => onNavigate("checkout")}>
            VIEW PRICING
          </button>
        </div>
        <p style={{ marginTop: 20, fontFamily: "'DM Mono'", fontSize: 11, color: "#4A5568", letterSpacing: 1 }}>
          7 DAYS FREE · THEN FROM $44.99/YEAR · CANCEL ANYTIME
        </p>
      </section>

      {/* Counters */}
      <div style={{ background: "#0A0C0F", borderTop: "1px solid #1E2329", borderBottom: "1px solid #1E2329", padding: "20px 40px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: suiteFull ? "#B03A2E" : "#C9A84C" }}>
              {suiteFull ? "0" : app.commandSuiteRemaining}
            </div>
            <div style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3" }}>
              {suiteFull ? "COMMAND SUITE CLOSED" : "COMMAND SUITE SPOTS REMAINING"}
            </div>
          </div>
          <div style={{ width: 1, background: "#1E2329" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: accFull ? "#B03A2E" : "#C9A84C" }}>
              {accFull ? "0" : app.acceleratorRemaining}
            </div>
            <div style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3" }}>
              {accFull ? "FOUNDERS ALLOCATION CLOSED" : "ACCELERATOR SPOTS REMAINING"}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 44, letterSpacing: 3, marginBottom: 12 }}>License Tiers</h2>
          <p style={{ color: "#8A95A3", fontSize: 18 }}>Start free. Upgrade when you're ready.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {/* Trial */}
          <div className="card" style={{ padding: 36, display: "flex", flexDirection: "column" }}>
            <div className="tag" style={{ background: "#C9A84C15", color: "#C9A84C", border: "1px solid #C9A84C33", display: "inline-block", marginBottom: 20, width: "fit-content" }}>FREE TRIAL</div>
            <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: 28, letterSpacing: 2, marginBottom: 8 }}>7-Day Trial License</h3>
            <p style={{ color: "#8A95A3", fontSize: 15, marginBottom: 24, fontStyle: "italic" }}>Full access, no card required</p>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontFamily: "'Bebas Neue'", fontSize: 48, color: "#C9A84C" }}>FREE</span>
            </div>
            <ul style={{ listStyle: "none", marginBottom: 32, flex: 1 }}>
              {["Full dashboard access", "All planning modules", "7 days — no restrictions", "Upgrade anytime"].map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, color: "#BEC8D4", fontSize: 15 }}>
                  <Icon name="check" size={14} color="#C9A84C" /> {f}
                </li>
              ))}
            </ul>
            <button className="btn-gold" style={{ padding: "14px 24px", fontSize: 14, width: "100%" }} onClick={() => onNavigate("register")}>START FREE TRIAL</button>
          </div>

          {/* Annual */}
          <div className="card glow-border" style={{ padding: 36, borderColor: "#C9A84C44", display: "flex", flexDirection: "column", position: "relative" }}>
            <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#C9A84C", color: "#080A0D", fontFamily: "'Bebas Neue'", fontSize: 12, letterSpacing: 2, padding: "4px 16px", whiteSpace: "nowrap" }}>
              MOST POPULAR
            </div>
            <div className="tag" style={{ background: "#C9A84C15", color: "#C9A84C", border: "1px solid #C9A84C33", display: "inline-block", marginBottom: 20, width: "fit-content" }}>ANNUAL LICENSE</div>
            <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: 28, letterSpacing: 2, marginBottom: 8 }}>Command Life Suite™</h3>
            <p style={{ color: "#8A95A3", fontSize: 15, marginBottom: 24, fontStyle: "italic" }}>12-month full access</p>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontFamily: "'Bebas Neue'", fontSize: 48, color: "#C9A84C" }}>$44.99</span>
              <span style={{ color: "#4A5568", fontSize: 14, marginLeft: 8 }}>/year</span>
            </div>
            {!suiteFull && (
              <div style={{ background: "#C9A84C15", border: "1px solid #C9A84C33", padding: "8px 14px", marginBottom: 20, fontFamily: "'DM Mono'", fontSize: 11, color: "#C9A84C", letterSpacing: 1 }}>
                ⚡ {app.commandSuiteRemaining} OF 100 SPOTS REMAINING
              </div>
            )}
            <ul style={{ listStyle: "none", marginBottom: 32, flex: 1 }}>
              {["Everything in Trial", "Full suite — 12 months", "Downloadable templates", "Version update access", "Priority support"].map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, color: "#BEC8D4", fontSize: 15 }}>
                  <Icon name="check" size={14} color="#C9A84C" /> {f}
                </li>
              ))}
            </ul>
            <button className="btn-gold" style={{ padding: "14px 24px", fontSize: 14, width: "100%" }} onClick={() => onNavigate("checkout")}>PURCHASE LICENSE</button>
          </div>

          {/* Accelerator */}
          <div className="card" style={{ padding: 36, display: "flex", flexDirection: "column" }}>
            <div className="tag" style={{ background: "#4A8FBF15", color: "#4A8FBF", border: "1px solid #4A8FBF33", display: "inline-block", marginBottom: 20, width: "fit-content" }}>PREMIUM</div>
            <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: 28, letterSpacing: 2, marginBottom: 8 }}>Master Coaching Accelerator™</h3>
            <p style={{ color: "#8A95A3", fontSize: 15, marginBottom: 24, fontStyle: "italic" }}>3-Month Founders Access</p>
            <div style={{ marginBottom: 24 }}>
              <span style={{ textDecoration: "line-through", color: "#4A5568", fontFamily: "'DM Mono'", fontSize: 18, marginRight: 12 }}>$849</span>
              <span style={{ fontFamily: "'Bebas Neue'", fontSize: 48, color: "#4A8FBF" }}>$349</span>
            </div>
            {!accFull && (
              <div style={{ background: "#4A8FBF15", border: "1px solid #4A8FBF33", padding: "8px 14px", marginBottom: 20, fontFamily: "'DM Mono'", fontSize: 11, color: "#4A8FBF", letterSpacing: 1 }}>
                ⚡ {app.acceleratorRemaining} OF 75 FOUNDERS SPOTS LEFT
              </div>
            )}
            <ul style={{ listStyle: "none", marginBottom: 32, flex: 1 }}>
              {["Everything in Annual", "Monthly book drops", "Coaching technique library", "Discounted leadership tools", "Private community portal"].map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, color: "#BEC8D4", fontSize: 15 }}>
                  <Icon name="check" size={14} color="#4A8FBF" /> {f}
                </li>
              ))}
            </ul>
            <button className="btn-blue" style={{ padding: "14px 24px", fontSize: 14, width: "100%" }} onClick={() => !accFull && onNavigate("checkout")}>
              {accFull ? "ALLOCATION CLOSED" : "UPGRADE TO ACCELERATOR"}
            </button>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid #1E2329", padding: "40px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Bebas Neue'", fontSize: 16, letterSpacing: 3, color: "#C9A84C", marginBottom: 8 }}>THE COMMAND LIFE FRAMEWORK™</p>
        <p style={{ fontFamily: "'DM Mono'", fontSize: 11, color: "#4A5568", letterSpacing: 1 }}>EMPOWERING FAMILIES &amp; TEAMS TO EXCEL · ALL RIGHTS RESERVED</p>
      </footer>
    </div>
  );
};

/* ─── AUTH PAGE ───────────────────────────────────────────────────────────── */
const AuthPage = ({ mode = "login", onAuth, onSwitch }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const isRegister = mode === "register";

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#080A0D" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ width: 52, height: 52, border: "1px solid #C9A84C", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Icon name="shield" size={24} color="#C9A84C" />
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 32, letterSpacing: 3, marginBottom: 6 }}>
            {isRegister ? "START YOUR 7-DAY TRIAL" : "ACCESS YOUR COMMAND"}
          </h1>
          <p style={{ color: "#8A95A3", fontSize: 15, fontStyle: "italic" }}>
            {isRegister ? "No credit card required · Full access" : "The Command Life Framework™"}
          </p>
        </div>

        <div className="card" style={{ padding: 36 }}>
          {isRegister && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 8 }}>FULL NAME</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Commander's name" />
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 8 }}>EMAIL ADDRESS</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 8 }}>PASSWORD</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>

          {isRegister && (
            <div style={{ background: "#C9A84C0A", border: "1px solid #C9A84C22", padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#8A95A3", lineHeight: 1.6 }}>
              <Icon name="key" size={12} color="#C9A84C" /> &nbsp;By creating an account, a <strong style={{ color: "#C9A84C" }}>7-Day Trial License</strong> will be activated automatically.
              Full access. No card required.
            </div>
          )}

          <button className="btn-gold" style={{ width: "100%", padding: "15px", fontSize: 15 }}
            onClick={() => onAuth({ name: form.name || form.email.split("@")[0], email: form.email })}>
            {isRegister ? "ACTIVATE TRIAL LICENSE" : "ACCESS DASHBOARD"}
          </button>
          <hr className="divider" />
          <p style={{ textAlign: "center", color: "#8A95A3", fontSize: 14 }}>
            {isRegister ? "Already have access? " : "New commander? "}
            <span style={{ color: "#C9A84C", cursor: "pointer" }} onClick={onSwitch}>
              {isRegister ? "Sign in" : "Start free trial"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─── CHECKOUT PAGE ───────────────────────────────────────────────────────── */
const CheckoutPage = ({ app, user, onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedLicense, setSelectedLicense] = useState("annual");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [card, setCard] = useState({ num: "", exp: "", cvc: "", name: "" });
  const suiteFull = app.commandSuiteRemaining <= 0;
  const accFull = app.acceleratorRemaining <= 0;

  const purchaseTiers = [
    { id: "suite", license: "annual", label: "Command Life Suite™", price: 44.99, desc: "Annual License · Full dashboard + all modules", tag: suiteFull ? "SOLD OUT" : `${app.commandSuiteRemaining} spots left` },
    ...(!accFull ? [{ id: "accelerator", license: "annual", label: "Master Coaching Accelerator™", price: 393.99, desc: "Suite + Accelerator bundle · 3-month coaches access", tag: "FOUNDERS RATE — SAVE $500" }] : []),
    { id: "enterprise", license: "enterprise", label: "Enterprise License", price: null, desc: "Custom pricing · Team-level accounts · Contact us", tag: "CUSTOM" },
  ];

  const applyCoupon = () => {
    if (app.coupons.includes(coupon.toUpperCase())) setCouponApplied(true);
  };

  const selectedData = purchaseTiers.find(t => t.id === selectedTier);
  const basePrice = selectedData?.price || 0;
  const finalPrice = couponApplied ? (basePrice * 0.9).toFixed(2) : basePrice.toFixed(2);

  return (
    <div style={{ minHeight: "100vh", background: "#080A0D", padding: "60px 24px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
          <div>
            <p style={{ fontFamily: "'DM Mono'", fontSize: 11, letterSpacing: 3, color: "#C9A84C", marginBottom: 8 }}>STEP {step} OF 3</p>
            <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 36, letterSpacing: 3 }}>
              {step === 1 ? "SELECT LICENSE" : step === 2 ? "SECURE PAYMENT" : "LICENSE ACTIVATED"}
            </h1>
          </div>
          {onBack && <button className="btn-ghost" style={{ padding: "8px 16px", fontSize: 12 }} onClick={onBack}>← BACK</button>}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 40 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ width: s <= step ? 40 : 20, height: 3, background: s <= step ? "#C9A84C" : "#1E2329", transition: "all .3s" }} />
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="fu">
            {purchaseTiers.map(t => (
              <div key={t.id} onClick={() => t.price && setSelectedTier(t.id)} className="card" style={{
                padding: 24, marginBottom: 16, cursor: t.price ? "pointer" : "not-allowed",
                borderColor: selectedTier === t.id ? "#C9A84C" : "#1E2329",
                background: selectedTier === t.id ? "#C9A84C08" : "#0F1216",
                opacity: !t.price ? 0.5 : 1
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontFamily: "'Bebas Neue'", fontSize: 20, letterSpacing: 1, marginBottom: 4 }}>{t.label}</p>
                    <p style={{ color: "#8A95A3", fontSize: 14, fontStyle: "italic" }}>{t.desc}</p>
                    {t.tag && <span className="tag" style={{ background: "#C9A84C15", color: "#C9A84C", border: "1px solid #C9A84C33", marginTop: 8, display: "inline-block" }}>{t.tag}</span>}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                    {t.price ? (
                      <p style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: "#C9A84C" }}>${t.price.toFixed(2)}</p>
                    ) : (
                      <p style={{ fontFamily: "'DM Mono'", fontSize: 12, color: "#4A8FBF" }}>CONTACT US</p>
                    )}
                    {selectedTier === t.id && <Icon name="check" size={18} color="#C9A84C" />}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 12, marginTop: 24, marginBottom: 32 }}>
              <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon or unlock code" style={{ flex: 1 }} />
              <button className="btn-ghost" style={{ padding: "12px 20px", whiteSpace: "nowrap", fontSize: 13 }} onClick={applyCoupon}>APPLY</button>
            </div>
            {couponApplied && <p style={{ color: "#C9A84C", fontFamily: "'DM Mono'", fontSize: 12, marginBottom: 16, letterSpacing: 1 }}>✓ COUPON APPLIED — 10% DISCOUNT</p>}

            <button className="btn-gold" onClick={() => setStep(2)}
              style={{ width: "100%", padding: 15, fontSize: 15, opacity: selectedTier ? 1 : 0.4, cursor: selectedTier ? "pointer" : "not-allowed" }}>
              CONTINUE TO PAYMENT
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="fu">
            <div className="card" style={{ padding: 32, marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <Icon name="shield" size={16} color="#C9A84C" />
                <span style={{ fontFamily: "'DM Mono'", fontSize: 11, letterSpacing: 2, color: "#8A95A3" }}>256-BIT ENCRYPTED · SECURE CHECKOUT</span>
              </div>
              {["Cardholder Name", "Card Number", null].map((label, i) => {
                if (i === 2) return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
                    {["Expiry", "CVC"].map((l, j) => (
                      <div key={j}>
                        <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 8 }}>{l.toUpperCase()}</label>
                        <input className="stripe-input" placeholder={l === "Expiry" ? "MM / YY" : "•••"} />
                      </div>
                    ))}
                  </div>
                );
                return (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 8 }}>{label?.toUpperCase()}</label>
                    <input className="stripe-input" placeholder={label === "Card Number" ? "0000 0000 0000 0000" : "Name on card"} />
                  </div>
                );
              })}
              <div style={{ background: "#080A0D", padding: 20, marginBottom: 24 }}>
                <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 12 }}>ORDER SUMMARY</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 15 }}>
                  <span style={{ color: "#BEC8D4" }}>{selectedData?.label}</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "#C9A84C" }}>
                    <span>Coupon discount</span><span>-10%</span>
                  </div>
                )}
                <hr className="divider" style={{ margin: "12px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 1 }}>
                  <span>TOTAL</span>
                  <span style={{ color: "#C9A84C" }}>${finalPrice}</span>
                </div>
              </div>
              <button className="btn-gold" style={{ width: "100%", padding: 15, fontSize: 15 }}
                onClick={() => { onComplete(selectedTier, selectedData?.license || "annual"); setStep(3); }}>
                COMPLETE PURCHASE · ${finalPrice}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="fu" style={{ textAlign: "center" }}>
            <div style={{ width: 72, height: 72, border: "1px solid #C9A84C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
              <Icon name="key" size={30} color="#C9A84C" />
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 40, letterSpacing: 3, marginBottom: 12 }}>LICENSE ACTIVATED</h2>
            <p style={{ color: "#8A95A3", fontSize: 17, fontStyle: "italic", marginBottom: 36 }}>Welcome to The Command Life Framework™</p>
            <div className="card" style={{ padding: 20, marginBottom: 32, textAlign: "left" }}>
              <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 12 }}>LICENSE DETAILS</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#8A95A3", fontSize: 14 }}>Type</span>
                <span style={{ fontFamily: "'DM Mono'", fontSize: 13, color: "#C9A84C" }}>{selectedData?.license?.toUpperCase()} LICENSE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8A95A3", fontSize: 14 }}>Tier</span>
                <span style={{ fontFamily: "'DM Mono'", fontSize: 13, color: "#C9A84C" }}>{selectedData?.label?.toUpperCase()}</span>
              </div>
            </div>
            <button className="btn-gold" style={{ padding: "16px 48px", fontSize: 16 }} onClick={() => onComplete(selectedTier, selectedData?.license || "annual", true)}>
              ENTER COMMAND CENTER
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── DASHBOARD ───────────────────────────────────────────────────────────── */
const Dashboard = ({ user, tier, license, app, onLogout, onUpgrade }) => {
  const [activeSection, setActiveSection] = useState("overview");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const hasAccelerator = tier === "accelerator";
  const hasSuite = tier === "suite" || hasAccelerator || license?.type === "annual" || license?.type === "enterprise";
  const isTrial = license?.type === "trial";
  const daysLeft = getDaysRemaining(license);
  const licenseStatus = getLicenseStatus(license);
  const isRevoked = app.revokedUsers.includes(user?.email);

  const latestVersion = app.versions?.[0];

  useEffect(() => {
    if (latestVersion) {
      const seenKey = `seen_${latestVersion.id}_${user?.email}`;
      const seen = sessionStorage.getItem(seenKey);
      if (!seen) { setShowUpdateModal(true); sessionStorage.setItem(seenKey, "1"); }
    }
  }, []);

  const sidebarLinks = [
    { id: "overview",  icon: "home",      label: "Command Overview" },
    { id: "horizon",   icon: "chart",     label: "4-Horizon Timeline" },
    { id: "planning",  icon: "calendar",  label: "Planning Modules" },
    { id: "strategy",  icon: "rocket",    label: "Strategic Categories" },
    { id: "downloads", icon: "download",  label: "Asset Downloads",     requiresSuite: true },
    { id: "license",   icon: "key",       label: "License & Billing" },
    ...(hasAccelerator ? [{ id: "community", icon: "community", label: "Community Portal" }] : []),
    { id: "settings",  icon: "settings",  label: "Account Settings" },
  ];

  if (isRevoked) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#080A0D" }}>
      <div style={{ textAlign: "center" }}>
        <Icon name="lock" size={40} color="#B03A2E" />
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 36, letterSpacing: 3, marginTop: 20, color: "#B03A2E" }}>ACCESS REVOKED</h2>
        <p style={{ color: "#8A95A3", marginTop: 12 }}>Contact support to restore your access.</p>
        <button className="btn-ghost" style={{ padding: "12px 24px", marginTop: 24 }} onClick={onLogout}>SIGN OUT</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Update Modal */}
      {showUpdateModal && latestVersion && (
        <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="modal slide-in" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Icon name="update" size={20} color="#C9A84C" />
                <span style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#C9A84C" }}>VERSION UPDATE</span>
              </div>
              <button onClick={() => setShowUpdateModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8A95A3" }}>
                <Icon name="x" size={18} color="#8A95A3" />
              </button>
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 28, letterSpacing: 2, marginBottom: 8 }}>{latestVersion.id} — Now Available</h2>
            <p style={{ color: "#BEC8D4", marginBottom: 24, lineHeight: 1.7 }}>{latestVersion.desc}</p>
            <div style={{ display: "flex", gap: 12 }}>
              <span className="badge" style={{ background: "#C9A84C15", color: "#C9A84C", border: "1px solid #C9A84C33" }}>{latestVersion.type}</span>
              <span className="badge" style={{ background: "#1E2329", color: "#8A95A3" }}>{latestVersion.date}</span>
            </div>
            <button className="btn-gold" style={{ width: "100%", padding: "12px", marginTop: 24, fontSize: 13 }} onClick={() => setShowUpdateModal(false)}>
              GOT IT
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="sidebar" style={{ width: 240, flexShrink: 0, position: "relative" }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid #1E2329" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, border: "1px solid #C9A84C", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="shield" size={14} color="#C9A84C" />
            </div>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: 14, letterSpacing: 2, color: "#C9A84C" }}>CLF™</span>
          </div>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 1, color: "#8A95A3", marginBottom: 4 }}>COMMANDER</p>
          <p style={{ fontSize: 15, color: "#F0F2F5", fontWeight: 600, marginBottom: 10 }}>{user?.name}</p>
          <span className="badge" style={{
            background: hasAccelerator ? "#4A8FBF22" : hasSuite ? "#C9A84C22" : "#1E2329",
            color: hasAccelerator ? "#4A8FBF" : hasSuite ? "#C9A84C" : "#8A95A3",
            border: `1px solid ${hasAccelerator ? "#4A8FBF44" : hasSuite ? "#C9A84C44" : "#2C3340"}`
          }}>
            {hasAccelerator ? "ACCELERATOR" : hasSuite ? "ANNUAL LICENSE" : "TRIAL"}
          </span>
        </div>

        {isTrial && (
          <div style={{ margin: "12px 16px", background: "#B03A2E15", border: "1px solid #B03A2E33", padding: "10px 12px", borderRadius: 2 }}>
            <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 1, color: "#B03A2E", marginBottom: 4 }}>TRIAL EXPIRES IN</p>
            <p style={{ fontFamily: "'Bebas Neue'", fontSize: 22, color: daysLeft <= 2 ? "#B03A2E" : "#C9A84C" }}>{daysLeft} DAYS</p>
            <button onClick={onUpgrade} style={{ background: "none", border: "none", cursor: "pointer", color: "#C9A84C", fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 1, marginTop: 4, padding: 0 }}>
              UPGRADE NOW →
            </button>
          </div>
        )}

        <div style={{ padding: "16px 0" }}>
          {sidebarLinks.map(link => {
            const locked = link.requiresSuite && !hasSuite;
            return (
              <div key={link.id} className={`sidebar-item ${activeSection === link.id ? "active" : ""}`}
                onClick={() => !locked && setActiveSection(link.id)}
                style={{ opacity: locked ? 0.4 : 1, cursor: locked ? "not-allowed" : "pointer" }}>
                <Icon name={link.icon} size={14} color={activeSection === link.id ? "#C9A84C" : "#8A95A3"} />
                <span style={{ fontSize: 13 }}>{link.label}</span>
                {locked && <Icon name="lock" size={10} color="#4A5568" />}
              </div>
            );
          })}
        </div>

        <div style={{ position: "absolute", bottom: 0, width: 240, borderTop: "1px solid #1E2329" }}>
          <div className="sidebar-item" onClick={onLogout}>
            <Icon name="logout" size={14} color="#8A95A3" />
            <span style={{ fontSize: 13 }}>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: "auto", background: "#080A0D" }}>
        {/* Trial bar */}
        {isTrial && daysLeft <= 3 && (
          <div className="trial-bar trial-warning">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="alert" size={14} color="#B03A2E" />
              <span style={{ fontFamily: "'DM Mono'", fontSize: 11, color: "#B03A2E", letterSpacing: 1 }}>
                TRIAL EXPIRES IN {daysLeft} DAY{daysLeft !== 1 ? "S" : ""} — UPGRADE TO MAINTAIN ACCESS
              </span>
            </div>
            <button className="btn-red" style={{ padding: "6px 16px", fontSize: 11 }} onClick={onUpgrade}>UPGRADE NOW</button>
          </div>
        )}

        {/* Top bar */}
        <div style={{ padding: "20px 40px", borderBottom: "1px solid #1E2329", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3" }}>THE COMMAND LIFE FRAMEWORK™</p>
            <p style={{ fontSize: 12, color: "#4A5568", fontStyle: "italic" }}>v{app.versions?.[0]?.id} · Empowering Families &amp; Teams to Excel</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {hasAccelerator && (
              <div style={{ background: "#4A8FBF15", border: "1px solid #4A8FBF33", padding: "6px 14px", fontFamily: "'DM Mono'", fontSize: 10, color: "#4A8FBF", letterSpacing: 1 }}>
                ACCELERATOR · 90 DAYS ACTIVE
              </div>
            )}
            <button onClick={() => setShowUpdateModal(true)} style={{ background: "none", border: "1px solid #1E2329", cursor: "pointer", padding: "6px 10px", color: "#8A95A3" }}>
              <Icon name="update" size={14} color="#8A95A3" />
            </button>
          </div>
        </div>

        <div style={{ padding: "40px" }}>

          {/* OVERVIEW */}
          {activeSection === "overview" && (
            <div className="fu">
              <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 3, marginBottom: 6 }}>Command Overview</h1>
              <p style={{ color: "#8A95A3", fontSize: 18, fontStyle: "italic", marginBottom: 40 }}>Empowering Families &amp; Teams to Excel</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 48 }}>
                <div className="card" style={{ padding: 24 }}>
                  <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 12 }}>LICENSE TYPE</p>
                  <p style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 2, color: "#C9A84C" }}>
                    {isTrial ? "7-DAY TRIAL" : license?.type?.toUpperCase() || "CORE"}
                  </p>
                  <p style={{ color: "#4A5568", fontSize: 13, marginTop: 4 }}>
                    {isTrial ? `${daysLeft} days remaining` : "Active"}
                  </p>
                </div>
                <div className="card" style={{ padding: 24 }}>
                  <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 12 }}>LICENSE ID</p>
                  <p style={{ fontFamily: "'DM Mono'", fontSize: 13, color: "#C9A84C", letterSpacing: 1 }}>{license?.id || "—"}</p>
                  <p style={{ color: "#4A5568", fontSize: 12, marginTop: 4 }}>Validated · {new Date().toLocaleDateString()}</p>
                </div>
                <div className="card" style={{ padding: 24 }}>
                  <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 12 }}>ACCESS TIER</p>
                  <p style={{ fontFamily: "'Bebas Neue'", fontSize: 22, color: hasAccelerator ? "#4A8FBF" : "#C9A84C", letterSpacing: 2 }}>
                    {hasAccelerator ? "ACCELERATOR™" : hasSuite ? "COMMAND SUITE™" : "TRIAL"}
                  </p>
                </div>
                <div className="card" style={{ padding: 24 }}>
                  <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 12 }}>EXPIRES</p>
                  <p style={{ fontFamily: "'DM Mono'", fontSize: 13, color: isTrial && daysLeft <= 3 ? "#B03A2E" : "#C9A84C" }}>
                    {license ? new Date(license.expirationDate).toLocaleDateString() : "—"}
                  </p>
                  {isTrial && <p style={{ color: "#B03A2E", fontSize: 12, marginTop: 4 }}>{daysLeft} days left</p>}
                </div>
              </div>

              {/* Upsell */}
              {isTrial && (
                <div style={{ background: "#C9A84C0A", border: "1px solid #C9A84C33", padding: 28, marginBottom: 40 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                    <div>
                      <p style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 2, color: "#C9A84C", marginBottom: 6 }}>Upgrade to Annual License — $44.99/year</p>
                      <p style={{ color: "#8A95A3", fontSize: 15 }}>Keep full access after your trial · Unlock downloads · Priority support</p>
                    </div>
                    <button className="btn-gold" style={{ padding: "12px 28px", fontSize: 13 }} onClick={onUpgrade}>UPGRADE NOW</button>
                  </div>
                </div>
              )}

              {/* Modules grid */}
              <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 26, letterSpacing: 2, marginBottom: 20 }}>PLANNING MODULES</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                {MODULES.map(m => {
                  const locked = m.tier === "accelerator" && !hasAccelerator;
                  return (
                    <div key={m.id} className={`module-card ${locked ? "locked-card" : ""}`}>
                      <Icon name={m.icon} size={20} color={locked ? "#4A5568" : m.tier === "accelerator" ? "#4A8FBF" : "#C9A84C"} />
                      <p style={{ fontFamily: "'Bebas Neue'", fontSize: 17, letterSpacing: 1, marginTop: 12, marginBottom: 4 }}>{m.label}</p>
                      <p style={{ color: "#8A95A3", fontSize: 13 }}>{m.sub}</p>
                      {locked && <span className="tag" style={{ background: "#4A8FBF15", color: "#4A8FBF", border: "1px solid #4A8FBF33", marginTop: 10, display: "inline-block" }}>ACCELERATOR</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* HORIZON */}
          {activeSection === "horizon" && (
            <div className="fu">
              <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 3, marginBottom: 8 }}>4-HORIZON TIMELINE</h1>
              <p style={{ color: "#8A95A3", fontStyle: "italic", marginBottom: 40 }}>Long-horizon planning for leaders who think generationally</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
                {[
                  { h: "1 YEAR",    c: "#C9A84C", sub: "Immediate execution",     pct: "35%" },
                  { h: "3–5 YEARS", c: "#4A8FBF", sub: "Strategic positioning",   pct: "20%" },
                  { h: "10 YEARS",  c: "#7A5E25", sub: "Legacy foundations",       pct: "10%" },
                  { h: "20 YEARS",  c: "#C9A84C", sub: "Generational vision",      pct: "5%", border: "#C9A84C22" },
                ].map(h => (
                  <div key={h.h} className="card" style={{ padding: 28, borderColor: h.border || "#1E2329" }}>
                    <p style={{ fontFamily: "'Bebas Neue'", fontSize: 32, color: h.c, letterSpacing: 2, marginBottom: 8 }}>{h.h}</p>
                    <p style={{ color: "#8A95A3", fontSize: 14 }}>{h.sub}</p>
                    <div className="progress-bar" style={{ marginTop: 20 }}>
                      <div className="progress-fill" style={{ width: h.pct }} />
                    </div>
                    <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: "#4A5568", marginTop: 8, letterSpacing: 1 }}>{h.pct} PLANNED</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PLANNING */}
          {activeSection === "planning" && (
            <div className="fu">
              <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 3, marginBottom: 40 }}>PLANNING MODULES</h1>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
                {MODULES.map(m => {
                  const locked = m.tier === "accelerator" && !hasAccelerator;
                  return (
                    <div key={m.id} className={`module-card ${locked ? "locked-card" : ""}`}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Icon name={m.icon} size={22} color={locked ? "#4A5568" : m.tier === "accelerator" ? "#4A8FBF" : "#C9A84C"} />
                        {locked && <Icon name="lock" size={14} color="#4A5568" />}
                      </div>
                      <p style={{ fontFamily: "'Bebas Neue'", fontSize: 19, letterSpacing: 1, marginTop: 14, marginBottom: 6 }}>{m.label}</p>
                      <p style={{ color: "#8A95A3", fontSize: 13 }}>{m.sub}</p>
                      <button className={locked ? "btn-blue" : "btn-gold"} style={{ marginTop: 20, padding: "10px 20px", fontSize: 12, width: "100%", opacity: locked ? 0.5 : 1 }}>
                        {locked ? "UPGRADE TO UNLOCK" : "OPEN MODULE"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STRATEGY */}
          {activeSection === "strategy" && (
            <div className="fu">
              <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 3, marginBottom: 40 }}>STRATEGIC CATEGORIES</h1>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                {STRATEGIC_CATEGORIES.map((cat, i) => (
                  <div key={i} className="module-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 16 }}>{cat}</span>
                    <Icon name="arrow" size={14} color="#C9A84C" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DOWNLOADS */}
          {activeSection === "downloads" && hasSuite && (
            <div className="fu">
              <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 3, marginBottom: 8 }}>ASSET DOWNLOADS</h1>
              <p style={{ color: "#8A95A3", fontStyle: "italic", marginBottom: 40 }}>Secure downloads · License-validated access · Signed URLs expire in 10 min</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                {[
                  { name: "Life Command Templates", desc: "Core planning worksheets", size: "2.4 MB", fmt: "PDF" },
                  { name: "4-Horizon Worksheet", desc: "1/3-5/10/20 year planning tool", size: "1.1 MB", fmt: "PDF" },
                  { name: "Framework Documents", desc: "Full CLF™ methodology", size: "5.8 MB", fmt: "PDF" },
                  { name: "Family Strategy Map", desc: "Fillable strategy canvas", size: "3.2 MB", fmt: "PDF" },
                  { name: "Financial Decision Matrix", desc: "Investment planning tool", size: "1.7 MB", fmt: "XLSX" },
                  { name: "Mission Planning System", desc: "Personal operating system template", size: "2.0 MB", fmt: "DOCX" },
                ].map((asset, i) => (
                  <div key={i} className="card" style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontFamily: "'Bebas Neue'", fontSize: 17, letterSpacing: 1, marginBottom: 4 }}>{asset.name}</p>
                      <p style={{ color: "#8A95A3", fontSize: 13, marginBottom: 8 }}>{asset.desc}</p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span className="badge" style={{ background: "#C9A84C15", color: "#C9A84C", border: "1px solid #C9A84C33" }}>{asset.fmt}</span>
                        <span className="badge" style={{ background: "#1E2329", color: "#8A95A3" }}>{asset.size}</span>
                      </div>
                    </div>
                    <button className="btn-ghost" style={{ padding: "8px 12px", marginLeft: 16 }}>
                      <Icon name="download" size={14} color="#C9A84C" />
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24, background: "#C9A84C0A", border: "1px solid #C9A84C22", padding: 16 }}>
                <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#C9A84C", marginBottom: 6 }}>SECURITY NOTICE</p>
                <p style={{ fontSize: 13, color: "#8A95A3", lineHeight: 1.6 }}>
                  All files are delivered via signed URLs that expire after 10 minutes. Downloads are watermarked with your license ID.
                  Redistribution of downloaded assets violates the Command Life Framework™ License Agreement.
                </p>
              </div>
            </div>
          )}

          {/* LICENSE */}
          {activeSection === "license" && (
            <div className="fu">
              <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 3, marginBottom: 40 }}>LICENSE & BILLING</h1>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
                <div className="card" style={{ padding: 28 }}>
                  <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 16 }}>ACTIVE LICENSE</p>
                  {[
                    ["License ID", license?.id],
                    ["Type", license?.type?.toUpperCase()],
                    ["Status", licenseStatus?.toUpperCase()],
                    ["Issued", license ? new Date(license.issueDate).toLocaleDateString() : "—"],
                    ["Expires", license ? new Date(license.expirationDate).toLocaleDateString() : "—"],
                    ["Devices", `${license?.deviceCount || 1} / 3`],
                  ].map(([label, val]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #1E2329" }}>
                      <span style={{ fontFamily: "'DM Mono'", fontSize: 11, color: "#8A95A3" }}>{label}</span>
                      <span style={{ fontFamily: "'DM Mono'", fontSize: 12, color: "#C9A84C" }}>{val || "—"}</span>
                    </div>
                  ))}
                </div>
                <div className="card" style={{ padding: 28 }}>
                  <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 16 }}>LICENSE AGREEMENT</p>
                  <p style={{ fontSize: 13, color: "#BEC8D4", lineHeight: 1.8, fontStyle: "italic" }}>
                    "Each license is issued to an individual account holder and may not be shared, transferred, or sublicensed
                    without written permission from the software owner."
                  </p>
                  <div style={{ marginTop: 20 }}>
                    <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 1, color: "#8A95A3", marginBottom: 8 }}>RATE LIMITING & IP MONITORING</p>
                    <span className="badge" style={{ background: "#C9A84C15", color: "#C9A84C", border: "1px solid #C9A84C33" }}>ACTIVE</span>
                  </div>
                </div>
              </div>

              {isTrial && (
                <div style={{ background: "#C9A84C0A", border: "1px solid #C9A84C33", padding: 28 }}>
                  <p style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 2, color: "#C9A84C", marginBottom: 8 }}>Upgrade Your License</p>
                  <p style={{ color: "#8A95A3", marginBottom: 20, fontSize: 15 }}>Your trial expires in <strong style={{ color: daysLeft <= 2 ? "#B03A2E" : "#C9A84C" }}>{daysLeft} days</strong>. Upgrade to maintain access.</p>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <button className="btn-gold" style={{ padding: "12px 28px", fontSize: 13 }} onClick={onUpgrade}>ANNUAL — $44.99/YEAR</button>
                    <button className="btn-blue" style={{ padding: "12px 28px", fontSize: 13 }} onClick={onUpgrade}>ACCELERATOR — $349</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* COMMUNITY */}
          {activeSection === "community" && hasAccelerator && (
            <div className="fu">
              <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 3, marginBottom: 8 }}>COMMUNITY PORTAL</h1>
              <p style={{ color: "#8A95A3", fontStyle: "italic", marginBottom: 40 }}>Master Coaching Accelerator™ — Exclusive Access</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
                {[
                  { label: "Coaching Library",       icon: "book",      desc: "Curated coaching techniques and frameworks" },
                  { label: "Monthly Strategy Drops",  icon: "rocket",    desc: "Monthly book drops and leadership insights" },
                  { label: "Professional Coaches",    icon: "users",     desc: "Access to vetted leadership coaches" },
                  { label: "Event Access",            icon: "calendar",  desc: "Exclusive events and live sessions" },
                ].map((item, i) => (
                  <div key={i} className="module-card" style={{ borderColor: "#4A8FBF22" }}>
                    <Icon name={item.icon} size={20} color="#4A8FBF" />
                    <p style={{ fontFamily: "'Bebas Neue'", fontSize: 20, letterSpacing: 1, marginTop: 14, marginBottom: 6 }}>{item.label}</p>
                    <p style={{ color: "#8A95A3", fontSize: 13 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeSection === "settings" && (
            <div className="fu">
              <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 3, marginBottom: 40 }}>ACCOUNT SETTINGS</h1>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 720 }}>
                <div className="card" style={{ padding: 32 }}>
                  <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 20 }}>PROFILE</p>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 8 }}>NAME</label>
                    <input defaultValue={user?.name} />
                  </div>
                  <div style={{ marginBottom: 28 }}>
                    <label style={{ display: "block", fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 8 }}>EMAIL</label>
                    <input defaultValue={user?.email} />
                  </div>
                  <button className="btn-gold" style={{ padding: "12px 28px", fontSize: 13 }}>SAVE CHANGES</button>
                </div>
                <div className="card" style={{ padding: 32, borderColor: "#B03A2E22" }}>
                  <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#B03A2E", marginBottom: 20 }}>DANGER ZONE</p>
                  <p style={{ color: "#8A95A3", fontSize: 14, marginBottom: 20, lineHeight: 1.7 }}>
                    Deleting your account permanently removes all data, revokes your license, and cannot be undone.
                    Per the license agreement, account deletion also cancels all active subscriptions.
                  </p>
                  <button className="btn-red" style={{ padding: "12px 24px", fontSize: 13 }} onClick={() => { if (confirm("Are you sure? This action cannot be undone.")) { onLogout(); } }}>
                    DELETE ACCOUNT
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── ADMIN PANEL ─────────────────────────────────────────────────────────── */
const AdminPanel = ({ app, setApp, onBack }) => {
  const [activeTab, setActiveTab] = useState("counters");
  const [newCoupon, setNewCoupon] = useState("");
  const [newCode, setNewCode] = useState("");
  const [overrideSuite, setOverrideSuite] = useState(app.commandSuiteRemaining);
  const [overrideAcc, setOverrideAcc] = useState(app.acceleratorRemaining);
  const [revokeEmail, setRevokeEmail] = useState("");
  const [extendEmail, setExtendEmail] = useState("");
  const [extendDays, setExtendDays] = useState(7);

  const tabs = ["counters", "coupons", "codes", "users", "revoke", "versions"];

  return (
    <div style={{ minHeight: "100vh", background: "#080A0D", padding: "40px" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 3, color: "#B03A2E", marginBottom: 8 }}>⬛ ADMIN — SUPER ADMIN ACCESS</p>
            <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 36, letterSpacing: 3 }}>COMMAND CONTROL</h1>
          </div>
          <button className="btn-ghost" style={{ padding: "10px 20px", fontSize: 13 }} onClick={onBack}>← BACK TO SITE</button>
        </div>

        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "TOTAL USERS",     val: app.users.length,                              c: "#C9A84C" },
            { label: "SUITE REMAINING", val: app.commandSuiteRemaining,                     c: "#C9A84C" },
            { label: "ACC REMAINING",   val: app.acceleratorRemaining,                      c: "#4A8FBF" },
            { label: "REVOKED",         val: app.revokedUsers.length,                       c: "#B03A2E" },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: 20 }}>
              <p style={{ fontFamily: "'DM Mono'", fontSize: 9, letterSpacing: 2, color: "#8A95A3", marginBottom: 8 }}>{s.label}</p>
              <p style={{ fontFamily: "'Bebas Neue'", fontSize: 32, color: s.c }}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 32, borderBottom: "1px solid #1E2329" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: "10px 20px", fontFamily: "'DM Mono'", fontSize: 11, letterSpacing: 2,
              background: "none", border: "none", cursor: "pointer", textTransform: "uppercase",
              color: activeTab === t ? "#C9A84C" : "#8A95A3",
              borderBottom: activeTab === t ? "2px solid #C9A84C" : "2px solid transparent",
              transition: "all .2s"
            }}>{t}</button>
          ))}
        </div>

        {/* COUNTERS */}
        {activeTab === "counters" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
              {[
                { label: "COMMAND SUITE", val: app.commandSuiteRemaining, total: 100, c: "#C9A84C", key: "commandSuiteRemaining", state: overrideSuite, setState: setOverrideSuite },
                { label: "ACCELERATOR",   val: app.acceleratorRemaining,  total: 75,  c: "#4A8FBF", key: "acceleratorRemaining", state: overrideAcc,   setState: setOverrideAcc },
              ].map(item => (
                <div key={item.label} className="card" style={{ padding: 28 }}>
                  <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 12 }}>{item.label} REMAINING</p>
                  <p style={{ fontFamily: "'Bebas Neue'", fontSize: 48, color: item.c }}>{item.val}</p>
                  <p style={{ color: "#4A5568", fontSize: 13, marginBottom: 16 }}>of {item.total} total</p>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${(item.val / item.total) * 100}%`, background: `linear-gradient(90deg, ${item.c}88, ${item.c})` }} /></div>
                  <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                    <input type="number" value={item.state} onChange={e => item.setState(Number(e.target.value))} style={{ width: 80 }} min="0" max={item.total} />
                    <button className="btn-ghost" style={{ padding: "12px 16px", fontSize: 12 }}
                      onClick={() => setApp({ ...app, [item.key]: item.state })}>SET</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COUPONS */}
        {activeTab === "coupons" && (
          <div>
            <div className="card" style={{ padding: 28, marginBottom: 24 }}>
              <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 16 }}>ADD COUPON CODE</p>
              <div style={{ display: "flex", gap: 12 }}>
                <input value={newCoupon} onChange={e => setNewCoupon(e.target.value.toUpperCase())} placeholder="e.g. COMMAND25" />
                <button className="btn-gold" style={{ padding: "12px 20px", fontSize: 13, whiteSpace: "nowrap" }}
                  onClick={() => { if (newCoupon) { setApp({ ...app, coupons: [...app.coupons, newCoupon] }); setNewCoupon(""); } }}>
                  ADD
                </button>
              </div>
            </div>
            <div className="card" style={{ overflow: "hidden" }}>
              <table>
                <thead><tr><th>CODE</th><th>STATUS</th><th>ACTION</th></tr></thead>
                <tbody>
                  {app.coupons.map((c, i) => (
                    <tr key={i}>
                      <td><span style={{ fontFamily: "'DM Mono'", color: "#C9A84C" }}>{c}</span></td>
                      <td><span className="badge" style={{ background: "#C9A84C15", color: "#C9A84C", border: "1px solid #C9A84C33" }}>ACTIVE</span></td>
                      <td>
                        <button onClick={() => setApp({ ...app, coupons: app.coupons.filter((_, j) => j !== i) })}
                          style={{ background: "none", border: "none", cursor: "pointer" }}>
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

        {/* CODES */}
        {activeTab === "codes" && (
          <div>
            <div className="card" style={{ padding: 28, marginBottom: 24 }}>
              <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 16 }}>GENERATE BOOK UNLOCK CODE</p>
              <div style={{ display: "flex", gap: 12 }}>
                <input value={newCode} onChange={e => setNewCode(e.target.value.toUpperCase())} placeholder="e.g. BOOK-XXXXXX" readOnly />
                <button className="btn-gold" style={{ padding: "12px 20px", fontSize: 13, whiteSpace: "nowrap" }}
                  onClick={() => { const code = `BOOK-${Math.random().toString(36).toUpperCase().slice(2, 8)}`; setNewCode(code); }}>
                  GENERATE
                </button>
                <button className="btn-ghost" style={{ padding: "12px 16px", fontSize: 12 }}
                  onClick={() => newCode && navigator.clipboard.writeText(newCode)}>
                  <Icon name="copy" size={14} color="#C9A84C" />
                </button>
              </div>
              {newCode && <p style={{ marginTop: 12, fontFamily: "'DM Mono'", fontSize: 13, color: "#C9A84C" }}>Generated: {newCode}</p>}
            </div>
            <div className="card" style={{ padding: 24 }}>
              <p style={{ color: "#8A95A3", fontSize: 15, fontStyle: "italic", lineHeight: 1.7 }}>
                Book unlock codes grant full access to The Discipline Code™ eBook without payment.
                Use for press copies, influencer partnerships, and complimentary access.
                Codes are single-use and expire after 30 days.
              </p>
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <div className="card" style={{ overflow: "hidden" }}>
            <table>
              <thead><tr><th>USER</th><th>EMAIL</th><th>LICENSE</th><th>TIER</th><th>JOINED</th><th>STATUS</th></tr></thead>
              <tbody>
                {app.users.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", color: "#4A5568", padding: "40px", fontStyle: "italic" }}>No users registered yet</td></tr>
                ) : app.users.map((u, i) => (
                  <tr key={i}>
                    <td style={{ color: "#F0F2F5" }}>{u.name}</td>
                    <td><span style={{ fontFamily: "'DM Mono'", fontSize: 12 }}>{u.email}</span></td>
                    <td><span style={{ fontFamily: "'DM Mono'", fontSize: 11, color: "#C9A84C" }}>{u.license?.id || "TRIAL"}</span></td>
                    <td><span className="badge" style={{ background: "#C9A84C15", color: "#C9A84C" }}>{u.tier?.toUpperCase() || "TRIAL"}</span></td>
                    <td style={{ fontFamily: "'DM Mono'", fontSize: 12 }}>{u.date}</td>
                    <td>
                      <span className="badge" style={{
                        background: app.revokedUsers.includes(u.email) ? "#B03A2E22" : "#C9A84C15",
                        color: app.revokedUsers.includes(u.email) ? "#B03A2E" : "#C9A84C"
                      }}>
                        {app.revokedUsers.includes(u.email) ? "REVOKED" : "ACTIVE"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REVOKE */}
        {activeTab === "revoke" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
              {/* Revoke */}
              <div className="card" style={{ padding: 28, borderColor: "#B03A2E33" }}>
                <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#B03A2E", marginBottom: 16 }}>REVOKE ACCESS</p>
                <p style={{ color: "#8A95A3", fontSize: 14, marginBottom: 20 }}>Immediately locks the user's dashboard and invalidates their license.</p>
                <div style={{ display: "flex", gap: 12 }}>
                  <input value={revokeEmail} onChange={e => setRevokeEmail(e.target.value)} placeholder="user@email.com" />
                  <button className="btn-red" style={{ padding: "12px 16px", whiteSpace: "nowrap", fontSize: 12 }}
                    onClick={() => {
                      if (revokeEmail && !app.revokedUsers.includes(revokeEmail)) {
                        setApp({ ...app, revokedUsers: [...app.revokedUsers, revokeEmail] });
                        setRevokeEmail("");
                      }
                    }}>REVOKE</button>
                </div>
              </div>

              {/* Extend Trial */}
              <div className="card" style={{ padding: 28, borderColor: "#C9A84C22" }}>
                <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#C9A84C", marginBottom: 16 }}>EXTEND TRIAL</p>
                <p style={{ color: "#8A95A3", fontSize: 14, marginBottom: 20 }}>Add days to a user's trial license period.</p>
                <div style={{ display: "flex", gap: 12 }}>
                  <input value={extendEmail} onChange={e => setExtendEmail(e.target.value)} placeholder="user@email.com" style={{ flex: 1 }} />
                  <input type="number" value={extendDays} onChange={e => setExtendDays(Number(e.target.value))} style={{ width: 70 }} min={1} max={30} />
                  <button className="btn-ghost" style={{ padding: "12px 14px", fontSize: 12, whiteSpace: "nowrap" }}>+DAYS</button>
                </div>
              </div>
            </div>

            {/* Revoked list */}
            {app.revokedUsers.length > 0 && (
              <div className="card" style={{ padding: 24 }}>
                <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 16 }}>REVOKED ACCOUNTS</p>
                {app.revokedUsers.map((u, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1E2329" }}>
                    <span style={{ fontFamily: "'DM Mono'", fontSize: 13, color: "#B03A2E" }}>{u}</span>
                    <button onClick={() => setApp({ ...app, revokedUsers: app.revokedUsers.filter(r => r !== u) })}
                      style={{ background: "none", border: "1px solid #2C3340", color: "#8A95A3", cursor: "pointer", padding: "4px 12px", fontSize: 11, fontFamily: "'DM Mono'" }}>
                      RESTORE
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Future infrastructure */}
            <div className="card" style={{ padding: 24, marginTop: 24, borderColor: "#C9A84C22" }}>
              <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#C9A84C", marginBottom: 12 }}>FUTURE INFRASTRUCTURE (RESERVED)</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {["Mentor Accounts", "Family-Linked Dashboards", "Team-Level Accounts", "Certification Pathway", "Device Fingerprinting", "IP Monitoring Logs"].map((item, i) => (
                  <div key={i} style={{ padding: "10px 14px", background: "#0A0C0F", border: "1px solid #1E2329", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 6, height: 6, background: "#C9A84C33", borderRadius: "50%" }} />
                    <span style={{ fontFamily: "'DM Mono'", fontSize: 11, color: "#4A5568", letterSpacing: 1 }}>{item.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VERSIONS */}
        {activeTab === "versions" && (
          <div>
            <div className="card" style={{ overflow: "hidden", marginBottom: 24 }}>
              <table>
                <thead><tr><th>VERSION</th><th>DATE</th><th>DESCRIPTION</th><th>TYPE</th><th>MIN LICENSE</th></tr></thead>
                <tbody>
                  {app.versions.map((v, i) => (
                    <tr key={i}>
                      <td><span style={{ fontFamily: "'DM Mono'", color: "#C9A84C" }}>{v.id}</span></td>
                      <td style={{ fontFamily: "'DM Mono'", fontSize: 12 }}>{v.date}</td>
                      <td>{v.desc}</td>
                      <td><span className="badge" style={{ background: v.type === "Major" ? "#C9A84C15" : "#1E2329", color: v.type === "Major" ? "#C9A84C" : "#8A95A3" }}>{v.type}</span></td>
                      <td><span className="badge" style={{ background: "#1E2329", color: "#8A95A3" }}>{v.requiredLicense?.toUpperCase()}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card" style={{ padding: 28 }}>
              <p style={{ fontFamily: "'DM Mono'", fontSize: 10, letterSpacing: 2, color: "#8A95A3", marginBottom: 16 }}>ADD VERSION ENTRY</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 12 }}>
                <input placeholder="v2.2" />
                <input placeholder="2026-04-01" />
                <input placeholder="Description of changes" />
              </div>
              <button className="btn-ghost" style={{ padding: "12px 20px", fontSize: 13, marginTop: 12 }}>ADD VERSION</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── APP ROOT ────────────────────────────────────────────────────────────── */
export default function App() {
  const [app, setApp] = useState({ ...INITIAL_APP });
  const [view, setView] = useState("landing");
  const [user, setUser] = useState(null);
  const [tier, setTier] = useState(null);
  const [license, setLicense] = useState(null);

  useEffect(() => { injectStyles(); }, []);

  // License validation check on every render
  const licenseStatus = getLicenseStatus(license);

  const handleAuth = (userData) => {
    setUser(userData);
    // Auto-create trial license on registration
    const trialLicense = createLicense("trial", "core");
    setLicense(trialLicense);
    setTier("core");
    // Register user
    const newUser = { ...userData, tier: "core", license: trialLicense, date: new Date().toLocaleDateString() };
    setApp(prev => ({ ...prev, users: [...prev.users, newUser] }));
    setView("dashboard");
  };

  const handleLogin = (userData) => {
    setUser(userData);
    if (tier && license) { setView("dashboard"); return; }
    // Simulate existing trial
    const trialLicense = createLicense("trial", tier || "core");
    setLicense(trialLicense);
    setTier(tier || "core");
    setView("dashboard");
  };

  const handlePurchaseComplete = (selectedTier, licenseType = "annual", goToDash = false) => {
    const newLicense = createLicense(licenseType, selectedTier);
    setLicense(newLicense);
    setTier(selectedTier);
    if (selectedTier === "suite" || selectedTier === "accelerator") {
      setApp(prev => ({ ...prev, commandSuiteRemaining: Math.max(0, prev.commandSuiteRemaining - 1) }));
    }
    if (selectedTier === "accelerator") {
      setApp(prev => ({ ...prev, acceleratorRemaining: Math.max(0, prev.acceleratorRemaining - 1) }));
    }
    if (user) {
      const updatedUser = { ...user, tier: selectedTier, license: newLicense, date: new Date().toLocaleDateString() };
      setApp(prev => ({ ...prev, users: [...prev.users.filter(u => u.email !== user.email), updatedUser] }));
    }
    if (goToDash) setView("dashboard");
  };

  const navigate = (dest) => {
    if (dest === "checkout" && !user) { setView("register"); return; }
    setView(dest);
  };

  const handleLogout = () => { setUser(null); setTier(null); setLicense(null); setView("landing"); };
  const handleDeleteAccount = () => { setApp(prev => ({ ...prev, users: prev.users.filter(u => u.email !== user?.email) })); handleLogout(); };

  // Trial expired wall
  if (view === "dashboard" && licenseStatus === "expired") {
    return <TrialExpiredWall
      user={user}
      onUpgrade={() => setView("checkout")}
      onDelete={handleDeleteAccount}
    />;
  }

  return (
    <>
      {/* Hidden admin button */}
      {view !== "admin" && (
        <div onClick={() => setView("admin")} style={{
          position: "fixed", bottom: 20, right: 20, zIndex: 999,
          width: 36, height: 36, background: "#13161B", border: "1px solid #2C3340",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: 0.4
        }} title="Admin">
          <Icon name="settings" size={14} color="#8A95A3" />
        </div>
      )}

      {view === "landing"   && <LandingPage app={app} onNavigate={navigate} />}
      {view === "login"     && <AuthPage mode="login"    onAuth={handleLogin}  onSwitch={() => setView("register")} />}
      {view === "register"  && <AuthPage mode="register" onAuth={handleAuth}   onSwitch={() => setView("login")} />}
      {view === "checkout"  && <CheckoutPage app={app} user={user} onComplete={handlePurchaseComplete} onBack={user ? () => setView("dashboard") : null} />}
      {view === "dashboard" && user && tier && <Dashboard user={user} tier={tier} license={license} app={app} onLogout={handleLogout} onUpgrade={() => setView("checkout")} />}
      {view === "admin"     && <AdminPanel app={app} setApp={setApp} onBack={() => setView("landing")} />}
    </>
  );
}
