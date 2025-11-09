import type { FC } from 'react';
import styles from './schedule-block.module.css';
import type { TextBlockProps } from '@/shared/api/types';
import scheduleImage from '@/shared/assets/images/time.svg';

const items: TextBlockProps[] = [
  {
    info:'Понедельник - Четверг',
    title: '9:30 – 18:30 ',
  },
  {
    info:'Пятница',
    title: '9:30 – 17:15 ',
  },
  {
    info:'Обед',
    title: '13:00 – 13:45',
  },
 
  
];
 
const ChartBlock: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.schedule}>
        {items.map((block)=>(
          <div className={styles.timeWrapper}>
              <h3 className={styles.day}>{block.info}</h3>
              <p className={styles.time}>{block.title}</p>
          </div>
        ))}
      </div>
      <img src={scheduleImage} alt="schedule" className={styles.image} />
    </div>
  );
};

export default ChartBlock;
