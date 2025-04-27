import { useEffect, useState } from 'react';
import PersonalData from './components/personal-data/personal-data';
import { FC } from 'react';
import styles from './personal-cabinet.module.css';
import ACalendar from './components/calendar/calendar';
import AppointmentForm from './components/input-block/AppointmentForm';
import { therapist, PostAppointment, User } from '@/api/types';
import ServiceApi from '@/api/service-api';
import { useFetch } from '@/api/useFetch';
import { useAuth } from '@/api/auth/useAuth';

const PersonalCabinet: FC = () => {
<<<<<<< HEAD
  const [date, setDate] = useState<string>('');
  const [user, setUser] = useState<User>()
  const {} = useAuth()
=======
  const {returnUser} = useAuth();
  const [date, setDate] = useState<string>('');
  const [user, setUser] = useState<User| {}>(returnUser());
>>>>>>> e1e232260279bf11e4b4f0bff8af927c7790b31e
  const [appointment, setAppointment] = useState<PostAppointment>({
    patient_id: '',
    therapist_id: 'default',
    type: 'Online',
    reason: '',
    remind_time: '',
    venue: '',
  });

  const [doctors, setDoctors] = useState<therapist[]>([]);
<<<<<<< HEAD
  const {fetching, isLoading, error } = useFetch(async () => {
=======
  const { fetching, isLoading, error } = useFetch(async () => {
>>>>>>> e1e232260279bf11e4b4f0bff8af927c7790b31e
    const therapists = await ServiceApi.getTherapists();

    if (therapists.status === 200) {
      setDoctors(therapists.data);
    }
<<<<<<< HEAD

    const userData = await getUser();
    console.log(userData)
    if(userData.status === 200) {
      setUser(userData.data);
    }
=======
>>>>>>> e1e232260279bf11e4b4f0bff8af927c7790b31e
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
          <button className={styles.subButton} type="submit">Записаться</button>
        </form>
      </main>
      <aside className={styles.aside}>
        <PersonalData data={user} />
      </aside>
    </div>
  );
};

export default PersonalCabinet;
