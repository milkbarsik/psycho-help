import { useState, useMemo, useCallback } from 'react';
import type { FC } from 'react';
import { useAuth } from '@/features/auth/api/useAuth';
import { Role } from '@/entities/role/helpers';
import type { RoleCode } from '@/entities/role/types';
import Loader from '@/shared/ui/loader/loader';
import Sidebar from '@/features/personal-cabinet/ui/sidebar/Sidebar';
import { getTabsForRole, getDefaultTabForRole, type TabConfig, type TabId } from './config/tabs';
import Dashboard from './ui/dashboard/Dashboard';
import AppointmentsPage from './ui/AppointmentsPage';
import PersonalData from '@/features/personal-cabinet/ui/personal-data/PersonalData';
import styles from './personal-cabinet.module.scss';

const PersonalCabinet: FC = () => {
  const authUser = useAuth((state) => state.user);

  // Determine primary role
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

  const tabs = useMemo(() => getTabsForRole(primaryRoleCode), [primaryRoleCode]);
  const [activeTab, setActiveTab] = useState<string>(() => getDefaultTabForRole(primaryRoleCode));

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
    const appointmentsTab = tabs.find((t: TabConfig) => t.id === 'appointments');
    if (appointmentsTab) {
      handleTabChange('appointments');
    }
  }, [tabs, handleTabChange]);

  if (!authUser) {
    return <Loader />;
  }

  return (
    <div className={styles.layout}>
      <div className={styles.sidebarWrapper}>
        <Sidebar user={authUser} activeTab={activeTab} onChangeTab={handleTabChange} tabs={tabs} />
      </div>

      <main className={styles.mainContent}>
        {activeTab === 'main' && (
          <div className={styles.mainTab}>
            <Dashboard
              userName={authUser.first_name || 'Пользователь'}
              role={primaryRoleCode}
              onBookClick={handleBookClick}
            />
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className={styles.appointmentsTab}>
            <AppointmentsPage role={primaryRoleCode} />
          </div>
        )}

        {activeTab === 'clients' && (
          <div className={styles.clientsTab}>
            <p className={styles.comingSoon}>Раздел "Клиенты" в разработке</p>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className={styles.adminTab}>
            <p className={styles.comingSoon}>Раздел "Администрирование" в разработке</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className={styles.profileTab}>
            <PersonalData user={authUser} />
          </div>
        )}
      </main>
    </div>
  );
};

export default PersonalCabinet;
