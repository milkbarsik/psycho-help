import type { FC } from 'react';
import styles from './AppointmentForm.module.css';
import { useAppointment } from '@/features/personal-cabinet/model/appointment';
import { getDayNameOfWeek } from '@/shared/lib/dateFunctions';
import type { Therapist } from '@/entities/therapist/types';
import altPhoto from '@/shared/assets/images/altPhotos/User_Accounts_alt.png';
import clsx from 'clsx';
import { Img } from '@/shared/ui';

interface Props {
  doctors: Therapist[];
}

const AppointmentForm: FC<Props> = ({ doctors }) => {
  const appointment = useAppointment((state) => state.appointment);
  const setAppointment = useAppointment((state) => state.setAppointment);

  const handleLocation = (id?: string) => {
    if (!id) return;
    const currentDoctor = doctors.find((doctor) => doctor.id === id);
    if (currentDoctor) {
      setAppointment({ venue: currentDoctor.office });
    }
  };

  return (
    <div className={styles.form}>

      <div className={styles.format}>
        <h3 className={styles.label}>Выберите формат консультации</h3>
        <div className={styles.format__btns}>
          <button
            type="button"
            className={`${styles.formatButton} ${appointment.type === 'Online' ? styles.active : ''}`}
            onClick={() => setAppointment({ type: 'Online', venue: '' })}
            aria-label="Кнопка выбора онлайн"
          >
            Онлайн
          </button>
          <button
            type="button"
            className={clsx(styles.formatButton, {
              [styles.active]: appointment.type === 'Offline',
            })}
            onClick={() => {
              setAppointment({ type: 'Offline', venue: '' });
              handleLocation(appointment?.therapist_id);
            }}
            aria-label="Кнопка выбора очно"
          >
            Очно
          </button>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Ваш запрос</label>
        <textarea
          value={appointment.reason}
          onChange={(e) => setAppointment({ reason: e.target.value })}
          className={styles.textarea}
          placeholder='Ваш запрос'
        />
      </div>
      {appointment.type === 'Offline' && 
      <div className={styles.location}>
        <p className={styles.label}>Выберите место консультации</p>
        <div className={styles.location__btns}></div>
        {doctors.map(doctor => 
          <div className={styles.location__element}>
            <input 
            type="checkbox" 
            />
            <p className={styles.location__text}>{doctor.office}</p>
          </div>
        )}
      </div>
      }
        {/* <div className={styles.columnSmall}>
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
        </div> */}

        <div className={styles.therapist}>
          <p className={styles.label}>Выберите специалиста</p>
          <div className={styles.mainInfo}>
                <div className={styles.imgWrapper}>
                    <Img
                    className={styles.photo} 
                    photo={`${import.meta.env.VITE_REACT_APP_IMAGE_URL}` + doctors[0].photo} 
                    altPhoto={altPhoto}/>
                </div>
                <div className={styles.info}>
                    <div className={styles.infoBlock}>
                        <p className={styles.name}>{[doctors[0].last_name, doctors[0].first_name, doctors[0].last_name].join(' ')}</p>
                        <p className={styles.qual}>{doctors[0].qualification}</p>
                        <p className={styles.exp}>Опыт {doctors[0].experience}</p>
                    </div>
                    
                    <div className={styles.infoBlock}>
                        <p className={styles.qual}>Принимает лично и онлайн</p> {/*Потом будет браться из бд*/}
                        <p className={styles.office}>{doctors[0].office}</p>
                    </div>
                    <div>
                      <p className={styles.qual}>С чем поможет</p>
                      <div className={styles.consultAreas}>
                          {doctors[0].consult_areas.split(', ').map(item => 
                              <span key={item} className={styles.consultArea}>{item}</span>
                          )}
                      </div>
                    </div>
                </div>
            </div>
        </div>
        <button className={styles.subButton} type="button">
          Далее
        </button>
    </div>
  );
};

export default AppointmentForm;
