export type TabId = 'main' | 'book' | 'profile' | 'appointments' | 'clients' | 'admin';

export interface TabConfig {
  id: TabId;
  label: string;
}

export const roleBasedTabs: Record<string, TabConfig[]> = {
  user: [
    { id: 'main', label: 'Главная' },
    { id: 'appointments', label: 'Запись на сессию' },
    { id: 'profile', label: 'Профиль' },
  ],
  psychologist: [
    { id: 'main', label: 'Главная' },
    { id: 'appointments', label: 'Записи' },
    { id: 'profile', label: 'Профиль' },
  ],
  admin: [
    { id: 'main', label: 'Главная' },
    { id: 'appointments', label: 'Записи' },
    { id: 'admin', label: 'Администрирование' },
    { id: 'profile', label: 'Профиль' },
  ],
  content_manager: [
    { id: 'main', label: 'Главная' },
    { id: 'profile', label: 'Профиль' },
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
