import { useQuery } from '@tanstack/react-query';
import type { FC } from 'react';
import type { RoleCode } from '@/entities/role/types';
import { therapistQueries } from '@/entities/therapist/api';
import Loader from '@/shared/ui/loader/loader';
import AppointmentForm from '@/features/personal-cabinet/ui/input-block/AppointmentForm';
import styles from './AppointmentsPage.module.scss';

interface AppointmentsPageProps {
  role: RoleCode;
}

const AppointmentsPage: FC<AppointmentsPageProps> = ({ role }) => {
  const { data: doctors, isLoading } = useQuery(therapistQueries.list());

  if (isLoading) {
    return <Loader />;
  }

  if (role === 'user') {
    return (
      <div className={styles.container}>
        <div className={styles.dateInput}>
          {/* <ACalendar appointments={appointmentsData} /> */}
          <AppointmentForm doctors={doctors || []} />
        </div>
      </div>
    );
  }

  // --- Psychologist: placeholder ---
  if (role === 'psychologist') {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder}>
          <p>Расписание психолога — в разработке</p>
        </div>
      </div>
    );
  }

  // --- Admin / Content Manager: placeholder ---
  return (
    <div className={styles.container}>
      <div className={styles.placeholder}>
        <p>Управление записями — в разработке</p>
      </div>
    </div>
  );
};

export default AppointmentsPage;
