import React, { FC, useEffect, useState } from 'react';
import styles from './AppointmentForm.module.css';
import { therapist, PostAppointment } from '@/api/types';

interface Props {
  doctors: therapist[];
  date: string;
  appointment: PostAppointment;
  setAppointment: React.Dispatch<React.SetStateAction<PostAppointment>>;
}

const AppointmentForm: FC<Props> = ({ doctors, date, appointment, setAppointment }) => {

  function combineDateAndTime(dateStr: string, timeStr: string) {
    const [year, month, day] = dateStr.split('-');
    const [hours, minutes] = timeStr.split(':');

    const date = new Date(Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes)
    ));

    return date.toISOString();
  }

  const dateObj = new Date(date);
  const dayNumber = dateObj.getDay();
  const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const dayName = daysOfWeek[dayNumber];

  const [doctorId, setDoctorId] = useState<string>('default');
  const [location, setLocation] = useState('Психолог не выбран');
  const [selectedTime, setSelectedTime] = useState('10:30');
  const [comment, setComment] = useState('');

  function handleLocation(id: string) {
    const currentDoctor = doctors.find((doctor) => doctor.id === id);
    if (currentDoctor) {
      setLocation(currentDoctor.office);
      setAppointment(prev => ({ ...prev, venue: currentDoctor.office }));
    }
  }

  useEffect(() => {
    if (date && selectedTime) {
      const result = combineDateAndTime(date, selectedTime);
      setAppointment(prev => ({ ...prev, remind_time: result }));
    }
  }, [date, selectedTime, setAppointment]);

  return (
    <div className={styles.form}>
      <h2 className={styles.date}>{dayName}, {date.split('-').at(-1)}</h2>

      <div className={styles.field}>
        <label className={styles.label}>Психолог</label>
        <select
          className={styles.select}
          onChange={(e) => {
            const selectedId = e.target.value;
            setAppointment(prev => ({ ...prev, therapist_id: selectedId }));
            handleLocation(selectedId);
          }}
          value={appointment.therapist_id}
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
          onClick={() => setAppointment(prev => ({ ...prev, type: 'Online' }))}
          className={`${styles.formatButton} ${appointment.type === 'Online' ? styles.active : ''}`}
        >
          Онлайн
        </button>
        <button
          type="button"
          onClick={() => setAppointment(prev => ({ ...prev, type: 'Offline' }))}
          className={`${styles.formatButton} ${appointment.type === 'Offline' ? styles.active : ''}`}
        >
          Очно
        </button>
      </div>

      <div className={styles.row}>
        <div className={styles.column}>
          <label className={styles.label}>Локация</label>
          <p className={styles.location}>{location}</p>
        </div>
        <div className={styles.columnSmall}>
          <label className={styles.label}>Время</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
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
          onChange={(e) => setAppointment(prev => ({ ...prev, reason: e.target.value }))}
          className={styles.textarea}
        />
      </div>
    </div>
  );
};

export default AppointmentForm;
