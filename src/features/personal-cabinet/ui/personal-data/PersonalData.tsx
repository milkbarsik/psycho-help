import type { FC } from 'react';
import type { User } from '@/shared/api/types';
import { useFetch } from '@/shared/api/useFetch';
import { useAuth } from '@/features/auth/api/useAuth';
import { useNavigate } from 'react-router-dom';
import styles from './PersonalData.module.css';
import editImg from '@/shared/assets/images/cabinet/edit.svg';
import userImg from '@/shared/assets/images/appointments/user.svg';
import venueImg from '@/shared/assets/images/appointments/geo.svg';
import editAppointmentImg from '@/shared/assets/images/appointments/edit.svg';
import points from '@/shared/assets/images/appointments/3points.svg';
import { formatDateToCustomString } from '@/shared/lib/dateFunctions';
import type { Appointment } from '@/entities/appointment/types';

const PersonalData: FC<{ user: User; appointments: Appointment[] }> = ({ user, appointments }) => {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const sortedAppointments = appointments.sort((a, b) =>
    a.remind_time.localeCompare(b.remind_time),
  );
  const { fetching } = useFetch(async () => {
    const res = await logOut();
    if (res.status == 200) {
      navigate('/');
    }
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.userInfo}>
        <div className={styles.head}>
          <p className={styles.userData}>
            {user.last_name} {user.first_name} {user.middle_name}
          </p>
          <div
            className={styles.edit}
            style={{ backgroundImage: `url(${editImg})` }}
            onClick={() => {
              console.log('редактирование');
            }}
          ></div>
        </div>
        <p>{user.email}</p>
        <p>{user.phone_number}</p>
        <button className={styles.exit} onClick={() => fetching()} aria-label="Кнопка выхода">
          Выход
        </button>
      </div>

      <ul className={styles.appointments}>
        <li className={styles.appointment__active}>
          <div className={styles.active__date}>
            <p className={styles.active__date_day}>
              {formatDateToCustomString(sortedAppointments[0].remind_time)}
            </p>
          </div>
          <div className={styles.name__wrapper}>
            <img src={userImg} className={styles.user_img} alt="Фотография психолога" />
            <p className={styles.FIO}>Сафронова Ольга Алексеевна</p>
          </div>
          <div className={styles.venue_wrapper}>
            <div className={styles.venue__content}>
              <img src={venueImg} className={styles.venue__img} alt="Изображение пункта" />
              <p className={styles.venue}>{sortedAppointments[0].venue}</p>
            </div>
            <button aria-label="Кнопка редактирования">
              <img src={editAppointmentImg} alt="Изображение карандаша" />
            </button>
          </div>
        </li>
        {sortedAppointments.slice(1).map((item) => (
          <li className={styles.next} key={item.id}>
            <div className={styles.next__content}>
              <div className={styles.next__date}>
                <p className={styles.next__date_day}>
                  {formatDateToCustomString(item.remind_time)}
                </p>
              </div>
              <p className={styles.next__date_venue}>{item.venue}</p>
              <div className={styles.next__time}>
                <p className={styles.next__FIO}>Сафронова Ольга Алексеевна</p>
              </div>
            </div>
            <button aria-label="Кнопка трёх точек">
              <img src={points} alt="Изображение трёх точек" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonalData;
