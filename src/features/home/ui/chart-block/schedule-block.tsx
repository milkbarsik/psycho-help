import type { FC } from 'react';
import ClockImage from '@/shared/assets/images/main/chart/clock.svg';
import lineVector from '@/shared/assets/images/main/chart/line.svg';
import styles from './schedule-block.module.css';
import type { TextBlockProps } from '@/shared/api/types';

const items: TextBlockProps[] = [
  {
    title:
      'Горячая линия Московской службы психологической помощи населению - 8 (495) 051 (с городского телефона) и 051 (с мобильного телефона)',
    info: 'Режим работы: круглосуточно',
  },
  {
    title:
      'Горячая линия по оказанию психологической помощи студенческой молодежи организованной Минобрнауки России - 8 (800) 222-55-71',
    info: 'Режим работы: круглосуточно',
  },
  {
    title: 'Телефон доверия для детей, подростков и их родителей - 8 (800) 2000-122',
    info: 'Режим работы: круглосуточно',
  },
  {
    title:
      'Горячая линия центра экстренной психологической помощи МЧС России - 8 (495) 989-50-50 (бесплатно по Москве)',
    info: 'Режим работы: круглосуточно',
  },
];

const ChartBlock: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.weekdaysWrapper}>
        <ul className={styles.weekdaysList}>
          <li className={styles.weekdaysElement}>
            <p className={styles.weekdaysName}>Понедельник - Четверг</p>
            <p className={styles.weekdaysTime}>9:30 - 18:30</p>
          </li>
          <li className={styles.weekdaysElement}>
            <p className={styles.weekdaysName}>Пятница</p>
            <p className={styles.weekdaysTime}>9:30 - 17:15</p>
          </li>
        </ul>
        <div className={styles.centerSpan}>
          <p className={styles.weekdaysDinner}>
            <span className={styles.boldSpan}>Обед: </span>
            <span>13:00 - 13:45</span>
          </p>
        </div>
      </div>
      <div className={styles.spaceBetween}>
        <img src={lineVector} alt="line" />
        <img src={ClockImage} alt="clock" />
        <img src={lineVector} alt="line" />
      </div>
      <h3>
        <span className={styles.detailedInformation}>
          В выходные и праздничные дни, ночью, за срочной психологической помощью можно обратиться
          по следующим телефонам:
        </span>
      </h3>
      <div className={styles.textBlock}>
        <ul className={styles.textList}>
          {items.map((block, index) => (
            <li key={index} className={styles.detailedInformationItem}>
              <p>{block.title}</p>
              <p className={styles.detailedInformationTime}>{block.info}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChartBlock;
