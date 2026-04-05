import type { FC } from 'react';
import type { User } from '@/entities/auth/types';
import type { RoleCode } from '@/entities/role/types';
import Dashboard from '../ui/dashboard/Dashboard';
import AppointmentsPage from '../ui/AppointmentsPage';
import ComingSoon from '../ui/PlaceholderComponent';
import PersonalData from '@/features/personal-cabinet/ui/personal-data/PersonalData';

export type TabId = 'main' | 'book' | 'profile' | 'appointments' | 'clients' | 'admin';

export interface TabRenderProps {
  user: User;
  primaryRoleCode: RoleCode;
  onBookClick: () => void;
}

export interface TabConfig {
  id: TabId;
  label: string;
  render: FC<TabRenderProps>;
}

export const roleBasedTabs: Record<string, TabConfig[]> = {
  user: [
    {
      id: 'main',
      label: 'Главная',
      render: ({ user, primaryRoleCode, onBookClick }) => (
        <Dashboard
          userName={user.first_name || 'Пользователь'}
          role={primaryRoleCode}
          onBookClick={onBookClick}
        />
      ),
    },
    {
      id: 'appointments',
      label: 'Запись на сессию',
      render: ({ primaryRoleCode }) => <AppointmentsPage role={primaryRoleCode} />,
    },
    {
      id: 'profile',
      label: 'Профиль',
      render: ({ user }) => <PersonalData user={user} />,
    },
  ],
  psychologist: [
    {
      id: 'main',
      label: 'Главная',
      render: ({ user, primaryRoleCode, onBookClick }) => (
        <Dashboard
          userName={user.first_name || 'Пользователь'}
          role={primaryRoleCode}
          onBookClick={onBookClick}
        />
      ),
    },
    {
      id: 'appointments',
      label: 'Записи',
      render: ({ primaryRoleCode }) => <AppointmentsPage role={primaryRoleCode} />,
    },
    {
      id: 'profile',
      label: 'Профиль',
      render: ({ user }) => <PersonalData user={user} />,
    },
  ],
  admin: [
    {
      id: 'main',
      label: 'Главная',
      render: ({ user, primaryRoleCode, onBookClick }) => (
        <Dashboard
          userName={user.first_name || 'Пользователь'}
          role={primaryRoleCode}
          onBookClick={onBookClick}
        />
      ),
    },
    {
      id: 'appointments',
      label: 'Записи',
      render: ({ primaryRoleCode }) => <AppointmentsPage role={primaryRoleCode} />,
    },
    {
      id: 'admin',
      label: 'Администрирование',
      render: () => <ComingSoon title="Администрирование" />,
    },
    {
      id: 'profile',
      label: 'Профиль',
      render: ({ user }) => <PersonalData user={user} />,
    },
  ],
  content_manager: [
    {
      id: 'main',
      label: 'Главная',
      render: ({ user, primaryRoleCode, onBookClick }) => (
        <Dashboard
          userName={user.first_name || 'Пользователь'}
          role={primaryRoleCode}
          onBookClick={onBookClick}
        />
      ),
    },
    {
      id: 'profile',
      label: 'Профиль',
      render: ({ user }) => <PersonalData user={user} />,
    },
  ],
};

export const defaultTabForRole: Record<string, TabId> = {
  user: 'main',
  psychologist: 'main',
  admin: 'main',
  content_manager: 'main',
};

export function getTabsForRole(roleCode: string): TabConfig[] {
  return roleBasedTabs[roleCode] || roleBasedTabs.user;
}

export function getDefaultTabForRole(roleCode: string): TabId {
  return defaultTabForRole[roleCode] || 'main';
}
