import type { FC } from 'react';
import clsx from 'clsx';
import { UserOutlined } from '@ant-design/icons';
import type { User } from '@/entities/auth/types';
import styles from './sidebar.module.scss';

export interface TabConfig {
  id: string;
  label: string;
}

interface SidebarProps {
  user: User | null;
  activeTab: string;
  onChangeTab: (tab: string) => void;
  tabs: TabConfig[];
}

const Sidebar: FC<SidebarProps> = ({ user, activeTab, onChangeTab, tabs }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.profileInfo}>
        <div className={styles.avatar}>
          <UserOutlined />
        </div>
        <div className={styles.name}>
          {user
            ? `${user.last_name} ${user.first_name} ${user.middle_name || ''}`
            : 'Имя пользователя'}
        </div>
      </div>

      <nav className={styles.nav}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={clsx(styles.navItem, activeTab === tab.id && styles.active)}
            onClick={() => onChangeTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className={styles.footer}>
        <button className={styles.askButton}>Задать вопрос</button>
      </div>
    </aside>
  );
};

export default Sidebar;
