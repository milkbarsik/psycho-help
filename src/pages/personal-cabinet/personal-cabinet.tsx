import { useState } from 'react';
import PersonalData from '@/features/personal-cabinet/ui/personal-data/PersonalData';
import type { FC } from 'react';
import styles from './personal-cabinet.module.css';
import ACalendar from '@/features/personal-cabinet/ui/calendar/calendar';
import AppointmentForm from '@/features/personal-cabinet/ui/input-block/AppointmentForm';
import { useAuth } from '@/features/auth/api/useAuth';
import { appointmentsConsts } from './constants';
import { useAppointment } from '@/features/personal-cabinet/model/appointment';
import AppointmentDto from '@/entities/appointment/AppointmentDto';
import Loader from '@/shared/ui/loader/loader';
import { useQuery } from '@tanstack/react-query';
import { therapistQueries } from '@/entities/therapist/api';
import type { Appointment } from '@/entities/appointment/types';

const MOCK_APPOINTMENTS = appointmentsConsts.sort((a, b) =>
  a.remind_time.localeCompare(b.remind_time),
);

const PersonalCabinet: FC = () => {
  const authUser = useAuth((state) => state.user);
  const appointment = useAppointment((state) => state.appointment);

  const [appointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);

  const { data: doctors, isLoading, error } = useQuery(therapistQueries.list());

  function handleSendData() {
    let appointmentDto: AppointmentDto | null = new AppointmentDto(appointment, authUser?.id);

    console.log('Appointment отправляется: ', appointmentDto);
    // Отправка на сервер будет тут

    appointmentDto = null;
  }

  return (
    <div className={styles.wrapper}>
      {isLoading && <Loader />}
      <main className={styles.main}>
        <h1 className={styles.h1}>Запись на прием</h1>
        <div className={styles.dateInput}>
          <ACalendar appointments={appointments} />
          <AppointmentForm doctors={doctors || []} />
          <button
            className={styles.subButton}
            type="button"
            onClick={handleSendData}
            aria-label="Кнопка записаться"
          >
            Записаться
          </button>
        </div>
      </main>
      <aside className={styles.aside}>
        {authUser && appointments ? (
          <PersonalData user={authUser} appointments={appointments} />
        ) : (
          <p>{error?.message}</p>
        )}
      </aside>
    </div>
  );
};

export default PersonalCabinet;
