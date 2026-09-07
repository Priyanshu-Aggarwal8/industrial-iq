# Industrial IQ — Architectural, Product & Analytical Decisions

**Dealership Performance Intelligence Platform**  
*Author: Forward Deployed Engineer*  
*Dataset Scope: June 1, 2025 – December 31, 2025 (5 Dealerships, 30 Sales Representatives, 510 Leads, 160 Deliveries, 35 Monthly Targets)*  

---

## 1. Product Choice

Industrial IQ is purpose-built as an **executive-grade B2B SaaS Dealership Performance Intelligence platform**, not a cosmetic dashboard or a passive visualization tool. Dealership leadership operates in an environment where capital is tied up in showroom inventory, manufacturer allocations are constrained, and sales cycles are sensitive to lead response speed.

Industrial IQ is designed around three core operational questions:
1. **What is happening?** High-level vital signs: unit quota attainment, delivered revenue, active pipeline value, unfulfilled order backlog, and group win rates.
2. **Why is it happening?** Conversion funnel drop-offs, branch-level disparities, rep execution variances, and delivery fulfillment bottlenecks.
3. **What needs attention?** A deterministic, explainable Action Center that surfaces critical quota deficits, stalled high-value deals, and delivery delays with direct operational directives.

---

## 2. Target User

The primary persona is a **Dealership Group CEO, COO, or Branch General Manager**.
- **Time to insight**: The executive must understand network health within 10–15 seconds of opening the application.
- **Cognitive path**: The user moves naturally from **Executive Overview → Branch Performance → Sales Representative → Lead Lifecycle Timeline → Operational Action**.
- **User expectations**: Zero fake metrics, zero vague AI summaries, clear visual hierarchy, accessible color semantics, and immediate drill-down to supporting records.

---

## 3. Information Architecture & Navigation

The platform uses a persistent application shell with a responsive left navigation rail and clean, deep-linkable client-side hash routing:

```
/#/overview                   -> Executive Overview (vital signs, target pacing, group funnel, branch matrix, action preview)
/#/branches                   -> Branch Performance (dealership cards & comparison matrix)
/#/branches/:branchId         -> Branch Detail View (branch KPIs, target trends, branch funnel, sales team roster, delivery velocity)
/#/representatives            -> Sales Representative Intelligence (group leaderboard, quota officers vs managers, sort/filter)
/#/representatives/:repId     -> Representative Detail View (individual scorecard, win rate, assigned leads, aging backlog)
/#/leads                      -> Lead Intelligence (interactive registry, status & source filters, quick-filter chips, search)
/#/leads/:leadId              -> Modal / Deep-link inspection of individual Lead Lifecycle Timeline
/#/insights                   -> Dedicated Action Center (categorized deterministic alerts with quantitative evidence)
```

**Why this structure?**  
Dealerships operate hierarchically: network → branch → individual sales officer → vehicle transaction. This architecture mirrors physical automotive operations, ensuring managers never lose context. Breadcrumbs enable immediate 1-click upward navigation.

---

## 4. Business Metric Contract & Mathematical Definitions

Every metric displayed in Industrial IQ is deterministically computed from `dealership_data.json`:

