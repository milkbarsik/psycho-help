import { create } from 'zustand';
import dayjs from 'dayjs';
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

export const getDefaultDateRange = (): [string, string] => [
  dayjs().startOf('day').toISOString(),
  dayjs().add(1, 'month').startOf('day').toISOString(),
];

const getDefaultFilters = (): Omit<TabFilters<any>, 'statusFilter'> => ({
  currentPage: 1,
  sortDirection: 'asc' as const,
  formatFilter: 'all' as const,
  searchQuery: '',
  dateRange: getDefaultDateRange(),
});

const filtersKey = (tab: ActiveTab): 'applicationFilters' | 'appointmentFilters' =>
  tab === 'applications' ? 'applicationFilters' : 'appointmentFilters';

export const usePsychologistView = create<ViewState>((set, get) => {
  const updateFilter = (tab: ActiveTab, patch: Record<string, unknown>) => {
    const key = filtersKey(tab);
    set({ [key]: { ...get()[key], ...patch } });
  };

  return {
    applicationFilters: {
      ...getDefaultFilters(),
      statusFilter: 'all' as ApplicationStatusFilter,
    },
    appointmentFilters: {
      ...getDefaultFilters(),
      statusFilter: 'all' as AppointmentStatusFilter,
    },

    setCurrentPage: (tab, page) => updateFilter(tab, { currentPage: page }),
    setSortDirection: (tab, dir) => updateFilter(tab, { sortDirection: dir, currentPage: 1 }),
    setStatusFilter: (tab, filter) => updateFilter(tab, { statusFilter: filter, currentPage: 1 }),
    setFormatFilter: (tab, filter) => updateFilter(tab, { formatFilter: filter, currentPage: 1 }),
    setSearchQuery: (tab, query) => updateFilter(tab, { searchQuery: query, currentPage: 1 }),
    setDateRange: (tab, range) => updateFilter(tab, { dateRange: range, currentPage: 1 }),

    resetFilters: (tab) => {
      const key = filtersKey(tab);
      const defaultWithoutStatus = getDefaultFilters();
      const statusFilter =
        tab === 'applications'
          ? ('all' as ApplicationStatusFilter)
          : ('all' as AppointmentStatusFilter);
      set({
        [key]: {
          ...defaultWithoutStatus,
          statusFilter,
        },
      });
    },
  };
});
