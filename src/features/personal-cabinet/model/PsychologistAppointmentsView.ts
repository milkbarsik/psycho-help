import { create } from 'zustand';
import type { ApplicationStatus } from '@/entities/application/types';
import type { AppointmentStatus } from '@/entities/appointment/types';

export type SortDirection = 'asc' | 'desc';
export type SortField = 'name' | 'date';
export type AppStatusFilter = 'all' | ApplicationStatus | 'closed';
export type AptStatusFilter = 'all' | AppointmentStatus;
export type ActiveTab = 'applications' | 'appointments';

interface TabFilters<TStatus> {
  currentPage: number;
  sortDirection: SortDirection;
  sortField: SortField;
  statusFilter: TStatus;
  searchQuery: string;
  dateRange: [string, string] | null;
}

interface ApplicationsViewState {
  activeTab: ActiveTab;
  appFilters: TabFilters<AppStatusFilter>;
  aptFilters: TabFilters<AptStatusFilter>;
  setActiveTab: (tab: ActiveTab) => void;
  setCurrentPage: (page: number) => void;
  setSortDirection: (dir: SortDirection) => void;
  setSortField: (field: SortField) => void;
  setStatusFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  setDateRange: (range: [string, string] | null) => void;
  resetFilters: () => void;
}

const defaultAppFilters: TabFilters<AppStatusFilter> = {
  currentPage: 1,
  sortDirection: 'desc',
  sortField: 'date',
  statusFilter: 'all',
  searchQuery: '',
  dateRange: null,
};

const defaultAptFilters: TabFilters<AptStatusFilter> = {
  currentPage: 1,
  sortDirection: 'desc',
  sortField: 'date',
  statusFilter: 'all',
  searchQuery: '',
  dateRange: null,
};

const filtersKey = (tab: ActiveTab): 'appFilters' | 'aptFilters' =>
  tab === 'applications' ? 'appFilters' : 'aptFilters';

export const useApplicationsView = create<ApplicationsViewState>((set, get) => ({
  activeTab: 'applications',
  appFilters: { ...defaultAppFilters },
  aptFilters: { ...defaultAptFilters },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setCurrentPage: (page) => {
    const key = filtersKey(get().activeTab);
    set({ [key]: { ...get()[key], currentPage: page } });
  },

  setSortDirection: (dir) => {
    const key = filtersKey(get().activeTab);
    set({ [key]: { ...get()[key], sortDirection: dir, currentPage: 1 } });
  },

  setSortField: (field) => {
    const key = filtersKey(get().activeTab);
    set({ [key]: { ...get()[key], sortField: field, currentPage: 1 } });
  },

  setStatusFilter: (filter) => {
    const key = filtersKey(get().activeTab);
    set({ [key]: { ...get()[key], statusFilter: filter, currentPage: 1 } });
  },

  setSearchQuery: (query) => {
    const key = filtersKey(get().activeTab);
    set({ [key]: { ...get()[key], searchQuery: query, currentPage: 1 } });
  },

  setDateRange: (range) => {
    const key = filtersKey(get().activeTab);
    set({ [key]: { ...get()[key], dateRange: range, currentPage: 1 } });
  },

  resetFilters: () => {
    const tab = get().activeTab;
    if (tab === 'applications') {
      set({ appFilters: { ...defaultAppFilters } });
    } else {
      set({ aptFilters: { ...defaultAptFilters } });
    }
  },
}));
