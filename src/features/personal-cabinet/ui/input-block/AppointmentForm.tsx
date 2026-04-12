import type { FC } from 'react';
import styles from './AppointmentForm.module.css';
import { useApplication } from '@/features/personal-cabinet/model/application';
import type { Therapist } from '@/entities/therapist/types';
import { useMemo, useState, useEffect } from 'react';
import clsx from 'clsx';
import backArrow from '@/shared/assets/images/appointments/backArrow.svg';
import { useAuth } from '@/features/auth/api/useAuth';
import type { ApplicationCreateRequest, UniversityStatus } from '@/entities/application/types';
import { createApplication } from '@/entities/application/api';
import { message } from 'antd';

interface Props {
  doctors: Therapist[];
}

const AppointmentForm: FC<Props> = ({ doctors }) => {
  const user = useAuth((s) => s.user);

  const application = useApplication((state) => state.application);
  const setApplication = useApplication((state) => state.setApplication);

  const [window, setWindow] = useState<'form' | 'results'>('form');
  const [meetingType, setMeetingType] = useState<'online' | 'offline' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🎯 Уникальные офисы — берём из всех психологов, удаляем дубликаты через Set
  const uniqueOffices = useMemo(
    () => Array.from(new Set(doctors.map((d) => d.office).filter(Boolean))),
    [doctors],
  );

  // 🔄 Сброс места консультации при переключении на Online
  useEffect(() => {
    if (meetingType === 'online') {
      setApplication({ preferred_campus: undefined });
    }
  }, [meetingType, setApplication]);

  const handleSubmit = async () => {
    if (!user) {
      message.error('Вы должны быть авторизованы');
      return;
    }

    const description = application.problem_description?.trim();
    if (!description || description.length < 10) {
      message.error('Опишите проблему подробнее (минимум 10 символов)');
      return;
    }

    if (!application.university_status) {
      message.error('Укажите статус в университете');
      return;
    }

    if (meetingType === 'offline' && !application.preferred_campus) {
      message.error('Выберите место консультации');
      return;
    }

    setIsSubmitting(true);

    const requestData: ApplicationCreateRequest = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone_number,
      problem_description: description,
      preferred_campus: application.preferred_campus,
      university_status: application.university_status as UniversityStatus,
    };

    try {
      await createApplication(requestData);
      message.success('Заявка успешно отправлена');
      useApplication.getState().resetApplication();
      setWindow('form');
      setMeetingType(null);
    } catch {
      message.error('Не удалось отправить заявку, попробуйте позже');
    } finally {
      setIsSubmitting(false);
    }
  };

  const userName = user
    ? `${user.last_name} ${user.first_name}${user.middle_name ? ` ${user.middle_name}` : ''}`
    : '';
  const userPhone = user?.phone_number || '';
  const userEmail = user?.email || '';

  return (
    <>
      {window === 'form' ? (
        <div className={styles.form}>
          {/* Данные заявителя */}
          <div className={styles.userInfo}>
            <h3 className={styles.label}>Данные заявителя</h3>
            <div className={styles.userInfo__fields}>
              <div className={styles.userInfo__field}>
                <label className={styles.fieldLabel}>ФИО</label>
                <input
                  type="text"
                  value={userName}
                  readOnly
                  className={styles.readonlyInput}
                  aria-label="ФИО пользователя"
                />
              </div>
              <div className={styles.userInfo__field}>
                <label className={styles.fieldLabel}>Телефон</label>
                <input
                  type="tel"
                  value={userPhone}
                  readOnly
                  className={styles.readonlyInput}
                  aria-label="Телефон пользователя"
                />
              </div>
              <div className={styles.userInfo__field}>
                <label className={styles.fieldLabel}>Email</label>
                <input
                  type="email"
                  value={userEmail}
                  readOnly
                  className={styles.readonlyInput}
                  aria-label="Email пользователя"
                />
              </div>
              <div className={styles.userInfo__field}>
                <label className={styles.fieldLabel}>Статус в университете</label>
                <select
                  value={application.university_status || 'студент'}
                  onChange={(e) =>
                    setApplication({ university_status: e.target.value as UniversityStatus })
                  }
                  className={styles.selectInput}
                  aria-label="Статус в университете"
                >
                  <option value="студент">Студент</option>
                  <option value="аспирант">Аспирант</option>
                  <option value="преподаватель">Преподаватель</option>
                  <option value="сотрудник">Сотрудник</option>
                </select>
              </div>
            </div>
          </div>

          {/* Формат встречи */}
          <div className={styles.format}>
            <h3 className={styles.label}>Выберите формат консультации</h3>
            <div className={styles.format__btns}>
              <button
                type="button"
                className={clsx(styles.formatButton, {
                  [styles.active]: meetingType === 'online',
                })}
                onClick={() => {
                  setMeetingType('online');
                  setApplication({ preferred_campus: undefined });
                }}
                aria-label="Кнопка выбора онлайн"
              >
                Онлайн
              </button>
              <button
                type="button"
                className={clsx(styles.formatButton, {
                  [styles.active]: meetingType === 'offline',
                })}
                onClick={() => setMeetingType('offline')}
                aria-label="Кнопка выбора очно"
              >
                Очно
              </button>
            </div>
          </div>

          {/* Место консультации (только для Offline) */}
          {meetingType === 'offline' && (
            <div className={styles.location}>
              <label className={styles.label}>Место консультации</label>
              <select
                value={application.preferred_campus || ''}
                onChange={(e) => setApplication({ preferred_campus: e.target.value })}
                className={styles.locationSelect}
                aria-label="Место консультации"
              >
                <option value="" disabled>
                  Выберите место
                </option>
                {uniqueOffices.map((office) => (
                  <option key={office} value={office}>
                    {office}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Запрос */}
          <div className={styles.field}>
            <label className={styles.label}>Ваш запрос</label>
            <textarea
              value={application.problem_description}
              onChange={(e) => setApplication({ problem_description: e.target.value })}
              className={styles.textarea}
              placeholder="Опишите вашу проблему"
            />
          </div>

          <button
            className={styles.subButton}
            type="button"
            onClick={() => setWindow('results')}
          >
            Далее
          </button>
        </div>
      ) : (
        <div className={styles.results}>
          <button
            className={styles.backButton}
            type="button"
            onClick={() => setWindow('form')}
          >
            <div className={styles.backArrow}>
              <img src={backArrow} alt="backArrow" />
              <p className={styles.backArrow__text}>Назад</p>
            </div>
          </button>
          <div className={styles.results__info}>
            <h3 className={styles.results__title}>Заявка</h3>

            <p className={styles.results__text}>
              <span className={clsx(styles.results__text, styles.results__textGray)}>ФИО: </span>
              {userName}
            </p>
            <p className={styles.results__text}>
              <span className={clsx(styles.results__text, styles.results__textGray)}>
                Телефон:{' '}
              </span>
              {userPhone}
            </p>
            <p className={styles.results__text}>
              <span className={clsx(styles.results__text, styles.results__textGray)}>Email: </span>
              {userEmail}
            </p>
            <p className={styles.results__text}>
              <span className={clsx(styles.results__text, styles.results__textGray)}>
                Формат:{' '}
              </span>
              {meetingType === 'online' ? 'Онлайн' : 'Очно'}
            </p>
            {meetingType === 'offline' && application.preferred_campus && (
              <p className={styles.results__text}>
                <span className={clsx(styles.results__text, styles.results__textGray)}>
                  Место:{' '}
                </span>
                {application.preferred_campus}
              </p>
            )}
            <p className={styles.results__text}>
              <span className={clsx(styles.results__text, styles.results__textGray)}>
                Статус:{' '}
              </span>
              {application.university_status || 'студент'}
            </p>
            <p className={clsx(styles.results__text, styles.results__textGray)}>Описание:</p>
            <textarea
              value={application.problem_description}
              readOnly
              className={clsx(styles.textarea, styles.results__textarea)}
              placeholder="Ваш запрос"
            />
            <button
              className={styles.submitBtn}
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentForm;
