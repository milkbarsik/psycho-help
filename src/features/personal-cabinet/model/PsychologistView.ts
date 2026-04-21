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

interface ViewState {
  applicationFilters: TabFilters<ApplicationStatusFilter>;
  appointmentFilters: TabFilters<AppointmentStatusFilter>;
  setCurrentPage: (tab: ActiveTab, page: number) => void;
  setSortDirection: (tab: ActiveTab, dir: SortDirection) => void;
  setStatusFilter: (tab: ActiveTab, filter: string) => void;
  setFormatFilter: (tab: ActiveTab, filter: FormatFilter) => void;
  setSearchQuery: (tab: ActiveTab, query: string) => void;
  setDateRange: (tab: ActiveTab, range: [string, string] | null) => void;
  resetFilters: (tab: ActiveTab) => void;
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

export const usePsychologistView = create<ViewState>((set, get) => {
  const updateFilter = (tab: ActiveTab, patch: Record<string, unknown>) => {
    const key = filtersKey(tab);
    set({ [key]: { ...get()[key], ...patch } });
  };

  return {
    applicationFilters: { ...defaultFilters },
    appointmentFilters: { ...defaultFilters },

    setCurrentPage: (tab, page) => updateFilter(tab, { currentPage: page }),
    setSortDirection: (tab, dir) => updateFilter(tab, { sortDirection: dir, currentPage: 1 }),
    setStatusFilter: (tab, filter) => updateFilter(tab, { statusFilter: filter, currentPage: 1 }),
    setFormatFilter: (tab, filter) => updateFilter(tab, { formatFilter: filter, currentPage: 1 }),
    setSearchQuery: (tab, query) => updateFilter(tab, { searchQuery: query, currentPage: 1 }),
    setDateRange: (tab, range) => updateFilter(tab, { dateRange: range, currentPage: 1 }),

    resetFilters: (tab) => set({ [filtersKey(tab)]: { ...defaultFilters } }),
  };
});
