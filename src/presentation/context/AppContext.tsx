/**
 * LAYER 5: PRESENTATION - APPLICATION CONTEXT
 * Provides state management, URL hash routing, repository access, and memoized ViewModels.
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getDataRepositories, DataRepositories } from '../../data-access/repositories';
import { DATE_PRESETS, DateFilterRange } from '../../infrastructure/dates';
import {
  getOverviewViewModel,
  getBranchPerformanceViewModel,
  getRepresentativePerformanceViewModel,
  getLeadDetailsViewModel,
  getActionableInsightsViewModel,
  OverviewViewModel,
  BranchPerformanceViewModel,
  RepresentativePerformanceViewModel,
  LeadDetailsViewModel,
  ActionableInsightsViewModel,
  getVehiclePerformanceViewModel,
  VehiclePerformanceViewModel,
} from '../../application';
import { calculateBranchPerformanceSummaries } from '../../domain/targets';
import { calculateRepPerformanceSummaries } from '../../domain/aging';
import { DomainBranchPerformance, DomainRepPerformance } from '../../domain/models';
import { AppNavSection } from '../layout/Sidebar';

export type AppRoute = AppNavSection;

export interface RouteParams {
  branchId?: string;
  repId?: string;
  leadId?: string;
  status?: string;
  source?: string;
  filter?: string;
}

interface AppContextType {
  repos: DataRepositories;
  dateFilter: DateFilterRange;
  setDateFilter: (filter: DateFilterRange) => void;
  funnelMode: 'cohort' | 'event';
  setFunnelMode: (mode: 'cohort' | 'event') => void;
  selectedBranchId?: string;
  setSelectedBranchId: (branchId?: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Navigation
  currentRoute: AppRoute;
  routeParams: RouteParams;
  navigateTo: (route: AppRoute, params?: RouteParams) => void;

  // Lead Inspection Modal
  inspectingLeadId: string | null;
  setInspectingLeadId: (id: string | null) => void;
  inspectingLeadViewModel: LeadDetailsViewModel | null;

  // ViewModels
  overviewViewModel: OverviewViewModel;
  branchSummaries: DomainBranchPerformance[];
  repSummaries: DomainRepPerformance[];
  insightsViewModel: ActionableInsightsViewModel;
  vehiclesViewModel: VehiclePerformanceViewModel;
  selectedBranchViewModel: BranchPerformanceViewModel | null;
  selectedRepViewModel: RepresentativePerformanceViewModel | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const repos = useMemo(() => getDataRepositories(), []);

  // Theme state (defaults to light)
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('iq_theme');
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('iq_theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {}
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [dateFilter, setDateFilter] = useState<DateFilterRange>(DATE_PRESETS[0]);
  const [funnelMode, setFunnelMode] = useState<'cohort' | 'event'>('cohort');
  const [selectedBranchId, setSelectedBranchId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingLeadId, setInspectingLeadId] = useState<string | null>(null);

  const [currentRoute, setCurrentRoute] = useState<AppRoute>('landing');
  const [routeParams, setRouteParams] = useState<RouteParams>({});

  // Parse hash
  const parseHash = () => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash || hash.startsWith('landing')) {
      setCurrentRoute('landing');
      setRouteParams({});
      return;
    }
    if (hash.startsWith('overview')) {
      setCurrentRoute('overview');
      setRouteParams({});
      return;
    }

    const [pathPart, queryPart] = hash.split('?');
    const segments = pathPart.split('/');
    const mainSection = segments[0] as AppRoute;

    const queryParams: Record<string, string> = {};
    if (queryPart) {
      new URLSearchParams(queryPart).forEach((val, key) => {
        queryParams[key] = val;
      });
    }

    if (mainSection === 'branches') {
      setCurrentRoute('branches');
      setRouteParams({
        branchId: segments[1],
        ...queryParams,
      });
    } else if (mainSection === 'representatives') {
      setCurrentRoute('representatives');
      setRouteParams({
        repId: segments[1],
        ...queryParams,
      });
    } else if (mainSection === 'leads') {
      setCurrentRoute('leads');
      setRouteParams({
        leadId: segments[1],
        ...queryParams,
      });
      if (segments[1]) {
        setInspectingLeadId(segments[1]);
      }
    } else if (mainSection === 'insights') {
      setCurrentRoute('insights');
      setRouteParams(queryParams);
    } else if (mainSection === 'vehicles') {
      setCurrentRoute('vehicles');
      setRouteParams(queryParams);
    } else {
      setCurrentRoute('overview');
      setRouteParams({});
    }
  };

  useEffect(() => {
    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  const navigateTo = (route: AppRoute, params: RouteParams = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);

    let hash = `#/${route}`;
    if (route === 'branches' && params.branchId) {
      hash += `/${params.branchId}`;
    } else if (route === 'representatives' && params.repId) {
      hash += `/${params.repId}`;
    } else if (route === 'leads' && params.leadId) {
      hash += `/${params.leadId}`;
    } else if (route === 'vehicles' && params.branchId) {
      hash += `/${params.branchId}`;
    }

    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.source) query.set('source', params.source);
    if (params.filter) query.set('filter', params.filter);

    const qStr = query.toString();
    if (qStr) {
      hash += `?${qStr}`;
    }

    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ViewModels
  const overviewViewModel = useMemo(() => {
    return getOverviewViewModel(
      repos,
      dateFilter.startDate,
      dateFilter.endDate,
      funnelMode,
      selectedBranchId
    );
  }, [repos, dateFilter.startDate, dateFilter.endDate, funnelMode, selectedBranchId]);

  const branchSummaries = useMemo(() => {
    const branches = repos.branches.getAll();
    const reps = repos.salesReps.getAll();
    const targets = repos.targets.getAll();
    const deliveries = repos.deliveries.getAll();
    const leads = repos.leads.getAll();
    return calculateBranchPerformanceSummaries(
      branches,
      reps,
      targets,
      deliveries,
      leads,
      dateFilter.startDate,
      dateFilter.endDate
    );
  }, [repos, dateFilter.startDate, dateFilter.endDate]);

  const repSummaries = useMemo(() => {
    const reps = repos.salesReps.getAll();
    const branches = repos.branches.getAll();
    const leads = repos.leads.getAll();
    return calculateRepPerformanceSummaries(reps, branches, leads);
  }, [repos]);

  const insightsViewModel = useMemo(() => {
    return getActionableInsightsViewModel(
      repos,
      dateFilter.startDate,
      dateFilter.endDate,
      selectedBranchId
    );
  }, [repos, dateFilter.startDate, dateFilter.endDate, selectedBranchId]);

  const selectedBranchViewModel = useMemo(() => {
    if (!routeParams.branchId) return null;
    return getBranchPerformanceViewModel(
      repos,
      routeParams.branchId,
      dateFilter.startDate,
      dateFilter.endDate,
      funnelMode
    );
  }, [repos, routeParams.branchId, dateFilter.startDate, dateFilter.endDate, funnelMode]);

  const selectedRepViewModel = useMemo(() => {
    if (!routeParams.repId) return null;
    return getRepresentativePerformanceViewModel(repos, routeParams.repId);
  }, [repos, routeParams.repId]);

  const inspectingLeadViewModel = useMemo(() => {
    if (!inspectingLeadId) return null;
    return getLeadDetailsViewModel(repos, inspectingLeadId);
  }, [repos, inspectingLeadId]);

  const vehiclesViewModel = useMemo(() => {
    return getVehiclePerformanceViewModel(
      repos,
      selectedBranchId,
      dateFilter.startDate,
      dateFilter.endDate
    );
  }, [repos, selectedBranchId, dateFilter.startDate, dateFilter.endDate]);

  return (
    <AppContext.Provider
      value={{
        repos,
        theme,
        setTheme,
        toggleTheme,
        dateFilter,
        setDateFilter,
        funnelMode,
        setFunnelMode,
        selectedBranchId,
        setSelectedBranchId,
        searchQuery,
        setSearchQuery,
        currentRoute,
        routeParams,
        navigateTo,
        inspectingLeadId,
        setInspectingLeadId,
        inspectingLeadViewModel,
        overviewViewModel,
        branchSummaries,
        repSummaries,
        insightsViewModel,
        vehiclesViewModel,
        selectedBranchViewModel,
        selectedRepViewModel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
};
