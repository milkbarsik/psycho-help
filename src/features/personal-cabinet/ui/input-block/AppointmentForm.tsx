import type { FC } from 'react';
import styles from './AppointmentForm.module.css';
import { useAppointment } from '@/features/personal-cabinet/model/appointment';
import { getDayNameOfWeek } from '@/shared/lib/dateFunctions';
import type { Therapist } from '@/entities/therapist/types';
import altPhoto from '@/shared/assets/images/altPhotos/User_Accounts_alt.png';
import clsx from 'clsx';
import { Img } from '@/shared/ui';
import { useState, useMemo, useEffect } from 'react';
import arrow from '@/shared/assets/images/appointments/arrow.svg';
import backArrow from '@/shared/assets/images/appointments/backArrow.svg';

interface Props {
  doctors: Therapist[];
}

const AppointmentForm: FC<Props> = ({ doctors }) => {
  const appointment = useAppointment((state) => state.appointment);
  const setAppointment = useAppointment((state) => state.setAppointment);
  
  // 🎯 State для навигации по галерее
  const [currentTherapistIndex, setCurrentTherapistIndex] = useState(0);
  // 🎯 State для выбранных офисов (чекбоксы)
  const [selectedOffices, setSelectedOffices] = useState<Set<string>>(new Set());
  const [window, setWindow] = useState<'form' | 'results'>('form');

  // 🔍 Фильтрация врачей по выбранным офисам
  const filteredDoctors = useMemo(() => {
    if (selectedOffices.size === 0) return doctors;
    return doctors.filter(doctor => selectedOffices.has(doctor.office));
  }, [doctors, selectedOffices]);

  // 🔄 Сброс индекса галереи при изменении отфильтрованного списка
  useEffect(() => {
    if (currentTherapistIndex >= filteredDoctors.length) {
      setCurrentTherapistIndex(0);
    }
  }, [filteredDoctors.length, currentTherapistIndex]);

  // 🔄 Сброс чекбоксов при переключении на Online
  useEffect(() => {
    if (appointment.type === 'Online') {
      setSelectedOffices(new Set());
    }
  }, [appointment.type]);

  const handleLocation = (id?: string) => {
    if (!id) return;
    const currentDoctor = doctors.find((doctor) => doctor.id === id);
    if (currentDoctor) {
      setAppointment({ venue: currentDoctor.office });
    }
  };

  // 🎯 Переключение на следующего специалиста (циклически)
  const handleNextTherapist = () => {
    if (filteredDoctors.length === 0) return;
    setCurrentTherapistIndex((prev) => (prev + 1) % filteredDoctors.length);
  };

  // 🎯 Обработчик чекбокса офиса
  const handleOfficeToggle = (office: string) => {
    setSelectedOffices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(office)) {
        newSet.delete(office);
      } else {
        newSet.add(office);
      }
      return newSet;
    });
    setCurrentTherapistIndex(0); // Сброс к первому элементу при изменении фильтра
  };

  // 🎯 Текущий отображаемый специалист
  const currentTherapist = filteredDoctors[currentTherapistIndex];

  // 🎯 Уникальные офисы для чекбоксов
  const uniqueOffices = useMemo(() => 
    Array.from(new Set(doctors.map(d => d.office))), 
    [doctors]
  );

  const handleNextButton = () => {
    setWindow('results');
    setAppointment({...appointment, therapist_id: currentTherapist.id, venue: currentTherapist.office})
  }

  return (
    <>
      {window === 'form' ? (
        // 🔹 Ветка "форма" — всё содержимое в скобках ()
        <div className={styles.form}>
          <div className={styles.format}>
            <h3 className={styles.label}>Выберите формат консультации</h3>
            <div className={styles.format__btns}>
              <button
                type="button"
                className={`${styles.formatButton} ${appointment.type === 'Online' ? styles.active : ''}`}
                onClick={() => {
                  setAppointment({ type: 'Online', venue: '' });
                  setSelectedOffices(new Set());
                }}
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
  
          {/* Запрос */}
          <div className={styles.field}>
            <label className={styles.label}>Ваш запрос</label>
            <textarea
              value={appointment.reason}
              onChange={(e) => setAppointment({ reason: e.target.value })}
              className={styles.textarea}
              placeholder="Ваш запрос"
            />
          </div>
          
          {/* Фильтр по офисам (только для Offline) */}
          {appointment.type === 'Offline' && (
            <div className={styles.location}>
              <p className={styles.label}>Выберите место консультации</p>
              <div className={styles.location__btns}>
                {uniqueOffices.map(office => (
                  <div key={office} className={styles.location__element}>
                    <input 
                      type="checkbox" 
                      id={`office-${office}`}
                      checked={selectedOffices.has(office)}
                      onChange={() => handleOfficeToggle(office)}
                    />
                    <label 
                      htmlFor={`office-${office}`} 
                      className={styles.location__text}
                    >
                      {office}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
  
          {/* Галерея специалистов */}
          <div className={styles.therapist}>
            <p className={styles.label}>Выберите специалиста</p>
            
            {filteredDoctors.length > 0 && currentTherapist ? (
              <div className={styles.galleryWrapper}>
                <div className={styles.mainInfo}>
                  <div className={styles.imgWrapper}>
                    <Img
                      className={styles.photo} 
                      photo={`${import.meta.env.VITE_REACT_APP_IMAGE_URL}${currentTherapist.photo}`} 
                      altPhoto={altPhoto}
                    />
                  </div>
                  <div className={styles.info}>
                    <div className={styles.infoBlock}>
                      <p className={styles.name}>
                        {[currentTherapist.last_name, currentTherapist.first_name, currentTherapist.middle_name]
                          .filter(Boolean)
                          .join(' ')}
                      </p>
                      <p className={styles.qual}>{currentTherapist.qualification}</p>
                      <p className={styles.exp}>Опыт {currentTherapist.experience}</p>
                    </div>
                    
                    <div className={styles.infoBlock}>
                      <p className={styles.qual}>Принимает лично и онлайн</p>
                      <p className={styles.office}>{currentTherapist.office}</p>
                    </div>
                    
                    <div>
                      <p className={styles.qual}>С чем поможет</p>
                      <div className={styles.consultAreas}>
                        {currentTherapist.consult_areas?.split(', ').map(item => (
                          <span key={item} className={styles.consultArea}>{item}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Кнопка навигации */}
                {filteredDoctors.length > 1 && (
                  <button 
                    type="button" 
                    className={styles.galleryNextBtn}
                    onClick={handleNextTherapist}
                    aria-label="Следующий специалист"
                    title="Показать следующего специалиста"
                  >
                    <img src={arrow} alt="arrow" />
                  </button>
                )}
              </div>
            ) : (
              <p className={styles.empty}>
                {appointment.type === 'Offline' 
                  ? 'По выбранным фильтрам специалисты не найдены' 
                  : 'Список специалистов загружается...'}
              </p>
            )}
          </div>
  
          {/* Кнопка "Далее" переключает на results */}
          <button 
            className={styles.subButton} 
            type="button"
            onClick={handleNextButton}
          >
            Далее
          </button>
        </div>
      ) : (
        // 🔹 Ветка "результаты" — тоже в скобках ()
        <div className={styles.results}>
          <button 
            className={styles.backButton}
            type="button"
            onClick={() => {
              setWindow('form');
            }}
          >
            <div className={styles.backArrow}>
              <img src={backArrow} alt="backArrow" />
              <p className={styles.backArrow__text}>Назад</p>
            </div>
          </button>
          <div className={styles.results__info}>
            <h3 className={styles.results__title}>Запись</h3>
            <p className={styles.results__text}><span className={[styles.results__text, styles.results__textGray].join(" ")}>Психолог: </span>{[currentTherapist.last_name, currentTherapist.first_name, currentTherapist.middle_name].join(' ')}</p>
            <p className={styles.results__text}><span className={[styles.results__text, styles.results__textGray].join(" ")}>Место: </span>{appointment.venue}</p>
            <p className={[styles.results__text, styles.results__textGray].join(" ")}>Тема встречи:</p>
            <textarea
              value={appointment.reason}
              onChange={(e) => setAppointment({...appointment, reason: e.target.value })}
              className={[styles.textarea, styles.results__textarea].join(' ')}
              placeholder="Ваш запрос"
            />
            <button className={styles.submitBtn}>Записаться</button>
          </div>
          
        </div>
      )}
    </>
  );
};

export default AppointmentForm;