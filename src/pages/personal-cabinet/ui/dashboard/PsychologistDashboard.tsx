import type { FC } from 'react';
import styles from './Dashboard.module.scss';

const PsychologistDashboard: FC = () => {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>Панель психолога</h3>
      <div className={styles.placeholder}>
        <p>Обзорная панель — в разработке</p>
      </div>
    </section>
  );
};

export default PsychologistDashboard;
