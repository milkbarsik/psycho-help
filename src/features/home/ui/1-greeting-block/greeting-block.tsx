import styles from './greeting-block.module.css';
import GreetingDesktop from '@/features/home/ui/1-greeting-block/img/greeting-desktop.png';
import GreetingTablet from '@/features/home/ui/1-greeting-block/img/greeting-tablet.png';
import GreetingMobile from '@/features/home/ui/1-greeting-block/img/greeting-mobile.png';
import AppointmentModule from '@/widgets/appointment-module';
import { useState } from 'react';

const GreetingBlock = () => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleAppointment = () => {
    console.log('Записаться на прием');
  };

  const handleSelect = (type: number) => {
    if (selectedOption === type) {
      setSelectedOption(null);
      return;
    }
    setSelectedOption(type);
  };

  return (
    <div className={styles.greeting}>
      <div className={styles.greeting__content}>
        <div className={styles.greeting__block}>
          <div className={styles.greeting__text}>
            <div className={styles.greeting__title_wrapper}>
              <span className={styles.greeting__title}>
                Помощь психолога для студентов и сотрудников
              </span>
            </div>
            <div className={styles.greeting__subtitle_wrapper}>
              <span className={styles.greeting__subtitle}>
                Иногда справляться с трудностями в одиночку бывает тяжело. Наши психологи помогут
                вам найти выход. Консультации бесплатны, конфиденциальны и доступны очно или онлайн.
              </span>
            </div>
          </div>
          <AppointmentModule 
            pageType="main" 
            redirectPath="/cabinet"
          />
        </div>
        <div className={styles.greeting__image_wrapper}>
          <picture>
            <source media="(max-width: 425px)" srcSet={GreetingMobile} />
            <source media="(max-width: 768px)" srcSet={GreetingTablet} />
            <img
              src={GreetingDesktop}
              alt="Иллюстрация на главной странице"
              className={styles.greeting__image}
            />
          </picture>
        </div>
      </div>
    </div>
  );
};

export default GreetingBlock;