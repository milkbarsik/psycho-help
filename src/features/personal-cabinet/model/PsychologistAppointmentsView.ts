import { create } from 'zustand';

type Tab = 'new' | 'confirmed';
type SortField = 'date' | 'name';
type SortDirection = 'asc' | 'desc';
type VenueFilter = 'all' | 'online' | 'offline';
type StatusFilter = 'all' | 'Approved' | 'Cancelled' | 'Done';

interface DateRange {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
}

interface TabSettings {
  sortField: SortField;
  sortDirection: SortDirection;
  venueFilter: VenueFilter;
  statusFilter: StatusFilter;
  dateRange: DateRange | null;
  searchQuery: string;
}

interface AppointmentsViewState {
  activeTab: Tab;
  tabPage: Record<Tab, number>;
  tabSettings: Record<Tab, TabSettings>;
  setActiveTab: (tab: Tab) => void;
  setCurrentPage: (page: number) => void;
  setSortField: (field: SortField) => void;
  toggleSortDirection: () => void;
  setVenueFilter: (filter: VenueFilter) => void;
  setStatusFilter: (filter: StatusFilter) => void;
  setDateRange: (range: DateRange | null) => void;
  setSearchQuery: (query: string) => void;
}

const defaultSettings: TabSettings = {
  sortField: 'date',
  sortDirection: 'desc',
  venueFilter: 'all',
  statusFilter: 'all',
  dateRange: null,
  searchQuery: '',
};

const updateTab = (get: () => AppointmentsViewState, patch: Partial<TabSettings>) => {
  const { activeTab, tabSettings } = get();
  return { tabSettings: { ...tabSettings, [activeTab]: { ...tabSettings[activeTab], ...patch } } };
};

export const useAppointmentsView = create<AppointmentsViewState>((set, get) => ({
  activeTab: 'new',
  tabPage: { new: 1, confirmed: 1 },
  tabSettings: {
    new: { ...defaultSettings },
    confirmed: { ...defaultSettings },
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setCurrentPage: (page) => {
    const { activeTab, tabPage } = get();
    set({ tabPage: { ...tabPage, [activeTab]: page } });
  },
  setSortField: (field) => set(updateTab(get, { sortField: field })),
  toggleSortDirection: () => {
    const { activeTab, tabSettings } = get();
    const current = tabSettings[activeTab].sortDirection;
    set(updateTab(get, { sortDirection: current === 'asc' ? 'desc' : 'asc' }));
  },
  setVenueFilter: (filter) => set(updateTab(get, { venueFilter: filter })),
  setStatusFilter: (filter) => set(updateTab(get, { statusFilter: filter })),
  setDateRange: (range) => set(updateTab(get, { dateRange: range })),
  setSearchQuery: (query) => set(updateTab(get, { searchQuery: query })),
}));
