import styles from './greeting-block.module.css';
import GreetingImage from '../help_blue_t.png';
import Personally from '@/features/home/ui/personally.svg?react';
import Online from '@/features/home/ui/online.svg?react';

const GreetingBlock = () => {
  return (
    <div className={styles.greeting}>
      <div className={styles.greeting__content}>
        <div className={styles.greeting__block}>
          <div className={styles.greeting__text}>
            <span className={styles.greeting__title}>
              Помощь психолога для студентов и сотрудников
            </span>
            <span className={styles.greeting__subtitle}>
              Иногда справляться с трудностями в одиночку тяжело. Наши психологи помогут найти
              выход. Консультации бесплатны, конфиденциальны и доступны очно или онлайн
            </span>
          </div>
          <div className={styles.greeting__controls}>
            <div className={styles.greeting__options}>
              <button className={styles.greeting__option}>
                <Personally className={styles.greeting__option_icon} />
                <span className={styles.greeting__option_text}>лично</span>
              </button>
              <button className={styles.greeting__option}>
                <Online className={styles.greeting__option_icon} />
                <span className={styles.greeting__option_text}>онлайн</span>
              </button>
            </div>
            <button className={styles.greeting__submit}>Записаться</button>
          </div>
        </div>
        <img
          src={GreetingImage}
          alt="Иллюстрация на главной странице"
          className={styles.greeting__image}
        />
      </div>
    </div>
  );
};

export default GreetingBlock;
