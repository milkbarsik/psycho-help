import styles from './schedule-block.module.css';

const ScheduleBlock = () => {
  return (
    <section className={styles.section}>
      <div className={styles.scheduleSection}>
        <div className={styles.scheduleInfo}>
          <div className={styles.lunchInfo}>
            <span className={styles.lunchLabel}>Обед</span>
            <span className={styles.lunchTime}>13:00 – 13:45</span>
          </div>
          <div className={styles.fridayInfo}>
            <span className={styles.fridayLabel}>Пятница</span>
            <span className={styles.fridayTime}>9:30 – 17:15</span>
          </div>
        </div>
        <div className={styles.scheduleIllustration}>
          <span className={styles.illustrationPlaceholder}>Иллюстрация предметов</span>
        </div>
      </div>
    </section>
  );
};

export default ScheduleBlock;
