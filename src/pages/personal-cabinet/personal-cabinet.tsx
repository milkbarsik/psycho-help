import { useEffect, useState } from 'react';
import PersonalData from './components/personal-data/PersonalData';
import { FC } from 'react';
import styles from './personal-cabinet.module.css';
import ACalendar from './components/calendar/calendar';
import AppointmentForm from './components/input-block/AppointmentForm';
import { therapist } from '@/api/types';
import ServiceApi from '@/api/service-api';
import { useFetch } from '@/api/useFetch';
import { useAuth } from '@/api/auth/useAuth';
import { appointments } from './constants';
import { useAppointment } from './storeOfAppointment/appointment';
import AppointmentDto from './helpers/AppointmentDto';
import Loader from '@/components/UI/loader/loader';

const PersonalCabinet: FC = () => {

  const authUser = useAuth(state => state.user);
	const appointment = useAppointment(state => state.appointment);

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
          <ACalendar/>
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
						<PersonalData user={authUser} appointments={appointments}/> 
					:
        		<p>{error.message}</p>
        }
      </aside>
    </div>
  );
};

export default PersonalCabinet;
