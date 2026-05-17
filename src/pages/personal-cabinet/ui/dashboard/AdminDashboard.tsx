import type { FC } from 'react';
import styles from './AdminDashboard.module.scss';

const AdminDashboard: FC = () => {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>Панель администратора</h3>
      <div className={styles.placeholder}>
        <p>Обзорная панель администратора — в разработке</p>
      </div>
    </section>
  );
};

export default AdminDashboard;
