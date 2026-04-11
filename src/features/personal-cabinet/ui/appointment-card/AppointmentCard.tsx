import type { FC } from 'react';
import {
  UserOutlined,
  EnvironmentOutlined,
  LikeOutlined,
  DislikeOutlined,
} from '@ant-design/icons';
import clsx from 'clsx';
import type { AppointmentStatus } from '@/entities/appointment/types';
import styles from './appointment-card.module.scss';

interface AppointmentCardProps {
  date: string;
  doctorName: string;
  address: string;
  type: 'upcoming' | 'past';
  status?: AppointmentStatus | string;
  rating?: 'good' | 'bad' | null;
}

const getStatusConfig = (status?: string) => {
  switch (status) {
    case 'Approved':
    case 'Accepted':
      return { text: 'Подтверждено', dotClass: styles.dotSuccess };
    case 'Cancelled':
      return { text: 'Отменено', dotClass: styles.dotDanger };
    case 'Done':
      return { text: 'Завершено', dotClass: styles.dotNeutral };
    default:
      return { text: 'Ожидает', dotClass: styles.dotWarning };
  }
};

const AppointmentCard: FC<AppointmentCardProps> = ({
  date,
  doctorName,
  address,
  type,
  status,
  rating,
}) => {
  const statusConfig = getStatusConfig(status);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.date}>{date}</div>

        {type === 'past' && rating === 'good' && <LikeOutlined className={styles.iconSuccess} />}
        {type === 'past' && rating === 'bad' && <DislikeOutlined className={styles.iconDanger} />}
      </div>

      <div className={styles.infoList}>
        <div className={styles.infoItem}>
          <UserOutlined className={styles.icon} />
          <span>{doctorName}</span>
        </div>
        <div className={styles.infoItem}>
          <EnvironmentOutlined className={styles.icon} />
          <span>{address}</span>
        </div>
      </div>

      <div className={styles.footer}>
        {type === 'upcoming' && (
          <div className={styles.status}>
            <span className={clsx(styles.statusDot, statusConfig.dotClass)}></span>
            {statusConfig.text}
          </div>
        )}

        {type === 'past' && !rating && <button className={styles.rateButton}>Оценить</button>}

        {type === 'past' && rating && (
          <button className={styles.commentLink}>Посмотреть комментарий</button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
