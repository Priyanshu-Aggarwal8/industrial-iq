import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { DateRangeFilter, Lead } from '../types';
import { DATE_PRESETS } from '../utils/dates';
import { loadAndNormalizeDataset, NormalizedDataset } from '../data/loader';

export type AppRoute = 'overview' | 'branches' | 'representatives' | 'leads' | 'insights';

interface FilterContextType {
  dataset: NormalizedDataset;
  dateFilter: DateRangeFilter;
  setDateFilter: (filter: DateRangeFilter) => void;
  selectedBranchId?: string;
  setSelectedBranchId: (branchId?: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Navigation
  currentRoute: AppRoute;
  routeParams: {
    branchId?: string;
    repId?: string;
    leadId?: string;
    statusFilter?: string;
    sourceFilter?: string;
    quickFilter?: string;
  };
  navigateTo: (route: AppRoute, params?: FilterContextType['routeParams']) => void;
  
  // Lead Inspection Drawer/Modal
  inspectingLeadId: string | null;
  setInspectingLeadId: (leadId: string | null) => void;
  inspectingLead: Lead | null;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dataset = useMemo(() => loadAndNormalizeDataset(), []);
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>(DATE_PRESETS[0]); // Default: All Time (Jun–Dec 2025)
  const [selectedBranchId, setSelectedBranchId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingLeadId, setInspectingLeadId] = useState<string | null>(null);

  // Parse URL Hash on load and when hash changes
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('overview');
  const [routeParams, setRouteParams] = useState<FilterContextType['routeParams']>({});

  const parseHash = () => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash || hash.startsWith('overview')) {
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
        statusFilter: queryParams.status,
        sourceFilter: queryParams.source,
        quickFilter: queryParams.filter,
      });
      if (segments[1]) {
        setInspectingLeadId(segments[1]);
      }
    } else if (mainSection === 'insights') {
      setCurrentRoute('insights');
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

  const navigateTo = (route: AppRoute, params: FilterContextType['routeParams'] = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);

    let hash = `#/${route}`;
    if (route === 'branches' && params.branchId) {
      hash += `/${params.branchId}`;
    } else if (route === 'representatives' && params.repId) {
      hash += `/${params.repId}`;
    } else if (route === 'leads' && params.leadId) {
      hash += `/${params.leadId}`;
    }

    const query = new URLSearchParams();
    if (params.statusFilter) query.set('status', params.statusFilter);
    if (params.sourceFilter) query.set('source', params.sourceFilter);
    if (params.quickFilter) query.set('filter', params.quickFilter);

    const qStr = query.toString();
    if (qStr) {
      hash += `?${qStr}`;
    }

    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const inspectingLead = useMemo(() => {
    if (!inspectingLeadId) return null;
    return dataset.leadsById.get(inspectingLeadId) || null;
  }, [inspectingLeadId, dataset]);

  return (
    <FilterContext.Provider
      value={{
        dataset,
        dateFilter,
        setDateFilter,
        selectedBranchId,
        setSelectedBranchId,
        searchQuery,
        setSearchQuery,
        currentRoute,
        routeParams,
        navigateTo,
        inspectingLeadId,
        setInspectingLeadId,
        inspectingLead,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

