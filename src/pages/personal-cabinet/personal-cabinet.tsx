import { useEffect, useState } from 'react';
import PersonalData from './components/personal-data/PersonalData';
import { FC } from 'react';
import styles from './personal-cabinet.module.css';
import ACalendar from './components/calendar/calendar';
import AppointmentForm from './components/input-block/AppointmentForm';
import { therapist, PostAppointment, User, GetAppointment } from '@/api/types';
import ServiceApi from '@/api/service-api';
import { useFetch } from '@/api/useFetch';
import { useAuth } from '@/api/auth/useAuth';
import { appointments } from './constants';

const PersonalCabinet: FC = () => {
  const [date, setDate] = useState<string>('');
  const { returnUser } = useAuth();
  const authUser = returnUser();
  const [user, setUser] = useState<User | null>(authUser);

  const [appointment, setAppointment] = useState<PostAppointment>({
    patient_id: user ? user.id : '',
    therapist_id: 'default',
    type: 'Online',
    reason: '',
    remind_time: '',
    venue: '',
  });

  const [doctors, setDoctors] = useState<therapist[]>([]);
  // const [appointments, setAppointments] = useState<GetAppointment[]>();

  const { fetching, isLoading, error } = useFetch(async () => {
    const therapists = await ServiceApi.getTherapists();

    if (therapists.status === 200) {
      setDoctors(therapists.data);
    }

    // const data = await ServiceApi.getAppointments(user ? user.id : '')
    // if (data.status === 200){
    //   setAppointments(data.data);
    // }
 
  });

  useEffect(() => {
    fetching();
  }, []);

  function handleSendForm(e: React.FormEvent) {
    e.preventDefault();
    console.log('Appointment отправляется:', appointment);
    // Отправка в бд будет тут
  }

  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <h1 className={styles.h1}>Запись на прием</h1>
        <form className={styles.form} onSubmit={handleSendForm}>
          <ACalendar getDate={setDate} />
          <input type="hidden" name="date" value={date} required />
          <AppointmentForm
            date={date}
            doctors={doctors}
            appointment={appointment}
            setAppointment={setAppointment}
          />
          <button className={styles.subButton} type="submit">
            Записаться
          </button>
        </form>
      </main>
      <aside className={styles.aside}>
        {(user && appointments) ? 
        <PersonalData data={user} appointments={appointments}/> 
        :
        <p>{error.message}</p>
        }
      </aside>
    </div>
  );
};

export default PersonalCabinet;
