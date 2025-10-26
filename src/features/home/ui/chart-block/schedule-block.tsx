import type { FC } from 'react';
import ClockImage from '@/shared/assets/images/main/chart/clock.svg';
import lineVector from '@/shared/assets/images/main/chart/line.svg';
import styles from './schedule-block.module.css';
import type { TextBlockProps } from '@/shared/api/types';

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
      {/* <img src="" alt="" /> */}
    </div>
  );
};

export default ChartBlock;
