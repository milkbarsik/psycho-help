import { FC } from 'react';
import ClockImage from '../../../../assets/images/main/chart/clock.svg';
import lineVector from '../../../../assets/images/main/chart/line.svg';
import styles from './schedule-block.module.css';
import { TextBlockProps } from '@/api/types';

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

const ItemsBlock: FC<TextBlockProps> = ({ title, info }) => (
  <div className={styles.textBlock}>
    <ul className={styles.textList}>
      <li>{title}</li>
      <li>
        <span className={styles.listBold}>{info}</span>
      </li>
    </ul>
  </div>
);

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
            <span className={styles.boldSpan}>Обед:</span> 13:00 - 13:45
          </p>
        </div>
      </div>
      <div className={styles.spaceBetween}>
        <img src={lineVector} alt="line" />
        <img src={ClockImage} alt="clock" />
        <img src={lineVector} alt="line" />
      </div>
      <h3>
        <span>
          В выходные и праздничные дни, ночью, за срочной психологической помощью можно обратиться
          по следующим телефонам:
        </span>
      </h3>
      {items.map((block, index) => (
        <ItemsBlock key={index} title={block.title} info={block.info} />
      ))}
    </div>
  );
};

export default ChartBlock;
