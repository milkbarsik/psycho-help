import type { FC } from 'react';
import clsx from 'clsx';
import { UserOutlined } from '@ant-design/icons';
import type { User } from '@/entities/auth/types';
import styles from './sidebar.module.scss';

interface SidebarProps {
  user: User | null;
  activeTab: 'main' | 'book' | 'profile';
  onChangeTab: (tab: 'main' | 'book' | 'profile') => void;
}

const Sidebar: FC<SidebarProps> = ({ user, activeTab, onChangeTab }) => {
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
        <button
          className={clsx(styles.navItem, activeTab === 'main' && styles.active)}
          onClick={() => onChangeTab('main')}
        >
          Главная
        </button>
        <button
          className={clsx(styles.navItem, activeTab === 'book' && styles.active)}
          onClick={() => onChangeTab('book')}
        >
          Запись на сессию
        </button>
        <button
          className={clsx(styles.navItem, activeTab === 'profile' && styles.active)}
          onClick={() => onChangeTab('profile')}
        >
          Профиль
        </button>
      </nav>

      <div className={styles.footer}>
        <button className={styles.askButton}>Задать вопрос</button>
      </div>
    </aside>
  );
};

export default Sidebar;
