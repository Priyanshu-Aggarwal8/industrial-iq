import React from 'react';
import {
  Car,
  DollarSign,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useFilter } from '../../context/FilterContext';
import { calculateExecutiveKpis } from '../../analytics/kpi';
import { KpiCard } from '../common/KpiCard';
import { formatCurrency, formatInteger, formatPercent } from '../../utils/formatters';

export const ExecutiveKpiRow: React.FC = () => {
  const { dataset, dateFilter, selectedBranchId } = useFilter();
  const kpis = calculateExecutiveKpis(dataset, dateFilter, selectedBranchId);

  const getUnitStatus = () => {
    if (kpis.targetUnits === 0) return { text: 'No Target', variant: 'neutral' as const };
    if (kpis.unitAttainment >= 80) return { text: 'On Track', variant: 'healthy' as const };
    if (kpis.unitAttainment >= 40) return { text: 'Pacing Slow', variant: 'warning' as const };
    return { text: 'Severe Gap', variant: 'critical' as const };
  };

  const getRevenueStatus = () => {
    if (kpis.targetRevenue === 0) return { text: 'No Target', variant: 'neutral' as const };
    if (kpis.revenueAttainment >= 80) return { text: 'On Track', variant: 'healthy' as const };
    if (kpis.revenueAttainment >= 40) return { text: 'Behind Target', variant: 'warning' as const };
    return { text: 'Critical Deficit', variant: 'critical' as const };
  };

  const unitStatus = getUnitStatus();
  const revStatus = getRevenueStatus();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* 1. Delivered Units */}
      <KpiCard
        title="Delivered Units"
        value={formatInteger(kpis.deliveredUnits)}
        subtitle={`${formatPercent(kpis.unitAttainment)} of Target`}
        target={formatInteger(kpis.targetUnits)}
        attainment={kpis.unitAttainment}
        gap={`${kpis.unitGap >= 0 ? '+' : ''}${kpis.unitGap} units`}
        statusText={unitStatus.text}
        statusVariant={unitStatus.variant}
        icon={Car}
      />

      {/* 2. Delivered Revenue */}
      <KpiCard
        title="Delivered Revenue"
        value={formatCurrency(kpis.deliveredRevenue, true)}
        subtitle={`${formatPercent(kpis.revenueAttainment)} of Target`}
        target={formatCurrency(kpis.targetRevenue, true)}
        attainment={kpis.revenueAttainment}
        gap={`${kpis.revenueGap >= 0 ? '+' : ''}${formatCurrency(kpis.revenueGap, true)}`}
        statusText={revStatus.text}
        statusVariant={revStatus.variant}
        icon={DollarSign}
      />

      {/* 3. Active Pipeline Value */}
      <KpiCard
        title="Active Pipeline"
        value={formatCurrency(kpis.pipelineActiveValue, true)}
        subtitle={`${kpis.pipelineActiveCount} active opportunities`}
        statusText="In Negotiation/Test"
        statusVariant="neutral"
        icon={TrendingUp}
        subtext="Excludes placed orders"
      />

      {/* 4. Order Backlog (Pending Delivery) */}
      <KpiCard
        title="Order Backlog"
        value={formatCurrency(kpis.orderBacklogValue, true)}
        subtitle={`${kpis.orderBacklogCount} orders pending delivery`}
        statusText={kpis.orderBacklogCount > 25 ? 'High Backlog' : 'Active'}
        statusVariant={kpis.orderBacklogCount > 25 ? 'warning' : 'neutral'}
        icon={Clock}
        subtext="Booking amount received"
      />

      {/* 5. Overall Win Rate */}
      <KpiCard
        title="Lead-to-Delivery Rate"
        value={formatPercent(kpis.overallConversionRate)}
        subtitle={`${kpis.deliveredUnits} won / ${kpis.totalLeadsCreated} created`}
        statusText={kpis.overallConversionRate >= 35 ? 'Healthy' : 'Below Target'}
        statusVariant={kpis.overallConversionRate >= 35 ? 'healthy' : 'warning'}
        icon={CheckCircle2}
        subtext="Across selected period"
      />

      {/* 6. Turnaround & Fulfillment */}
      <KpiCard
        title="Delivery Turnaround"
        value={`${kpis.avgDeliveryDays.toFixed(1)}d`}
        subtitle={`${formatPercent(kpis.deliveryDelayRate)} delay rate`}
        statusText={kpis.deliveryDelayRate > 45 ? 'Fulfillment Delay' : 'On Schedule'}
        statusVariant={kpis.deliveryDelayRate > 45 ? 'warning' : 'healthy'}
        icon={Truck}
        subtext="From order to delivery"
      />
    </div>
  );
};

