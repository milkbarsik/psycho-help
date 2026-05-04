import { create } from 'zustand';
import type { TabId } from '@/pages/personal-cabinet/config/tabs';

interface CabinetTabState {
  activeTab: TabId | null;
  setActiveTab: (tab: TabId) => void;
}

export const useCabinetTab = create<CabinetTabState>((set) => ({
  activeTab: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