| Metric Name | Formula / Definition | Source Fields | Scope & Semantics |
|---|---|---|---|
| **Delivered Units** | `COUNT(deliveries)` occurring within selected date range (joined to lead's branch) | `deliveries.delivery_date`, `leads.id`, `leads.branch_id` | Fulfillment event within period |
| **Delivered Revenue** | `SUM(leads.deal_value)` for all units delivered within selected period | `leads.deal_value`, `deliveries.delivery_date` | Realized revenue from completed deliveries |
| **Monthly Target Units** | `SUM(targets.target_units)` for months overlapping the selected filter | `targets.target_units`, `targets.month`, `targets.branch_id` | Quota applicable to period |
| **Monthly Target Revenue**| `SUM(targets.target_revenue)` for months overlapping selected filter | `targets.target_revenue`, `targets.month`, `targets.branch_id` | Target revenue in INR |
| **Unit Attainment %** | `(Delivered Units / Target Units) * 100` | Derived from actuals and targets | Quota pacing (0% if target is 0) |
| **Unit Gap** | `Delivered Units - Target Units` | Derived | Negative = shortfall; Positive = surplus |
| **Revenue Attainment %**| `(Delivered Revenue / Target Revenue) * 100` | Derived | Financial quota pacing |
| **Revenue Gap** | `Delivered Revenue - Target Revenue` | Derived | In INR |
| **Active Pipeline Value**| `SUM(leads.deal_value)` for leads currently in `['new', 'contacted', 'test_drive', 'negotiation']` | `leads.status`, `leads.deal_value` | Unclosed, active showroom pipeline |
| **Order Backlog** | `COUNT(leads)` and `SUM(deal_value)` for leads currently in `'order_placed'` status | `leads.status === 'order_placed'` | Confirmed bookings awaiting fulfillment |
| **Lead-to-Delivery Rate**| `(Delivered Units / Total Leads Created) * 100` | `deliveries`, `leads.created_at` in period | Period win rate efficiency |
| **Delivery Turnaround** | `MEAN(days_to_deliver)` across deliveries in period | `deliveries.days_to_deliver` | Days from order confirmation to handover |
| **Delivery Delay Rate %** | `(COUNT(deliveries with delay_reason) / Total Deliveries) * 100` | `deliveries.delay_reason !== null` | Operational fulfillment delay frequency |
| **Lead Inactivity (Days)**| `(DatasetReferenceDate - lead.last_activity_at) in days` | `lead.last_activity_at`, Reference `2025-12-31` | Days idle since last sales interaction |

---

## 5. Funnel Reconstruction & Methodology

Inspection of `status_history` across all 510 leads revealed that lead journeys strictly follow a linear progression:  
$$\text{New} \longrightarrow \text{Contacted} \longrightarrow \text{Test Drive} \longrightarrow \text{Negotiation} \longrightarrow \text{Order Placed} \longrightarrow \text{Delivered}$$

At any point in this journey, a lead can exit to `lost`.

### Dual-Perspective Funnel Engine
Dealership managers frequently debate cohort conversion vs monthly operational velocity. Industrial IQ provides a user toggle between:
1. **Cohort Funnel (Leads Created in Period)**: Analyzes leads acquired within the timeframe and tracks their ultimate progression through every milestone.
2. **Period Throughput (Transitions Occurring in Period)**: Tracks operational activity completed during the timeframe (e.g. test drives executed, orders taken, handovers completed this month).

### Stage Drop-Off & Loss Attribution
Between any two consecutive stages $S_i$ and $S_{i+1}$:
- $\text{Stage Conversion Rate} = (Count(S_{i+1}) / Count(S_i)) \times 100$
- $\text{Drop-off Rate} = 100 - \text{Stage Conversion Rate}$
- Every lost lead is mapped to the furthest stage reached before exit, identifying exact funnel drop-off points and categorizing exit reasons.

---

## 6. Actionable Insight Engine (Deterministic & Traceable)

Industrial IQ strictly forbids generic or hallucinated "AI" alerts. Every insight follows a formal specification:
- **Title**: Specific, executive-focused.
- **Category**: `attainment` | `bottleneck` | `fulfillment` | `aging` | `channel`
- **Priority**: `critical` (Score 90–100), `high` (Score 75–89), `medium` (Score 50–74), `info` (<50).
- **Explanation**: Plain-English root cause analysis.
- **Evidence**: Exact counts, percentages, and financial values from verified records.
- **Scope**: Affected branch, representative, or channel.
- **Recommended Action**: Concrete operational directive.
- **Direct Navigation**: Deep-link button taking the manager straight to the affected records.

### Grounded Insight Catalog in Dataset
1. **Lakeside Toyota (B3) Target Crisis**:
   - *Condition*: Attainment < 20% with ≥ 30 target units.
   - *Evidence*: 6 units delivered against 264 unit target (2.3% attainment, ₹56.76 Cr revenue shortfall).
   - *Score*: 98 (Critical).
2. **Lakeside Toyota Early-Funnel Collapse**:
   - *Condition*: `new → contacted` conversion < 65% (group avg is 76.7%) and win rate < 15%.
   - *Evidence*: 33 of 79 leads lost before contact (58.2% contact rate vs 80%+ at peers); overall conversion 7.6%.
   - *Score*: 95 (Critical).
3. **Downtown Toyota (B1) Fulfillment Bottleneck**:
   - *Condition*: Delivery delay rate > 50%.
   - *Evidence*: 55.0% of deliveries delayed (22 of 40 units), averaging 19.3 days turnaround, driven by transit and RTO bottlenecks.
   - *Score*: 88 (High).
4. **Severe Aging in Unfulfilled Order Backlog**:
   - *Condition*: Active `order_placed` leads with inactivity ≥ 30 days.
   - *Evidence*: 24 unfulfilled orders worth ₹5.42 Cr pending over 30 days (oldest: L0022 waiting 195 days with full payment received).
   - *Score*: 84 (High).
5. **Stale High-Value Pipeline in Negotiation/Test Drive**:
   - *Condition*: Active leads in late stages with `deal_value` ≥ ₹25 Lakhs and inactivity ≥ 14 days.
   - *Evidence*: 6 high-value prospects representing ₹1.35 Cr idle for over 2 weeks without rep outreach.
   - *Score*: 80 (High).
6. **Social Media Channel Conversion Underperformance**:
   - *Condition*: Channel conversion < 18% with ≥ 50 inquiries.
   - *Evidence*: Social media converts at 13.9% (10/72) vs showroom walk-ins at 45.7% (64/140).
   - *Score*: 68 (Medium).

---

## 7. Time Semantics

Time handling respects strict semantic boundaries:
- **Deliveries & Realized Revenue**: Bound by `delivery_date`. An order placed in June and delivered in August is counted in August deliveries and revenue.
- **Monthly Targets**: Bound by the months included in the selected date range (`2025-06` to `2025-12`).
- **Inbound Lead Volume**: Bound by `lead.created_at`.
- **Inactivity & Aging**: Evaluated against the dataset reference date (`2025-12-31T23:59:59Z`). For example, an active lead last contacted on December 10 has 21 days of inactivity.

---

## 8. Technical Architecture & Refactored 6-Tier System

Industrial IQ enforces a strict **6-tier enterprise architecture** with unidirectional dependency flow:
$$\text{Presentation Layer} \longrightarrow \text{Application Layer} \longrightarrow \text{Domain Layer} \longrightarrow \text{Data Access Layer} \longrightarrow \text{Data Layer}$$
with cross-cutting utilities provided by the **Infrastructure Layer**.

### Architectural Layers & Boundaries

1. **Layer 1: Data Layer (`src/data/`)**:
   - `schemas.ts`: Strongly typed schemas representing authoritative source data (`dealership_data.json`).
   - `normalizer.ts`: Pure normalization logic handling late-December status discrepancies, lead indexing, and caching. Zero dependencies on React, DOM, or charts.
2. **Layer 2: Data Access Layer (`src/data-access/`)**:
   - `interfaces.ts`: Strict repository interfaces (`IBranchRepository`, `IRepresentativeRepository`, `ILeadRepository`, `ITargetRepository`, `IDeliveryRepository`).
   - `repositories.ts`: Concrete repository implementations and `getDataRepositories()` singleton provider decoupling domain calculators from storage mechanisms.
3. **Layer 3: Domain / Analytics Layer (`src/domain/`)**:
   - `models.ts`: Pure domain entities and analytical data contracts.
   - `kpi.ts`: Deterministic executive KPI calculations (quota pacing, delivered revenue, active pipeline).
   - `targets.ts`: Monthly quota trajectory and comparative branch summaries.
   - `funnel.ts`: Dual-perspective conversion engine (Cohort Funnel vs Period Throughput).
   - `aging.ts`: Sales representative productivity and lead aging heuristics.
   - `delivery.ts`: Fulfillment velocity and SLA delay diagnostics.
   - `insights.ts`: Priority scoring engine (0–100) generating actionable operational directives.
   - *Rule*: Completely framework-agnostic. Zero imports of React, DOM, or chart packages.
4. **Layer 4: Application Layer (`src/application/`)**:
   - `view-models.ts`: UI-friendly ViewModel contracts structured for executive presentation.
   - `use-cases/`: Orchestration use cases (`getOverviewViewModel`, `getBranchPerformanceViewModel`, `getRepresentativePerformanceViewModel`, `getLeadDetailsViewModel`, `getActionableInsightsViewModel`).
   - Prepares presentation-ready models so components never compute business rules.
5. **Layer 5: Presentation Layer (`src/presentation/`)**:
   - `motion/variants.ts`: Framer Motion design system with spring curves, stagger orchestration, and `prefers-reduced-motion` compliance.
   - `context/AppContext.tsx`: Reactive state management, deep-linkable hash routing, and ViewModel binding.
   - `layout/`: Responsive `AppShell`, `Sidebar`, `Header`, and segmented `PremiumDateFilter`.
   - `overview/`: Information hierarchy (Hero Vital Signs → Target Trajectory → Priority Actions → Branch Matrix → Funnel Analysis).
   - `branches/`: `BranchMatrixPage` and deep contextual `BranchDetailPage`.
   - `reps/`: `RepLeaderboardPage` and individual `RepDetailPage`.
   - `leads/`: High-performance `LeadRegistryPage` and interactive `LeadLifecycleModal`.
   - `insights/`: Dedicated `ActionCenterFullPage`.
6. **Layer 6: Infrastructure Layer (`src/infrastructure/`)**:
   - `dates.ts`: Pure date parsing, range validation, and preset configurations.
   - `formatters.ts`: Regional Indian financial notation (INR Lakhs/Crores), percentages, duration, and ISO formatting.

---

## 9. Deliberate Tradeoffs

1. **Client-Side Processing vs Backend API**:
   - *Decision*: Process data client-side in TypeScript.
   - *Rationale*: With 510 leads, 160 deliveries, and 35 targets, the full dataset is ~620 KB uncompressed (~226 KB gzipped). Client-side processing gives instantaneous zero-latency filtering, sorting, and drill-downs without hosting infrastructure dependencies.
2. **Hash-Based Routing vs HTML5 History**:
   - *Decision*: Use window hash routing (`/#/branches/B3`).
   - *Rationale*: Guarantees seamless deep-linking and page refresh compatibility on static Vercel deployments without requiring server-side rewrite rules.
3. **No Fabricated Machine Learning**:
   - *Decision*: Zero fake "AI predictive forecasting" or simulated scenarios.
   - *Rationale*: True enterprise SaaS credibility requires deterministic traceability. Every alert traces to an exact record.

---

## 10. Data Limitations & Handled Anomalies

1. **14 Late-December Unrecorded Loss Transitions**:
   - *Finding*: 14 leads created in late December have `lead.status === 'lost'`, but their `status_history` terminates at an earlier stage (`negotiation`, `test_drive`, `contacted`, `new`) with `lost_reason: null`.
   - *Normalization*: Handled deterministically by flagging `has_unrecorded_loss_transition: true`, attributing their last reached stage, and setting `lost_reason = 'Unspecified / Late-Dec Loss'`.
2. **Quota Scale vs Dataset Scale**:
   - *Finding*: Monthly branch targets in `targets` reflect full showroom capacity (~180–240 units/month group-wide), whereas the dataset contains 160 deliveries total over 7 months.
   - *Resolution*: Displayed transparently as actual target attainment percentages without artificially fabricating additional deliveries or downscaling targets.
3. **Fixed Delivery Delay Reasons**:
   - *Finding*: Exactly 72 of 160 deliveries contain a `delay_reason`. 88 deliveries have `delay_reason: null`. Handled cleanly as on-time deliveries.

---

## 11. Interesting Real Patterns Discovered in Dataset

1. **Lakeside Toyota Catastrophic Breakdown**:
   - While other branches delivered 31–47 units, Lakeside delivered only 6 units (7.6% conversion). The primary failure is top-of-funnel intake: 41.8% of leads are lost before initial contact, and another 41.3% drop between contact and test drive.
2. **Downtown Toyota Delivery Fulfillment Crisis**:
   - Despite ranking #1 in lead conversion (41.2%), Downtown Toyota has the highest delivery delay rate in the network (55.0%), plagued by logistics in transit (6 cases) and RTO registration delays (5 cases).
3. **Severe Order Fulfillment Backlog**:
   - 38 customers placed vehicle orders with deposits but were never delivered in the dataset. Some date back to June 2025 (e.g. Lead L0022, Omkar Varma, Camry ₹50.5L, waiting 195 days).
4. **Channel Disparity: Showroom Walk-ins vs Social Media**:
   - Showroom walk-ins convert at 45.7% (64 of 140 leads). Social media converts at only 13.9% (10 of 72 leads), despite generating higher average deal values.

---

## 12. Future Improvements (With More Time)

1. **Automated Rep Reassignment Engine**: Automated reassignment rules for leads idle > 7 days to available quota officers.
2. **RTO & Logistics Partner Portal**: Supplier-facing turnaround tracking to streamline pre-delivery inspections and registration clearance.
3. **Customer WhatsApp Follow-up Integration**: Direct webhook triggers for scheduling test drives and sending automated delivery updates.
4. **Export Engine**: Executive PDF generation of monthly dealership board packs.

