import { create } from 'zustand';
import type { ApplicationCreateRequest } from '@/entities/application/types';

interface IApplication {
  application: Partial<ApplicationCreateRequest>;
  setApplication: (patch: Partial<ApplicationCreateRequest>) => void;
  resetApplication: () => void;
}

const defaultState: Partial<ApplicationCreateRequest> = {
  problem_description: '',
  university_status: 'студент',
};

export const useApplication = create<IApplication>((set) => ({
  application: { ...defaultState },
  setApplication: (patch) =>
    set((state) => ({
      application: {
        ...state.application,
        ...patch,
      },
    })),
  resetApplication: () => set({ application: { ...defaultState } }),
}));
