import type { FC } from 'react';
import Index from '../doctor';
import styles from './DoctorList.module.css';
import type { Therapist } from '@/shared/api/types';

interface Props {
  doctors: Therapist[];
}

const DoctorList: FC<Props> = ({ doctors }) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Выбрать специалиста</h2>
      <div className={styles.list_wrapper}>
        {doctors.map((doctor) => (
          <Index doctor={doctor} key={doctor.id} />
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
