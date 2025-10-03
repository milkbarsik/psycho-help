import { useEffect, useState } from 'react';
import PersonalData from '@/features/personal-cabinet/ui/personal-data/PersonalData';
import { FC } from 'react';
import styles from './personal-cabinet.module.css';
import ACalendar from '@/features/personal-cabinet/ui/calendar/calendar';
import AppointmentForm from '@/features/personal-cabinet/ui/input-block/AppointmentForm';
import { GetAppointment, therapist } from '@/shared/api/types';
import ServiceApi from '@/shared/api/service-api';
import { useFetch } from '@/shared/api/useFetch';
import { useAuth } from '@/features/auth/api/useAuth';
import { appointmentsConsts } from './constants';
import { useAppointment } from '@/features/personal-cabinet/model/appointment';
import AppointmentDto from '@/entities/appointment/AppointmentDto';
import Loader from '@/widgets/loader/loader';

const PersonalCabinet: FC = () => {

  const authUser = useAuth(state => state.user);
  const appointment = useAppointment(state => state.appointment);

  const [doctors, setDoctors] = useState<therapist[]>([]);
  const [appointments, setAppointments] = useState<GetAppointment[]>();

  const { fetching, isLoading, error } = useFetch(async () => {
    const therapists = await ServiceApi.getTherapists();

    if (therapists.status === 200) {
      setDoctors(therapists.data);
    }

    setAppointments(appointmentsConsts.sort((a, b) => a.remind_time.localeCompare(b.remind_time)));
    // const data = await ServiceApi.getAppointments(user ? user.id : '')
    // if (data.status === 200){
    //   setAppointments(data.data);
    // }
  });

  useEffect(() => {
    fetching();
  }, []);

  function handleSendData() {
    let appointmentDto: AppointmentDto | null = new AppointmentDto(appointment, authUser?.id);

    console.log('Appointment отправляется: ', appointmentDto);
    // Отправка на сервер будет тут

    appointmentDto = null;
  }

  return (
    <div className={styles.wrapper}>
      {
        isLoading &&
        <Loader />
      }
      <main className={styles.main}>
        <h1 className={styles.h1}>Запись на прием</h1>
        <div className={styles.dateInput}>
          <ACalendar appointments={appointments} />
          <AppointmentForm
            doctors={doctors}
          />
          <button
            className={styles.subButton}
            type='button'
            onClick={() => handleSendData()}
          >
            Записаться
          </button>
        </div>
      </main>
      <aside className={styles.aside}>
        {
          (authUser && appointments)
            ?
            <PersonalData user={authUser} appointments={appointments} />
            :
            <p>{error.message}</p>
        }
      </aside>
    </div>
  );
};

export default PersonalCabinet;
