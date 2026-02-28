import { useState, useMemo, useCallback } from 'react';
import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';

import dayjs from 'dayjs';
import { useAuth } from '@/features/auth/api/useAuth';
import { useAppointment } from '@/features/personal-cabinet/model/appointment';
import { therapistQueries } from '@/entities/therapist/api';
import { appointmentQueries } from '@/entities/appointment/api';
import AppointmentDto from '@/entities/appointment/AppointmentDto';
import type { Appointment } from '@/entities/appointment/types';

import Loader from '@/shared/ui/loader/loader';
import ACalendar from '@/features/personal-cabinet/ui/calendar/calendar';
import AppointmentForm from '@/features/personal-cabinet/ui/input-block/AppointmentForm';
import Sidebar from '@/features/personal-cabinet/ui/sidebar/Sidebar';
import GreetingCard from '@/features/personal-cabinet/ui/greeting-card/GreetingCard';
import AppointmentCard from '@/features/personal-cabinet/ui/appointment-card/AppointmentCard';

import styles from './personal-cabinet.module.scss';
import { appointmentsConsts } from './constants';
import type { Therapist } from '@/entities/therapist/types';

const PersonalCabinet: FC = () => {
  const authUser = useAuth((state) => state.user);
  const appointment = useAppointment((state) => state.appointment);

  const [activeTab, setActiveTab] = useState<'main' | 'book' | 'profile'>('main');

  const { data: doctors, isLoading: isLoadingDoctors } = useQuery(therapistQueries.list());
  const { data: serverAppointments, isLoading: isLoadingAppointments } = useQuery(
    appointmentQueries.list(),
  );

  const appointmentsData = serverAppointments || appointmentsConsts;

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

  const getTherapistName = useCallback(
    (therapistId?: string) => {
      if (!therapistId) return 'Специалист не назначен';
      if (!doctors) return 'Загрузка данных...';
      console.log('doctors', doctors);
      console.log('therapistId', therapistId);
      const doctor = doctors.find((d: Therapist) => d.id === therapistId);

      if (!doctor) return 'Неизвестный специалист';

      return `${doctor.last_name || ''} ${doctor.first_name || ''} ${doctor.middle_name || ''}`.trim();
    },
    [doctors],
  );

  const handleSendData = () => {
    const appointmentDto = new AppointmentDto(appointment, authUser?.id);
    console.log('Appointment отправляется: ', appointmentDto);
    // TODO Отправка
  };

  const isLoading = isLoadingDoctors || isLoadingAppointments;

  return (
    <div className={styles.layout}>
      {isLoading && <Loader />}

      <div className={styles.sidebarWrapper}>
        <Sidebar user={authUser} activeTab={activeTab} onChangeTab={setActiveTab} />
      </div>

      <main className={styles.mainContent}>
        {activeTab === 'main' && (
          <div className={styles.mainTab}>
            <GreetingCard
              userName={authUser?.first_name || 'Иван'}
              onBookClick={() => setActiveTab('book')}
            />

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Ближайшие мои записи</h3>
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
                    // TODO комментарии
                    // Имитация 3-х состояний для демонстрации
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
                        // TODO комментарии
                        rating={mockRating}
                      />
                    );
                  })
                ) : (
                  <p className={styles.emptyText}>Вы ещё не были на сессии у психолога</p>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'book' && (
          <div className={styles.bookTab}>
            <h1 className={styles.h1}>Запись на прием</h1>
            <div className={styles.dateInput}>
              <ACalendar appointments={appointmentsData} />
              <AppointmentForm doctors={doctors || []} />
              <button className={styles.subButton} type="button" onClick={handleSendData}>
                Записаться
              </button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h1 className={styles.h1}>Профиль</h1>
          </div>
        )}
      </main>
    </div>
  );
};

export default PersonalCabinet;
