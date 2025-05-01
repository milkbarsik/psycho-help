import { FC } from 'react';
import {GetAppointment, User} from '@/api/types'
import { useFetch } from '@/api/useFetch';
import { useAuth } from '@/api/auth/useAuth';
import { useNavigate } from 'react-router-dom';
import styles from './PersonalData.module.css';
import editImg from '../../../../assets/images/cabinet/edit.svg';
import userImg from '@/assets/images/appointments/user.svg'
import venueImg from '@/assets/images/appointments/geo.svg';
import editAppointmentImg from '@/assets/images/appointments/edit.svg';
import points from '@/assets/images/appointments/3points.svg'


const PersonalData: FC<{ data: User, appointments: GetAppointment[]}> = ({ data, appointments }) => {

  const edit = () => {};
	
	const {logOut} = useAuth()
	const navigate = useNavigate()
  const sortedAppointments = appointments.sort((a, b) => a.remind_time.localeCompare(b.remind_time));
	console.log(appointments)
  const {fetching, isLoading, error} = useFetch( async () => {
		const res = await logOut()
		if (res.status == 200) {
			navigate('/')
		}
	})

  function formatDateToCustomString(isoDate: string) {
    const date = new Date(isoDate);
    
    if (isNaN(date.getTime())) {
      throw new Error("Неверный формат даты");
    }
  
    const day = date.getDate();
    const month = date.toLocaleString('ru-RU', { month: 'short' }).replace('.', '');
    const weekday = date.toLocaleString('ru-RU', { weekday: 'long' });
    const formattedDate = `${day} ${month}. ${weekday.charAt(0).toUpperCase() + weekday.slice(1)}`;
  
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
  
    return {
      date: formattedDate,
      time: formattedTime  
    };
  }
  
  // Пример использования
  const isoDate = "2025-05-02T07:59:17.799Z";
  const { date, time } = formatDateToCustomString(isoDate);
  
  console.log(date); // "2 мая. Пятница"
  console.log(time); // "07:59" (или "08:59" с учётом часового пояса UTC+1)
  

  return (
    <div className={styles.wrapper}>
      <div className={styles.head}>
        <b>
          {data.last_name} {data.first_name} {data.middle_name}
        </b>
        <div
          className={styles.edit}
          style={{ backgroundImage: `url(${editImg})` }}
          onClick={edit}
        ></div>
      </div>
      <p>{data.email}</p>
      <p>{data.phone_number}</p>
      <button className={styles.button} onClick={() => fetching()}>
        Выход
      </button>
      <ul className={styles.appointments}>
          <li className={styles.appointment__active}>
            <div className={styles.active__date}>
              <p className={styles.active__date_day}>{formatDateToCustomString(sortedAppointments[0].remind_time).date}</p>
              <p className={styles.active__date_time}>{formatDateToCustomString(sortedAppointments[0].remind_time).time}</p>
            </div>
            <div className={styles.name__wrapper}>
              <img src={userImg} className={styles.user_img} />
              <p className={styles.FIO}>Сафронова Ольга Алексеевна</p>
            </div>
            <div className={styles.venue_wrapper}>
              <div className={styles.venue__content}>
                <img src={venueImg} className={styles.venue__img} />
                <p className={styles.venue}>{sortedAppointments[0].venue}</p>
              </div>
              <button><img src={editAppointmentImg}/></button>
            </div>
          </li>
          {sortedAppointments.slice(1).map(item => 
            <li className={styles.next}>
              <div className={styles.next__content}>
                <div className={styles.next__date}>
                  <p className={styles.next__date_day}>{formatDateToCustomString(item.remind_time).date}</p>
                  <p className={styles.next__date_venue}>{item.venue}</p>
                </div>
                <div className={styles.next__time}>
                  <p className={styles.next__time_value}>{formatDateToCustomString(item.remind_time).time}</p>
                  <p className={styles.next__FIO}>Сафронова Ольга Алексеевна</p>
                </div>
              </div>
              <button><img src={points}/></button>
            </li>
          )}
        </ul>
      </div>

  );
};

export default PersonalData;
