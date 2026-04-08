import { useState, useMemo, useCallback, useEffect, type FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/api/useAuth';
import { Role } from '@/entities/role/helpers';
import type { RoleCode } from '@/entities/role/types';
import { appointmentQueries } from '@/entities/appointment/api';
import { useCabinetTab } from '@/features/personal-cabinet/model/personal-cabinet-tab';
import Loader from '@/shared/ui/loader/loader';
import Sidebar from '@/features/personal-cabinet/ui/sidebar/Sidebar';
import type { TabBadge } from '@/features/personal-cabinet/ui/sidebar/Sidebar';
import { getTabsForRole, getDefaultTabForRole, type TabConfig, type TabId } from './config/tabs';
import styles from './personal-cabinet.module.scss';
import clsx from 'clsx';

const PersonalCabinet: FC = () => {
  const authUser = useAuth((state) => state.user);

  const primaryRoleCode = useMemo<RoleCode>(() => {
    if (!authUser?.roles || authUser.roles.length === 0) {
      return 'user';
    }
    const roleHelper = new Role(authUser.roles);
    if (roleHelper.isAdmin()) return 'admin';
    if (roleHelper.isPsychologist()) return 'psychologist';
    if (roleHelper.isContentManager()) return 'content_manager';
    return 'user';
  }, [authUser?.roles]);

  const isPsychologist = primaryRoleCode === 'psychologist';

  const { data: appointments = [] } = useQuery({
    ...appointmentQueries.list(),
    enabled: isPsychologist,
  });

  const newAppointmentsCount = useMemo(
    () => appointments.filter((a) => a.status === 'Accepted').length,
    [appointments],
  );

  const tabBadges = useMemo<TabBadge[]>(() => {
    const badges: TabBadge[] = [];

    if (isPsychologist && newAppointmentsCount > 0) {
      badges.push({
        tabId: 'appointments',
        content: (isActive) => (
          <span className={clsx(styles.countBage, isActive && styles.countBageActive)}>
            {newAppointmentsCount}
          </span>
        ),
      });
    }

    return badges;
  }, [isPsychologist, newAppointmentsCount]);

  const tabs = useMemo(() => getTabsForRole(primaryRoleCode), [primaryRoleCode]);

  const savedTab = useCabinetTab((s) => s.activeTab);
  const setSavedTab = useCabinetTab((s) => s.setActiveTab);
  const defaultTab = getDefaultTabForRole(primaryRoleCode);
  const [activeTab, setActiveTab] = useState<string>(() => savedTab ?? defaultTab);

  useEffect(() => {
    setSavedTab(activeTab as TabId);
  }, [activeTab, setSavedTab]);

  const handleTabChange = useCallback(
    (tabId: string) => {
      const availableTabIds = tabs.map((t: TabConfig) => t.id);
      if (availableTabIds.includes(tabId as TabId)) {
        setActiveTab(tabId);
      }
    },
    [tabs],
  );

  const handleBookClick = useCallback(() => {
    handleTabChange('appointments');
  }, [handleTabChange]);

  const activeTabConfig = useMemo(() => {
    return tabs.find((t: TabConfig) => t.id === activeTab);
  }, [tabs, activeTab]);

  if (!authUser) {
    return <Loader />;
  }

  return (
    <div className={styles.layout}>
      <div className={styles.sidebarWrapper}>
        <Sidebar
          user={authUser}
          activeTab={activeTab}
          onChangeTab={handleTabChange}
          tabs={tabs}
          tabBadges={tabBadges}
        />
      </div>

      <main className={styles.mainContent}>
        {activeTabConfig?.render({
          user: authUser,
          primaryRoleCode,
          onBookClick: handleBookClick,
        })}
      </main>
    </div>
  );
};

export default PersonalCabinet;
