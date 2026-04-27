// import { useQuery } from '@tanstack/react-query';
import type { FC } from 'react';
import type { RoleCode } from '@/entities/role/types';
// import { therapistQueries } from '@/entities/therapist/api';
// import Loader from '@/shared/ui/loader/loader';
// import AppointmentForm from '@/features/personal-cabinet/ui/input-block/AppointmentForm';
import styles from './Applications.module.scss';
import PsychologistApplications from '@/pages/personal-cabinet/ui/applications/PsychologistApplications';

interface ApplicationsPageProps {
  role: RoleCode;
}

const Applications: FC<ApplicationsPageProps> = ({ role }) => {
  // const { data: doctors, isLoading } = useQuery(therapistQueries.list());

  // if (isLoading) {
  //   return <Loader />;
  // }

  // Тут ХЗ, что писать
  if (role === 'user') {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder}>
          <p>Как ты сюда попал?</p>
        </div>
      </div>
    );
  }

  if (role === 'psychologist') {
    return <PsychologistApplications />;
  }

  // --- Admin / Content Manager: placeholder ---
  return (
    <div className={styles.container}>
      <div className={styles.placeholder}>
        <p>Управление заявками — в разработке</p>
      </div>
    </div>
  );
};

export default Applications;
