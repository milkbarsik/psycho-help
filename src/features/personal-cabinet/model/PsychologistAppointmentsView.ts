import { create } from 'zustand';
import type { ApplicationStatus } from '@/entities/application/types';
import type { AppointmentStatus } from '@/entities/appointment/types';

export type SortDirection = 'asc' | 'desc';
export type ApplicationStatusFilter = 'all' | ApplicationStatus | 'closed';
export type AppointmentStatusFilter = 'all' | AppointmentStatus;
export type FormatFilter = 'all' | 'offline' | 'online' | 'unknown';
export type ActiveTab = 'applications' | 'appointments';

interface TabFilters<TStatus> {
  currentPage: number;
  sortDirection: SortDirection;
  statusFilter: TStatus;
  formatFilter: FormatFilter;
  searchQuery: string;
  dateRange: [string, string] | null;
}

interface ApplicationsViewState {
  activeTab: ActiveTab;
  applicationFilters: TabFilters<ApplicationStatusFilter>;
  appointmentFilters: TabFilters<AppointmentStatusFilter>;
  setActiveTab: (tab: ActiveTab) => void;
  setCurrentPage: (page: number) => void;
  setSortDirection: (dir: SortDirection) => void;
  setStatusFilter: (filter: string) => void;
  setFormatFilter: (filter: FormatFilter) => void;
  setSearchQuery: (query: string) => void;
  setDateRange: (range: [string, string] | null) => void;
  resetFilters: () => void;
}

const defaultFilters = {
  currentPage: 1,
  sortDirection: 'desc' as const,
  statusFilter: 'all' as const,
  formatFilter: 'all' as const,
  searchQuery: '',
  dateRange: null,
};

const filtersKey = (tab: ActiveTab): 'applicationFilters' | 'appointmentFilters' =>
  tab === 'applications' ? 'applicationFilters' : 'appointmentFilters';

export const useApplicationsView = create<ApplicationsViewState>((set, get) => {
  const updateFilter = (patch: Record<string, unknown>) => {
    const key = filtersKey(get().activeTab);
    set({ [key]: { ...get()[key], ...patch } });
  };

  return {
    activeTab: 'applications',
    applicationFilters: { ...defaultFilters },
    appointmentFilters: { ...defaultFilters },

    setActiveTab: (tab) => set({ activeTab: tab }),
    setCurrentPage: (page) => updateFilter({ currentPage: page }),
    setSortDirection: (dir) => updateFilter({ sortDirection: dir, currentPage: 1 }),
    setStatusFilter: (filter) => updateFilter({ statusFilter: filter, currentPage: 1 }),
    setFormatFilter: (filter) => updateFilter({ formatFilter: filter, currentPage: 1 }),
    setSearchQuery: (query) => updateFilter({ searchQuery: query, currentPage: 1 }),
    setDateRange: (range) => updateFilter({ dateRange: range, currentPage: 1 }),

    resetFilters: () => {
      set({ [filtersKey(get().activeTab)]: { ...defaultFilters } });
    },
  };
});
