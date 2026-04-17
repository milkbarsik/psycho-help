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

const defaultApplicationFilters: TabFilters<ApplicationStatusFilter> = {
  currentPage: 1,
  sortDirection: 'desc',
  statusFilter: 'all',
  formatFilter: 'all',
  searchQuery: '',
  dateRange: null,
};

const defaultAppointmentFilters: TabFilters<AppointmentStatusFilter> = {
  currentPage: 1,
  sortDirection: 'desc',
  statusFilter: 'all',
  formatFilter: 'all',
  searchQuery: '',
  dateRange: null,
};

const filtersKey = (tab: ActiveTab): 'applicationFilters' | 'appointmentFilters' =>
  tab === 'applications' ? 'applicationFilters' : 'appointmentFilters';

export const useApplicationsView = create<ApplicationsViewState>((set, get) => ({
  activeTab: 'applications',
  applicationFilters: { ...defaultApplicationFilters },
  appointmentFilters: { ...defaultAppointmentFilters },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setCurrentPage: (page) => {
    const key = filtersKey(get().activeTab);
    set({ [key]: { ...get()[key], currentPage: page } });
  },

  setSortDirection: (dir) => {
    const key = filtersKey(get().activeTab);
    set({ [key]: { ...get()[key], sortDirection: dir, currentPage: 1 } });
  },

  setStatusFilter: (filter) => {
    const key = filtersKey(get().activeTab);
    set({ [key]: { ...get()[key], statusFilter: filter, currentPage: 1 } });
  },

  setFormatFilter: (filter) => {
    const key = filtersKey(get().activeTab);
    set({ [key]: { ...get()[key], formatFilter: filter, currentPage: 1 } });
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
      set({ applicationFilters: { ...defaultApplicationFilters } });
    } else {
      set({ appointmentFilters: { ...defaultAppointmentFilters } });
    }
  },
}));
