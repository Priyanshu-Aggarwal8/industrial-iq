# Industrial IQ — Architectural, Product & Analytical Decisions

**Dealership Performance Intelligence & Operational Analytics Platform**  
*Author: Forward Deployed Engineer*  
*Dataset Scope: June 1, 2025 – December 31, 2025 (5 Dealerships, 30 Sales Representatives, 510 Leads, 160 Deliveries, 35 Monthly Targets)*  
*Live Repository:* [https://github.com/Priyanshu-Aggarwal8/industrial-iq](https://github.com/Priyanshu-Aggarwal8/industrial-iq)  
*Target Environment:* Vercel (Single Page Application, Vite, TypeScript, React 18, Tailwind CSS, Three.js)

---

## 1. Executive Summary & Product Vision

Industrial IQ was built as an **executive-grade Dealership Performance Intelligence platform**, not a cosmetic dashboard or a passive visualization tool. Dealership networks operate in an environment where millions in working capital are tied up in floorplan inventory, manufacturer delivery allocations are tightly constrained, and deal close rates decay rapidly with lead inactivity.

Rather than presenting static charts, Industrial IQ answers three critical executive questions:
1. **What is happening across our network?** (Vital signs: unit target attainment, realized revenue, active showroom pipeline value, unfulfilled order backlog, and network conversion rates).
2. **Why is it happening?** (Funnel stage conversion breakdowns, branch-to-branch execution disparities, representative win rates, and post-order fulfillment bottlenecks).
3. **What concrete action must leadership take today?** (A deterministic, quantitative Action Center surfacing critical quota deficits, high-value deal stalls, and logistics delays with direct operational directives).

---

## 2. Mandatory Core Requirements: How They Were Fulfilled

| Requirement | Implementation & Architectural Choice | Executive Impact |
|---|---|---|
| **1. Overview Dashboard** | src/presentation/overview/OverviewPage.tsx featuring Hero Vital Signs (ExecutiveVitalSignsSurface), Target Pacing Trajectory (TargetTrajectorySurface), Priority Actions Showcase, Branch Comparison Matrix, and Group Funnel Breakdown. | CEO assesses total network health within 10 seconds of login. |
| **2. Drill-Down Capability** | 4-level contextual hierarchy: **Network Group → Dealership Branch (BranchDetailPage) → Sales Officer (RepDetailPage) → Individual Vehicle Transaction (LeadLifecycleModal)**. | Complete end-to-end traceability from group-level quotas down to specific customer interactions. |
| **3. Actionable Insights** | Dedicated Action Center (ActionCenterFullPage & ActionCenterPreview) powered by a deterministic scoring engine (0–100 conviction score) with verified mathematical evidence and 1-click navigation. | Eliminates passive metric-gazing by providing direct operational interventions (e.g. reallocating inventory, escalating RTO delays). |
| **4. Time-Range Slicing** | Segmented PremiumDateFilter supporting presets (*Full Dataset [7M]*, *Last 30 Days*, *Last 90 Days*, *Q3 2025*, *Q4 2025*) and custom date boundaries. | Enables instant comparative pacing across quarters and monthly delivery cycles. |
| **5. Responsive Design** | Fluid Tailwind CSS layout engineered for full desktop viewports (up to 4K), laptop screens, and tablets, with accessible touch targets and collapsible navigation. | Allows dealership group executives to monitor operations in the boardroom or on showroom floor tablets. |

---

## 3. Selection of Optional User Stories: Logical Rationale & Tradeoffs

The assignment provided an open-ended problem space with multiple potential directions. In real forward-deployed engineering, **judgment is about choosing the highest-leverage capabilities that directly protect enterprise revenue and operational speed**, while deliberately rejecting low-conviction or speculative features.

### A. Implemented Optional User Stories (Why We Built Them)

#### 1. Lead Aging & Follow-up Alerts (src/domain/aging.ts)
* **Why Selected**: Automotive sales suffer from an aggressive conversion decay curve. A prospect inquiring about a ₹35 Lakh vehicle who is not contacted within 24–48 hours drops drastically in closing probability. 
* **Operational Impact in Dataset**:
  * Uncovered **₹5.42 Cr** in confirmed vehicle orders (order_placed) that have remained unfulfilled for over 30 days without customer communication.
  * Identified **₹1.35 Cr** in late-stage negotiation deals that were completely idle for over 14 days without sales representative outreach.
* **Why It Beats Other Features**: Surfacing aging leads directly prevents customer cancellation and recovers stranded revenue immediately.

#### 2. Conversion Funnel Visualization with Dual-Perspective Engine (src/domain/funnel.ts)
* **Why Selected**: Automotive sales follow a strict linear progression: New -> Contacted -> Test Drive -> Negotiation -> Order Placed -> Delivered. Without stage-by-stage drop-off analytics, leadership cannot distinguish whether poor sales are caused by marketing lead quality, sales rep qualification, or post-booking fulfillment failure.
* **Architectural Innovation — Dual-Perspective Funnel**:
  * **Cohort Funnel**: Tracks leads created within a specific timeframe through their complete journey to assess long-term conversion efficiency.
  * **Period Throughput**: Analyzes stage transitions completed *during* the timeframe to assess live monthly operational velocity.
* **Operational Impact in Dataset**: Revealed that Lakeside Toyota had a massive top-of-funnel collapse (losing 41.8% of leads before initial contact), whereas Downtown Toyota excelled at sales conversion (41.2%) but suffered from severe post-order logistics bottlenecks.

#### 3. Comparative Analytics & Branch Matrix Benchmarking (src/domain/targets.ts)
* **Why Selected**: Automotive dealer groups rely on peer benchmarks to drive accountability. Group executives need to see all 5 dealership hubs ranked side-by-side on uniform parameters (quota attainment, conversion win rate, average deal turnaround, and delivery delay rate).
* **Operational Impact in Dataset**: Exposed that North Star Toyota (Chennai) achieved 86.8% revenue attainment with a 13.8-day delivery turnaround, while Lakeside Toyota achieved only 2.3% attainment. This benchmark allows leadership to transfer proven processes from top performers to underperforming branches.

#### 4. Deterministic Anomaly Detection (src/domain/insights.ts)
* **Why Selected**: Executives do not have time to comb through 500 leads and 160 delivery logs to find operational problems. We implemented an automated anomaly detection heuristic that continuously monitors threshold breaches:
  * Quota pacing deficit > 50% with < 15 days remaining.
  * Fulfillment delay rate > 40%.
  * Stage drop-off rate exceeding peer averages by > 15 percentage points.
* **Operational Impact in Dataset**: Automatically flagged Downtown Toyota’s 55% delay rate (RTO and transit logjams) and prioritized it as a High-Severity directive.

---

### B. Rejected / Deprioritized User Stories (Why We Did NOT Build Them)

#### 1. Why We Rejected AI-Powered Summaries (LLM Text Generation)
* **Rationale**: Generative AI text summaries introduce hallucination risks, non-deterministic phrasing, latency, and external API key dependencies. An automotive CEO reviewing financial performance requires **auditable, deterministic numbers backed by mathematical proof**, not conversational prose that might hallucinate a ₹56 Cr target deficit as 'moderate pacing'.
* **Alternative Delivered**: A deterministic, rule-based Action Engine that generates clear, natural-language executive directives with **100% grounded numerical evidence** and deep-links directly to the underlying source records.

#### 2. Why We Rejected What-If Scenarios & Predictive ML Forecasting
* **Rationale**: The dataset spans only 7 months with 160 realized deliveries total against monthly network quotas of ~200 units/month. Fitting predictive regression models or complex ML time-series forecasting on a 7-month dataset with sparse deliveries is statistically unsound ('garbage in, garbage out'). Furthermore, What-If sliders ('what if conversion improves by 10%?') provide speculative theoretical numbers rather than solving active dealership crises.
* **Alternative Delivered**: Ground-truth target pacing calculations (TargetTrajectorySurface) that compare current actual run rates against authoritative monthly quotas to show the exact mathematical gap required to hit budget.

#### 3. Why We Rejected Static PDF / CSV Export
* **Rationale**: Exporting static PDF snapshots or CSV sheets encourages executives to revert to offline, disconnected spreadsheets that are outdated the moment they are generated. 
* **Alternative Delivered**: Deep-linkable client-side hash URLs (/#/branches/B3, /#/representatives/R005, /#/leads/L0022) allowing leadership to share exact live analytical views instantly across devices, keeping the entire organization aligned on a single live source of truth.

---

## 4. UI/UX Architecture: The Product-As-Hero Philosophy

### A. The 3D Liquid Ripple & SaaS Cockpit Landing Experience
Rather than treating the landing page as a generic marketing flyer with small product screenshots, Industrial IQ promotes the **actual live product interface into the hero experience**:
* **Interactive SaaS Cockpit (HeroSaaSCockpit.tsx)**: The dominant viewport element is an interactive, live-modeled dealership operations console with real-time branch switching, live KPI telemetry, and interactive pipeline stage progress.
* **Lando Norris-Inspired Liquid Ripple Shader (LandingRippleBackground.tsx)**: Built using Three.js and GLSL shaders to provide an organic, high-tech hydrodynamic backdrop that reacts gracefully to cursor movement with slowed, calming wave harmonics (delta * 0.42) and soft depth blur (ackdrop-blur-[2px]).
* **Light/Dark Mode Dual Shader Engine**:
  * **Dark Mode**: Deep #0a0c10 palette with subtle emerald caustics and soft cyan highlights.
  * **Light Mode (Zero White Washout)**: Specular reflection was re-engineered away from blinding pure white (1.0, 1.0, 1.0) to a refined emerald sheen (ec3(0.05, 0.68, 0.48)), paired with cool sage/slate liquid trough depth (ec3(0.80, 0.88, 0.85)) and emerald-teal contour ripple rings. Atmospheric overlays were lightened to preserve crisp 3D wave contrast without white fogging.

### B. Navigation & Layout Discipline
* **Single Global Navigation Header**: Integrated seamlessly in AppShell.tsx across both the landing page and internal analytics views.
* **Single Universal Enterprise Footer**: Clean 4-column footer providing brand mission, platform navigation, interactive dealership hub selectors, and governance specifications across all views.
* **Removed Redundant Marketing Banners**: Eliminated extraneous pre-footer call-to-action blocks to maintain a clean editorial flow from capability cards directly into the universal footer.

---

## 5. Technical Architecture: 6-Tier Clean Architecture

Industrial IQ enforces strict separation of concerns with unidirectional dependency flow:

```
Presentation Layer -> Application Layer -> Domain Layer -> Data Access Layer -> Data Layer
```

```
src/
├── data/                      # LAYER 1: Raw Schemas & Data Normalization (Zero UI deps)
│   ├── schemas.ts             # Strongly typed TypeScript interfaces for dealership_data.json
│   └── normalizer.ts          # Pure normalization handling late-Dec anomalies & indexing
├── data-access/               # LAYER 2: Repository Pattern
│   ├── interfaces.ts          # IBranchRepository, ILeadRepository, ITargetRepository, etc.
│   └── repositories.ts        # Concrete in-memory repository providers
├── domain/                    # LAYER 3: Pure Domain & Business Logic (Framework-Agnostic)
│   ├── models.ts              # Pure analytical domain models
│   ├── kpi.ts                 # Deterministic KPI math (revenue, units, win rates)
│   ├── targets.ts             # Quota trajectory & branch pacing
│   ├── funnel.ts              # Dual-perspective conversion funnel engine
│   ├── aging.ts               # Lead aging & rep productivity calculations
│   ├── delivery.ts            # Fulfillment turnaround & delay diagnostics
│   └── insights.ts            # Priority scoring heuristic (0-100)
├── application/               # LAYER 4: Use Cases & ViewModels
│   ├── view-models.ts         # Presentation-ready view model contracts
│   └── use-cases/             # Orchestrators (getOverviewViewModel, getBranchViewModel, etc.)
├── presentation/              # LAYER 5: React UI Components
│   ├── landing/               # Product-as-Hero 3D landing scene & liquid ripple shaders
│   ├── layout/                # AppShell, TopNavigation, universal footer, date filters
│   ├── overview/              # Executive vital signs, trajectory, and matrix surfaces
│   ├── branches/              # Branch matrix and detailed branch scorecards
│   ├── reps/                  # Representative leaderboard and individual scorecards
│   ├── leads/                 # High-performance lead table & lifecycle inspection modal
│   └── insights/              # Dedicated Action Center full page
└── infrastructure/            # LAYER 6: Cross-Cutting Infrastructure
    ├── dates.ts               # Pure date parsing, range filtering, and presets
    └── formatters.ts          # Regional Indian financial notation (₹ Lakhs, ₹ Crores)
```

### Architectural Safeguards:
1. **Zero Domain-UI Leakage**: The `domain/` layer has 0 imports of React, Lucide icons, Three.js, or Recharts. It can be executed in Node.js CLI or unit tested in complete isolation.
2. **Deterministic Singletons**: Repositories provide indexed O(1) lookups for leads by branch, representative, and status.

---

## 6. Business Metric Contract & Mathematical Definitions

Every metric displayed across Industrial IQ is mathematically verified against `dealership_data.json`:

| Metric Name | Exact Mathematical Formula | Source Fields | Business Semantics |
|---|---|---|---|
| **Delivered Units** | `COUNT(deliveries)` where `delivery_date` is in range | `deliveries.delivery_date`, `leads.id` | Realized unit handovers completed within period. |
| **Delivered Revenue** | `SUM(deal_value)` for leads delivered within period | `leads.deal_value`, `deliveries.delivery_date` | Actual realized sales revenue (in INR). |
| **Target Units / Revenue** | `SUM(targets)` for months overlapping selected range | `targets.target_units`, `targets.target_revenue` | Budgeted executive quota. |
| **Attainment %** | `(Actual Delivered / Target) * 100` | Derived | Percentage of target realized. |
| **Active Pipeline Value** | `SUM(deal_value)` where status in `[new, contacted, test_drive, negotiation]` | `leads.status`, `leads.deal_value` | Total monetary value of in-flight deals. |
| **Order Backlog** | `SUM(deal_value)` where status = `'order_placed'` | `leads.status === 'order_placed'` | Booked orders awaiting delivery allocation. |
| **Overall Win Rate** | `(Delivered Units / Total Leads Created in Period) * 100` | `deliveries`, `leads.created_at` | True end-to-end commercial conversion efficiency. |
| **Delivery Turnaround** | `MEAN(days_to_deliver)` | `deliveries.days_to_deliver` | Average calendar days from booking to handover. |
| **Delivery Delay Rate** | `(Count(delayed deliveries) / Total Deliveries) * 100` | `deliveries.delay_reason !== null` | Percentage of handovers impacted by logistics/RTO delays. |
| **Inactivity / Aging** | `DatasetReferenceDate - lead.last_activity_at` | `2025-12-31T23:59:59Z` | Days idle without customer engagement. |

---

## 7. Data Anomalies Discovered & Handled

During deep exploratory data analysis, three data discrepancies were discovered and normalized:
1. **14 Late-December Unrecorded Loss Transitions**:
   * *Anomaly*: 14 leads created between Dec 20–Dec 31 had lead.status = 'lost', but their status_history array terminated at an earlier stage (
egotiation, 	est_drive, or contacted) without a final transition record or lost_reason.
   * *Normalization*: src/data/normalizer.ts flags these records (has_unrecorded_loss_transition: true), attributes them to the furthest stage reached, and records their exit reason as 'Unspecified / Late-Dec Loss', ensuring zero missing records in funnel math.
2. **Showroom Target Scale Discrepancy**:
   * *Anomaly*: Monthly branch targets in 	argets reflect full dealership capacity (~180–240 units/month group-wide), whereas the dataset records 160 delivered units over 7 months.
   * *Resolution*: Displayed transparently as actual quota attainment percentages without fabricating artificial deliveries or artificially scaling down official targets.
3. **Delivery Delay Attribution**:
   * *Finding*: Exactly 72 of 160 deliveries contained an explicit delay reason (e.g. *transit_damage*, *rto_delay*, *customer_rescheduled*, *pdi_failed*). Handled with 100% precision in fulfillment analytics.

---

## 8. Real Operational Findings in the Dealership Network

1. **Lakeside Toyota (Hyderabad) Intake Collapse**:
   * Delivered only 6 units (7.6% win rate) against a target of 264 units (2.3% attainment). 41.8% of inbound leads were lost before initial contact, indicating broken lead routing or disengaged sales staff.
2. **Downtown Toyota (Mumbai) Logistics Crisis**:
   * Achieved the group's highest sales conversion rate (41.2%), but suffered the worst fulfillment delay rate in the network (55.0%), averaging 19.3 days turnaround due to RTO registration backlogs.
3. **Severe Booking Backlog**:
   * 38 customers placed vehicle deposits that were never fulfilled during the 7 months, tying up ₹8.1 Cr in unfulfilled demand (e.g. Lead L0022 waiting 195 days).
4. **Channel Disparity (Showroom vs Social Media)**:
   * Showroom walk-ins converted at 45.7% (64 of 140), whereas Social Media inquiries converted at only 13.9% (10 of 72).

---

## 9. Deployment & Production Engineering (Vercel Ready)

* **SPA Catch-All Rewrites (ercel.json)**: Configured rewrite rules (/(.*) -> /index.html) ensuring that refreshing any deep link (/#/branches/B3 or subpaths) never produces a 404 error.
* **React Singleton Bundle Architecture**: Vite and Rollup configurations were streamlined to package React and ReactDOM into a single unified runtime bundle, eliminating dual-instance hook crashes.
* **Static Caching**: 1-year immutable caching (public, max-age=31536000, immutable) enabled for /assets/ static chunks.
* **Fallback Redirects**: Added public/_redirects for Netlify / Cloudflare Pages deployment compatibility.
* **Clean Git Repository**: Synchronized to GitHub at [https://github.com/Priyanshu-Aggarwal8/industrial-iq](https://github.com/Priyanshu-Aggarwal8/industrial-iq).

---

## 10. Future Roadmap (With More Time)

1. **Automated Lead Reassignment Engine**: Heuristic engine to automatically reassign leads idle > 5 days from underperforming reps to top-converting sales officers.
2. **Live RTO & Transport Partner Portal**: Supplier-facing tracking interface for transport logistics and RTO registration agents to reduce handover turnaround from 19 days to under 7 days.
3. **WhatsApp Business API Webhooks**: Automated customer milestone messaging triggered at each status transition (e.g. vehicle dispatch, PDI clearance, delivery appointment).
4. **Board Pack PDF Exporter**: Automated monthly dealership group PDF board presentation generator.
