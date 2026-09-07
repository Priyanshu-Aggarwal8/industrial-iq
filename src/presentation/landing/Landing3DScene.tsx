import React, { useState, useRef, useEffect } from 'react';
import { animate } from 'animejs';
import {
  Target,
  Layers,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Activity,
} from 'lucide-react';
import { OverviewViewModel } from '../../application/view-models';
import { DomainBranchPerformance } from '../../domain/models';
import { AppNavSection } from '../layout/Sidebar';
import { LandingRippleBackground } from './LandingRippleBackground';
import { HeroSaaSCockpit } from './HeroSaaSCockpit';

interface Landing3DSceneProps {
  overviewViewModel: OverviewViewModel;
  branchSummaries: DomainBranchPerformance[];
  onNavigate: (section: AppNavSection, params?: any) => void;
  theme?: 'light' | 'dark';
}

export const Landing3DScene: React.FC<Landing3DSceneProps> = ({
  overviewViewModel,
  branchSummaries,
  onNavigate,
  theme = 'dark',
}) => {
  const [activeBranchId, setActiveBranchId] = useState<string>('all');
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cardTilt, setCardTilt] = useState<{ rotateX: number; rotateY: number; glareX: number; glareY: number }>({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
  });

  const cockpitCardRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  // Entrance animation using Anime.js
  useEffect(() => {
    try {
      animate('.anime-hero-fade', {
        opacity: [0, 1],
        translateY: [24, 0],
        duration: 900,
        delay: (_el, i) => (i ?? 0) * 100,
        ease: 'outExpo',
      });
      animate('.anime-cockpit-card', {
        opacity: [0, 1],
        translateY: [36, 0],
        scale: [0.99, 1],
        duration: 1100,
        delay: 350,
        ease: 'outExpo',
      });
    } catch {
      // Graceful fallback if Anime.js runs in an unsupported environment
    }
  }, []);

  // Global mouse tracking for Three.js ripple wave propagation & card tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const nx = (clientX / innerWidth) * 2 - 1;
    const ny = (clientY / innerHeight) * 2 - 1;
    setMousePos({ x: nx, y: ny });

    if (cockpitCardRef.current) {
      const rect = cockpitCardRef.current.getBoundingClientRect();
      const inX = clientX - rect.left;
      const inY = clientY - rect.top;
      if (inX >= 0 && inX <= rect.width && inY >= 0 && inY <= rect.height) {
        const rotY = ((inX / rect.width) * 2 - 1) * 2.5; // subtle 3D tilt
        const rotX = -((inY / rect.height) * 2 - 1) * 2.5;
        const gx = (inX / rect.width) * 100;
        const gy = (inY / rect.height) * 100;
        setCardTilt({ rotateX: rotX, rotateY: rotY, glareX: gx, glareY: gy });
      }
    }
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setCardTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white selection:bg-emerald-500/30 overflow-x-hidden transition-colors duration-300"
    >
      {/* 1. Full-Screen Interactive Three.js Liquid Ripple Canvas Background (Inspired by landonorris.com) */}
      <LandingRippleBackground theme={theme} mousePos={mousePos} />

      {/* 2. Razor-Sharp Native DOM Layer (Spanning 100% Full Width) */}
      <div className="relative z-10 w-full flex flex-col">
        
        {/* ========================================================================= */}
        {/* INITIAL VIEWPORT HERO SECTION: Commands the screen with giant typography */}
        {/* ========================================================================= */}
        <section className="min-h-[calc(100vh-64px)] w-full flex flex-col justify-center items-center text-center px-4 sm:px-8 lg:px-12 py-12 sm:py-16 relative">
          
          {/* Telemetry Status Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 dark:bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-mono font-semibold tracking-widest uppercase mb-6 sm:mb-8 anime-hero-fade shadow-[0_0_24px_rgba(16,185,129,0.15)] dark:shadow-[0_0_24px_rgba(16,185,129,0.25)] backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span>AUTONOMOUS DEALERSHIP ENTERPRISE OS // 5 HUBS 3D SYNCED</span>
          </div>

          {/* Giant Hero Headline Covering Viewport on Initial Load */}
          <h1 className="w-full text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[9.2rem] font-black tracking-tighter text-neutral-950 dark:text-white uppercase leading-[0.88] anime-hero-fade select-none drop-shadow-sm dark:drop-shadow-2xl">
            Operate At<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 drop-shadow-[0_10px_35px_rgba(16,185,129,0.25)] dark:drop-shadow-[0_15px_50px_rgba(16,185,129,0.35)]">
              Peak Velocity
            </span>
          </h1>

          {/* Editorial Subtitle */}
          <p className="text-base sm:text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 max-w-4xl mx-auto font-normal mt-6 sm:mt-8 anime-hero-fade leading-relaxed">
            Deterministic revenue quota tracking, live multi-city showroom telemetry, and autonomous pit-wall directives across Mumbai, Bangalore, Delhi, Chennai, and Hyderabad.
          </p>

          {/* Primary Action Button Cluster */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 sm:mt-10 anime-hero-fade">
            <button
              onClick={() => onNavigate('overview')}
              className="px-8 py-4 rounded-2xl bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-extrabold text-base transition-all shadow-xl shadow-neutral-950/10 dark:shadow-[0_0_40px_rgba(255,255,255,0.25)] flex items-center gap-3 group cursor-pointer"
            >
              <span>Launch Executive Cockpit</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
            <a
              href="#cockpit-section"
              className="px-7 py-4 rounded-2xl bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-800 border border-neutral-300/80 dark:border-white/20 text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white font-bold text-base transition-all backdrop-blur-xl flex items-center gap-2.5 cursor-pointer shadow-lg"
            >
              <span>Inspect 3D Product Cockpit</span>
              <ChevronDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-bounce" />
            </a>
          </div>

          {/* Live Telemetry KPI Metrics Pill Row */}
          <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs sm:text-sm font-mono text-neutral-600 dark:text-neutral-400 anime-hero-fade border-t border-neutral-200/80 dark:border-white/10 pt-6 w-full max-w-4xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-neutral-900 dark:text-neutral-300 font-semibold">5 METRO HUBS</span>
              <span>SYNCHRONIZED</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-neutral-900 dark:text-neutral-300 font-semibold">1,486 LEADS</span>
              <span>LIVE FUNNEL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 dark:bg-teal-400 animate-pulse" />
              <span className="text-neutral-900 dark:text-neutral-300 font-semibold">1.3d FASTER</span>
              <span>DELIVERY SLA</span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* DOMINANT PRODUCT COCKPIT: Spans Full Page Width (No Narrow Constraints)  */}
        {/* ========================================================================= */}
        <section id="cockpit-section" className="w-full px-3 sm:px-6 md:px-10 lg:px-14 xl:px-16 pt-4 pb-16 sm:pb-24">
          
          <div className="w-full max-w-[1760px] mx-auto">
            {/* Section Eyebrow Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block mb-1">
                  LIVE TELEMETRY COCKPIT
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                  National Operations Command Center
                </h2>
              </div>
              <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                Interactive liquid surface reacts to cursor velocity & dealership telemetry
              </div>
            </div>

            {/* The 3D Interactive Cockpit Card with Full Width & Zero Clipping */}
            <div
              ref={cockpitCardRef}
              style={{
                perspective: '1600px',
              }}
              className="w-full anime-cockpit-card"
            >
              <div
                style={{
                  transform: `rotateX(${cardTilt.rotateX}deg) rotateY(${cardTilt.rotateY}deg)`,
                  transition: 'transform 0.15s ease-out',
                  transformStyle: 'preserve-3d',
                }}
                className="relative w-full rounded-3xl group"
              >
                {/* Dynamic Specular Reflection Following Mouse */}
                <div
                  style={{
                    background: isDark
                      ? `radial-gradient(900px circle at ${cardTilt.glareX}% ${cardTilt.glareY}%, rgba(52, 211, 153, 0.12), transparent 65%)`
                      : `radial-gradient(900px circle at ${cardTilt.glareX}% ${cardTilt.glareY}%, rgba(16, 185, 129, 0.08), transparent 65%)`,
                  }}
                  className="pointer-events-none absolute -inset-1 rounded-3xl opacity-90 transition-opacity duration-300 z-20"
                  aria-hidden="true"
                />

                {/* The Hero Cockpit Component Spanning Complete Width */}
                <div className="relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.08),0_0_35px_rgba(16,185,129,0.1)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(16,185,129,0.18)] rounded-3xl w-full">
                  <HeroSaaSCockpit
                    overviewViewModel={overviewViewModel}
                    branchSummaries={branchSummaries}
                    onNavigate={onNavigate}
                    theme={theme}
                    activeBranchId={activeBranchId}
                    onSelectBranch={setActiveBranchId}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CORE ENTERPRISE CAPABILITIES: Spanning Full Page Width                    */}
        {/* ========================================================================= */}
        <section className="w-full px-3 sm:px-6 md:px-10 lg:px-14 xl:px-16 py-14 sm:py-16 pb-20 sm:pb-24 border-t border-neutral-200/80 dark:border-white/10 bg-neutral-100/70 dark:bg-neutral-950/60 backdrop-blur-md transition-colors duration-300">
          <div className="w-full max-w-[1760px] mx-auto">
            <div className="mb-8 text-center sm:text-left">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 block mb-1">
                ENTERPRISE SYSTEM ARCHITECTURE
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                Engineered for Multi-City Automotive Dealership Groups
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7">
              {/* Capability 1: Target Trajectory */}
              <div
                onClick={() => onNavigate('overview')}
                className="relative p-[1px] rounded-3xl bg-gradient-to-b from-neutral-200 via-neutral-200/40 to-transparent dark:from-white/20 dark:via-white/5 dark:to-transparent hover:from-emerald-500/50 hover:via-teal-500/20 hover:to-transparent transition-all duration-500 group shadow-lg hover:shadow-2xl hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Hover Ambient Corner Glow */}
                <div className="pointer-events-none absolute -top-12 -right-12 w-44 h-44 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative h-full rounded-[23px] bg-white/95 dark:bg-neutral-900/90 backdrop-blur-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 overflow-hidden border border-neutral-200/60 dark:border-neutral-800/80">
                  <div className="space-y-4">
                    {/* Top Meta Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                          <Target className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          01 // PACING ENGINE
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
                        ON PACE (+12.4%)
                      </span>
                    </div>

                    {/* Interactive Telemetry Visual Preview */}
                    <div className="p-3.5 rounded-2xl bg-neutral-50/90 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/60 space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-neutral-500 dark:text-neutral-400">Monthly Run-Rate</span>
                        <span className="font-bold text-neutral-950 dark:text-white">₹38.88 Cr / ₹313.01 Cr</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden relative">
                        <div className="absolute top-0 left-0 bottom-0 w-[42%] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400 pt-0.5">
                        <span>5 METRO HUBS BENCHMARKED</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">1.3d FASTER PDI</span>
                      </div>
                    </div>

                    {/* Card Title & Description */}
                    <div>
                      <h3 className="text-lg font-bold text-neutral-950 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1.5">
                        Deterministic Quota Trajectory
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Benchmark delivered revenue against monthly target across Mumbai, Bangalore, Delhi, Chennai, and Hyderabad. Pinpoint gap trajectories before month-end closure.
                      </p>
                    </div>
                  </div>

                  {/* Card Launch Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-200/70 dark:border-neutral-800/80 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span>Launch Trajectory Cockpit</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Capability 2: Full-Funnel Stage Velocity */}
              <div
                onClick={() => onNavigate('leads')}
                className="relative p-[1px] rounded-3xl bg-gradient-to-b from-neutral-200 via-neutral-200/40 to-transparent dark:from-white/20 dark:via-white/5 dark:to-transparent hover:from-blue-500/50 hover:via-teal-500/20 hover:to-transparent transition-all duration-500 group shadow-lg hover:shadow-2xl hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Hover Ambient Corner Glow */}
                <div className="pointer-events-none absolute -top-12 -right-12 w-44 h-44 rounded-full bg-blue-500/10 dark:bg-blue-500/15 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative h-full rounded-[23px] bg-white/95 dark:bg-neutral-900/90 backdrop-blur-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 overflow-hidden border border-neutral-200/60 dark:border-neutral-800/80">
                  <div className="space-y-4">
                    {/* Top Meta Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                          <Layers className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          02 // PIPELINE FLOW
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-400">
                        31.4% CONVERSION
                      </span>
                    </div>

                    {/* Interactive Telemetry Visual Preview */}
                    <div className="p-3.5 rounded-2xl bg-neutral-50/90 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/60 space-y-2.5">
                      <div className="grid grid-cols-4 gap-1 text-center font-mono">
                        <div>
                          <div className="text-xs font-bold text-neutral-950 dark:text-white">1,486</div>
                          <div className="text-[9px] text-neutral-500 dark:text-neutral-400">Inflow</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-950 dark:text-white">812</div>
                          <div className="text-[9px] text-neutral-500 dark:text-neutral-400">Test Drive</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-950 dark:text-white">65</div>
                          <div className="text-[9px] text-neutral-500 dark:text-neutral-400">Booked</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">72</div>
                          <div className="text-[9px] text-neutral-500 dark:text-neutral-400">Gate Del.</div>
                        </div>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden relative">
                        <div className="absolute top-0 left-0 bottom-0 w-[58%] bg-gradient-to-r from-blue-500 to-teal-400 rounded-full" />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400 pt-0.5">
                        <span>COHORT + EVENT TRACE</span>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">160 GATE UNITS</span>
                      </div>
                    </div>

                    {/* Card Title & Description */}
                    <div>
                      <h3 className="text-lg font-bold text-neutral-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1.5">
                        Full-Funnel Stage Velocity
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Trace 1,486 customer opportunities from Inflow to Test Drive, Negotiation, and Delivery Gate. Expose drop-off friction with dual cohort-event analytics.
                      </p>
                    </div>
                  </div>

                  {/* Card Launch Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-200/70 dark:border-neutral-800/80 text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span>Inspect Pipeline & Funnel</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Capability 3: Autonomous Pit-Wall Directives */}
              <div
                onClick={() => onNavigate('insights')}
                className="relative p-[1px] rounded-3xl bg-gradient-to-b from-neutral-200 via-neutral-200/40 to-transparent dark:from-white/20 dark:via-white/5 dark:to-transparent hover:from-amber-500/50 hover:via-orange-500/20 hover:to-transparent transition-all duration-500 group shadow-lg hover:shadow-2xl hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Hover Ambient Corner Glow */}
                <div className="pointer-events-none absolute -top-12 -right-12 w-44 h-44 rounded-full bg-amber-500/10 dark:bg-amber-500/15 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative h-full rounded-[23px] bg-white/95 dark:bg-neutral-900/90 backdrop-blur-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 overflow-hidden border border-neutral-200/60 dark:border-neutral-800/80">
                  <div className="space-y-4">
                    {/* Top Meta Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          03 // ACTION ENGINE
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400">
                        8 ACTIVE DIRECTIVES
                      </span>
                    </div>

                    {/* Interactive Telemetry Visual Preview */}
                    <div className="p-3.5 rounded-2xl bg-neutral-50/90 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/60 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-amber-600 dark:text-amber-400 font-bold">P1 CRITICAL INTERVENTION</span>
                        <span className="text-neutral-950 dark:text-white font-bold">+₹1.8 Cr</span>
                      </div>
                      <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-200 truncate">
                        Reallocate aging XUV700 inventory from Hyderabad
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400 pt-0.5">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                          <span>98.4% Conviction</span>
                        </span>
                        <span className="text-neutral-700 dark:text-neutral-300">Autopilot Ready</span>
                      </div>
                    </div>

                    {/* Card Title & Description */}
                    <div>
                      <h3 className="text-lg font-bold text-neutral-950 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-1.5">
                        Autonomous Pit-Wall Directives
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Receive prioritized, high-conviction interventions. Reallocate hot inventory, accelerate delayed deliveries, and assist struggling reps with mathematical certainty.
                      </p>
                    </div>
                  </div>

                  {/* Card Launch Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-200/70 dark:border-neutral-800/80 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <span>Review Action Directives</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cards flow directly into the shared universal footer */}
      </div>
    </div>
  );
};
