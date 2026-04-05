import { useMemo } from 'react';
import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { therapistQueries } from '@/entities/therapist/api';
import { appointmentQueries } from '@/entities/appointment/api';
import type { Appointment } from '@/entities/appointment/types';
import type { Therapist } from '@/entities/therapist/types';
import GreetingCard from '@/features/personal-cabinet/ui/greeting-card/GreetingCard';
import AppointmentCard from '@/features/personal-cabinet/ui/appointment-card/AppointmentCard';
import { appointmentsConsts } from '../../constants';
import styles from './Dashboard.module.scss';

interface UserDashboardProps {
  userName: string;
  onBookClick: () => void;
}

const UserDashboard: FC<UserDashboardProps> = ({ userName, onBookClick }) => {
  const { data: doctors, isLoading: isLoadingDoctors } = useQuery(therapistQueries.list());
  const { data: serverAppointments, isLoading: isLoadingAppointments } = useQuery(
    appointmentQueries.list(),
  );

  const appointmentsData = serverAppointments?.length ? serverAppointments : appointmentsConsts;

  const { upcoming, past } = useMemo(() => {
    const now = dayjs();
    const upc: Appointment[] = [];
    const pst: Appointment[] = [];

    appointmentsData.forEach((item) => {
      const appointmentDate = dayjs(item.remind_time);
      if (appointmentDate.isValid()) {
        if (appointmentDate.isAfter(now)) {
          upc.push(item);
        } else {
          pst.push(item);
        }
      }
    });

    upc.sort((a, b) => dayjs(a.remind_time).diff(dayjs(b.remind_time)));
    pst.sort((a, b) => dayjs(b.remind_time).diff(dayjs(a.remind_time)));

    return { upcoming: upc, past: pst };
  }, [appointmentsData]);

  const getTherapistName = useMemo(
    () => (therapistId?: string) => {
      if (!therapistId) return 'Специалист не назначен';
      if (!doctors) return 'Загрузка данных...';
      const doctor = doctors.find((d: Therapist) => d.id === therapistId);
      if (!doctor) return 'Неизвестный специалист';
      return `${doctor.last_name || ''} ${doctor.first_name || ''} ${doctor.middle_name || ''}`.trim();
    },
    [doctors],
  );

  const isLoading = isLoadingDoctors || isLoadingAppointments;

  if (isLoading) {
    return null;
  }

  return (
    <>
      <GreetingCard userName={userName} onBookClick={onBookClick} />

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Ближайшие записи</h3>
        <div className={styles.cardsGrid}>
          {upcoming.length > 0 ? (
            upcoming.map((app) => (
              <AppointmentCard
                key={app.id}
                date={dayjs(app.remind_time).format('D MMMM, HH:mm')}
                doctorName={getTherapistName(app.therapist_id)}
                address={app.venue || (app.type === 'Online' ? 'Онлайн сессия' : 'Офлайн')}
                type="upcoming"
                status={app.status}
              />
            ))
          ) : (
            <p className={styles.emptyText}>Вы ещё не записаны на сессию</p>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Последние сессии</h3>
        <div className={styles.cardsGrid}>
          {past.length > 0 ? (
            past.map((app, index) => {
              let mockRating: 'good' | 'bad' | null = null;
              if (index % 3 === 1) mockRating = 'good';
              if (index % 3 === 2) mockRating = 'bad';

              return (
                <AppointmentCard
                  key={app.id}
                  date={dayjs(app.remind_time).format('D MMMM, HH:mm')}
                  doctorName={getTherapistName(app.therapist_id)}
                  address={app.venue || (app.type === 'Online' ? 'Онлайн сессия' : 'Офлайн')}
                  type="past"
                  rating={mockRating}
                />
              );
            })
          ) : (
            <p className={styles.emptyText}>Вы ещё не были на сессии у психолога</p>
          )}
        </div>
      </section>
    </>
  );
};

export default UserDashboard;
