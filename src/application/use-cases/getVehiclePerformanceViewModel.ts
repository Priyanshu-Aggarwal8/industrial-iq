/**
 * LAYER 4: APPLICATION LAYER - USE CASE: GET VEHICLE PERFORMANCE VIEW MODEL
 * Orchestrates repositories and domain calculators to construct the
 * complete VehiclePerformanceViewModel consumed by the presentation layer.
 */

import { DataRepositories } from '../../data-access/repositories';
import {
  VehiclePerformanceViewModel,
  VehicleModelItemViewModel,
  VehicleModelBranchBreakdownViewModel,
} from '../view-models';
import { calculateVehicleModelPerformance } from '../../domain/vehicles';
import { formatCurrency, formatInteger, formatPercent } from '../../infrastructure/formatters';

export function getVehiclePerformanceViewModel(
  repos: DataRepositories,
  selectedBranchId?: string,
  startDate?: string,
  endDate?: string
): VehiclePerformanceViewModel {
  const leads = repos.leads.getAll();
  const deliveries = repos.deliveries.getAll();
  const branches = repos.branches.getAll();

  const fleet = calculateVehicleModelPerformance(
    leads,
    deliveries,
    branches,
    selectedBranchId,
    startDate,
    endDate
  );

  const selectedBranch = selectedBranchId
    ? branches.find(b => b.id === selectedBranchId)
    : undefined;
  const selectedBranchName = selectedBranch ? selectedBranch.name : 'All Dealerships';

  const mapModelToViewModel = (raw: typeof fleet.models[0]): VehicleModelItemViewModel => {
    const branchBreakdown: VehicleModelBranchBreakdownViewModel[] = raw.branchBreakdown.map(b => ({
      branchId: b.branchId,
      branchName: b.branchName,
      branchCity: b.branchCity,
      orders: b.orders,
      delivers: b.delivers,
      orderBacklog: b.orderBacklog,
      deliveredRevenue: b.deliveredRevenue,
      deliveredRevenueFormatted: formatCurrency(b.deliveredRevenue, true),
      totalOrderValue: b.totalOrderValue,
      totalOrderValueFormatted: formatCurrency(b.totalOrderValue, true),
      leadsCount: b.leadsCount,
    }));

    return {
      raw,
      model: raw.model,
      orders: raw.orders,
      delivers: raw.delivers,
      orderBacklog: raw.orderBacklog,
      deliveredRevenue: raw.deliveredRevenue,
      totalOrderValue: raw.totalOrderValue,
      revenueFormatted: formatCurrency(raw.deliveredRevenue, true),
      totalOrderValueFormatted: formatCurrency(raw.totalOrderValue, true),
      revenueContributionPercent: raw.revenueContributionPercent,
      revenueContributionFormatted: formatPercent(raw.revenueContributionPercent),
      volumeContributionPercent: raw.volumeContributionPercent,
      volumeContributionFormatted: formatPercent(raw.volumeContributionPercent),
      leadsCount: raw.leadsCount,
      conversionRate: raw.conversionRate,
      conversionRateFormatted: formatPercent(raw.conversionRate),
      orderConversionRate: raw.orderConversionRate,
      orderConversionRateFormatted: formatPercent(raw.orderConversionRate),
      avgDealValue: raw.avgDealValue,
      avgDealValueFormatted: formatCurrency(raw.avgDealValue, true),
      branchBreakdown,
    };
  };

  const models = fleet.models.map(mapModelToViewModel);

  const bestSellingByRevenue = fleet.bestSellingByRevenue
    ? mapModelToViewModel(fleet.bestSellingByRevenue)
    : null;

  const bestSellingByVolume = fleet.bestSellingByVolume
    ? mapModelToViewModel(fleet.bestSellingByVolume)
    : null;

  const fulfillmentRate =
    fleet.totalOrdersCount > 0
      ? (fleet.totalDeliveredUnits / fleet.totalOrdersCount) * 100
      : 0;

  return {
    fleet,
    models,
    bestSellingByRevenue,
    bestSellingByVolume,
    totalDeliveredRevenueFormatted: formatCurrency(fleet.totalDeliveredRevenue, true),
    totalOrderValueFormatted: formatCurrency(fleet.totalOrderValue, true),
    totalDeliveredUnitsFormatted: `${formatInteger(fleet.totalDeliveredUnits)} units`,
    totalOrdersCountFormatted: `${formatInteger(fleet.totalOrdersCount)} orders`,
    totalOrderBacklogFormatted: `${formatInteger(fleet.totalOrderBacklog)} pending`,
    totalLeadsCountFormatted: `${formatInteger(fleet.totalLeadsCount)} inquiries`,
    fulfillmentRateFormatted: formatPercent(fulfillmentRate),
    selectedBranchName,
  };
}
