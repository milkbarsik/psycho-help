import type { FC } from 'react';
import styles from './AppointmentForm.module.css';
import type { Therapist } from '@/shared/api/types';
import { useAppointment } from '@/features/personal-cabinet/model/appointment';
import { getDayNameOfWeek } from '@/shared/lib/dateFunctions';

interface Props {
  doctors: Therapist[];
}

const AppointmentForm: FC<Props> = ({ doctors }) => {

  const appointment = useAppointment(state => state.appointment);
  const setAppointment = useAppointment(state => state.setAppointment);

  const handleLocation = (id: string) => {
    const currentDoctor = doctors.find((doctor) => doctor.id === id);
    if (currentDoctor) {
      setAppointment({ venue: currentDoctor.office });
    }
  }

  return (
    <div className={styles.form}>
      <h2 className={styles.date}>{getDayNameOfWeek(appointment.date)}, {appointment.date.split('-').at(-1)}</h2>

      <div className={styles.field}>
        <label className={styles.label}>Психолог</label>
        <select
          className={styles.select}
          value={appointment.therapist_id}
          onChange={(e) => {
            if (appointment.type === 'Offline') {
              setAppointment({ therapist_id: e.target.value });
              handleLocation(e.target.value);
            } else {
              setAppointment({ therapist_id: e.target.value });
            }
          }}
        >
          <option value="default" disabled>---Выберите психолога---</option>
          {doctors.map(item =>
            <option key={item.id} value={item.id}>
              {[item.last_name, item.first_name, item.middle_name].join(' ')}
            </option>
          )}
        </select>
      </div>

      <div className={styles.format}>
        <button
          type="button"
          className={`${styles.formatButton} ${appointment.type === 'Online' ? styles.active : ''}`}
          onClick={() => setAppointment({ type: 'Online', venue: '' })}
        >
          Онлайн
        </button>
        <button
          type="button"
          className={`${styles.formatButton} ${appointment.type === 'Offline' ? styles.active : ''}`}
          onClick={() => {
            setAppointment({ type: 'Offline', venue: '' });
            handleLocation(appointment.therapist_id);
          }
          }
        >
          Очно
        </button>
      </div>

      <div className={styles.row}>
        <div className={styles.column}>
          <label className={styles.label}>Локация</label>
          {
            appointment.type === 'Offline'
              ?
              <p className={styles.location}>{appointment.venue}</p>
              :
              <select
                value={appointment.venue}
                className={styles.select}
                onChange={(e) => setAppointment({ venue: e.target.value })}
              >
                <option value="" disabled>---Выберите платформу---</option>
                <option value="discord">Discord</option>
                <option value="Zoom">Zoom</option>
                <option value="Telegram">Telegram</option>
              </select>
          }
        </div>
        <div className={styles.columnSmall}>
          <label className={styles.label}>Время</label>
          <select
            value={appointment.time}
            onChange={(e) => setAppointment({ time: e.target.value })}
            className={styles.select}
          >
            <option value="10:30">10:30</option>
            <option value="11:00">11:00</option>
            <option value="11:30">11:30</option>
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Комментарий</label>
        <textarea
          value={appointment.reason}
          onChange={(e) => setAppointment({ reason: e.target.value })}
          className={styles.textarea}
        />
      </div>
    </div>
  );
};

export default AppointmentForm;
