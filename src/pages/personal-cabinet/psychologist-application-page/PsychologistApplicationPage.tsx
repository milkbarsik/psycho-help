import { useMemo, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Select, message, Empty } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import clsx from 'clsx';
import {
  applicationQueries,
  applicationQueryKey,
  offerConsultation,
} from '@/entities/application/api';
import type { ApplicationStatus, MeetingType } from '@/entities/application/types';
import { Role } from '@/entities/role/helpers';
import { useAuth } from '@/features/auth/api/useAuth';
import Loader from '@/shared/ui/loader/loader';
import { APPLICATION_STATUS_TAG } from '@/pages/personal-cabinet/ui/appointments/PsychologistAppointmentsConstants';
import PsychologistApplicationsModal from '@/pages/personal-cabinet/ui/appointments/PsychologistApplicationsModal';
import styles from './PsychologistApplicationPage.module.scss';

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  awaiting_user_confirmation: 'Ожидает подтверждения',
  completed: 'Завершено',
  rejected: 'Отклонено',
  cancelled: 'Отменено',
  expired: 'Истекло',
};

const MEETING_TYPE_OPTIONS = [
  { value: 'online' as const, label: 'Онлайн' },
  { value: 'offline' as const, label: 'Очно' },
];

const TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

const PsychologistApplicationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuth((s) => s.user);

  const isPsychologist = useMemo(() => !!user && new Role(user.roles).isPsychologist(), [user]);

  const { data: application, isLoading } = useQuery({
    ...applicationQueries.byId(id!),
    enabled: isPsychologist && !!id,
  });

  const [userMeetingType, setUserMeetingType] = useState<MeetingType | null>(null);
  const [userDate, setUserDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [conclusion, setConclusion] = useState('');

  const meetingType = userMeetingType ?? application?.meeting_type ?? null;
  const selectedDate =
    userDate ?? (application?.scheduled_at ? dayjs(application.scheduled_at) : null);

  const selectedDateTime = useMemo(() => {
    if (!selectedDate || !selectedTime) return null;
    const [hours, minutes] = selectedTime.split(':').map(Number);
    return selectedDate.hour(hours).minute(minutes).second(0);
  }, [selectedDate, selectedTime]);

  const offerMutation = useMutation({
    mutationFn: () =>
      offerConsultation(id!, {
        psychologist_id: user!.id,
        meeting_type: meetingType!,
        scheduled_at: selectedDateTime!.toISOString(),
      }),
    onSuccess: () => {
      message.success('Консультация предложена, ожидаем подтверждения пользователя');
      queryClient.invalidateQueries({ queryKey: [applicationQueryKey.list] });
      queryClient.invalidateQueries({ queryKey: [applicationQueryKey.byId, id] });
      navigate(-1);
    },
    onError: () => {
      message.error('Не удалось сохранить изменения');
    },
  });

  if (!isPsychologist) return <Navigate to="/" replace />;
  if (isLoading) return <Loader />;
  if (!application) return <Empty description="Заявка не найдена" />;

  const isInProgress = application.status === 'in_progress';
  const canSave = isInProgress && meetingType && selectedDateTime;

  const disabledDates = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  const statusUI = APPLICATION_STATUS_TAG[application.status];

  return (
    <div className={styles.page}>
      {/* Хлебные крошки */}
      <nav className={styles.breadcrumbs}>
        <span className={styles.crumb} onClick={() => navigate('/')}>
          Главная
        </span>
        <span className={styles.crumbSeparator}>/</span>
        <span className={styles.crumb}>Психологи</span>
        <span className={styles.crumbSeparator}>/</span>
        <span className={styles.crumbActive}>
          {user?.last_name} {user?.first_name}
        </span>
      </nav>

      <div className={styles.layout}>
        {/* Левая колонка — основной контент */}
        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Первичная консультация</h1>

          <h2 className={styles.userName}>
            {application.last_name} {application.first_name}
          </h2>
          <p className={styles.userStatus}>{application.university_status}</p>

          {/* Статус заявки */}
          <div className={styles.statusRow}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>{STATUS_LABELS[application.status]}</span>
            <span className={clsx(styles.statusTag, statusUI.className)}>{statusUI.text}</span>
          </div>

          <hr className={styles.divider} />

          {/* Данные, указанные при записи */}
          <section className={styles.dataSection}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.requiredStar}>*</span> Данные, указанные при записи
            </h3>
            <div className={styles.dataGrid}>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Email:</span>
                <span className={styles.dataValue}>{application.email || '—'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Телефон:</span>
                <span className={styles.dataValue}>{application.phone || '—'}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Кампус:</span>
                <span className={styles.dataValue}>{application.preferred_campus || '—'}</span>
              </div>
              <div className={styles.dataItemFull}>
                <span className={styles.dataLabel}>Описание проблемы:</span>
                <span className={styles.dataValue}>{application.problem_description}</span>
              </div>
            </div>
          </section>

          <hr className={styles.divider} />

          {/* Формат и дата (только для in_progress) */}
          {isInProgress && (
            <section className={styles.dataSection}>
              <h3 className={styles.sectionTitle}>Назначить консультацию</h3>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>Формат</label>
                  <Select
                    value={meetingType}
                    onChange={setUserMeetingType}
                    options={MEETING_TYPE_OPTIONS}
                    placeholder="Выберите формат"
                    className={styles.fieldSelect}
                  />
                </div>
              </div>
            </section>
          )}

          <hr className={styles.divider} />

          {/* Заключение */}
          <section className={styles.dataSection}>
            <h3 className={styles.sectionTitle}>Заключение</h3>
            <textarea
              className={styles.textarea}
              placeholder="Введите заключение по заявке..."
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
            />
          </section>

          {/* Кнопки действий */}
          {isInProgress && (
            <div className={styles.actions}>
              <button
                className={styles.btnSecondary}
                type="button"
                onClick={() => setRejectModalOpen(true)}
              >
                Отменить запись
              </button>
              <button
                className={styles.btnPrimary}
                type="button"
                onClick={() => offerMutation.mutate()}
                disabled={!canSave}
              >
                {offerMutation.isPending ? 'Сохранение...' : 'Сохранить данные'}
              </button>
            </div>
          )}
        </div>

        {/* Правая колонка — запись на сессию */}
        {isInProgress && (
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Запись на сессию</h3>

              {/* Календарь */}
              <Calendar
                fullscreen={false}
                value={selectedDate || undefined}
                onChange={(date) => {
                  setUserDate(date);
                }}
                disabledDate={disabledDates}
                headerRender={({ value, type, onChange }) => {
                  const currentMonth = value.format('MMMM');
                  const capitalizedMonth =
                    currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

                  const handlePrev = () => {
                    onChange(value.clone().subtract(1, 'month'));
                  };

                  const handleNext = () => {
                    onChange(value.clone().add(1, 'month'));
                  };

                  return (
                    <div className={styles.calendarHeader}>
                      <button
                        type="button"
                        className={styles.calendarArrowBtn}
                        onClick={handlePrev}
                      >
                        <LeftOutlined />
                      </button>
                      <span className={styles.calendarMonthLabel}>{capitalizedMonth}</span>
                      <button
                        type="button"
                        className={styles.calendarArrowBtn}
                        onClick={handleNext}
                      >
                        <RightOutlined />
                      </button>
                    </div>
                  );
                }}
              />

              {/* Выбор времени */}
              <div className={styles.timeSection}>
                <label className={styles.fieldLabel}>Выбрать время</label>
                <Select
                  value={selectedTime || undefined}
                  onChange={setSelectedTime}
                  placeholder="Выберите время"
                  className={styles.fieldSelect}
                  options={TIME_SLOTS.map((slot) => ({ value: slot, label: slot }))}
                />
              </div>

              {/* Кнопка записи */}
              <button
                className={styles.btnPrimaryFull}
                type="button"
                onClick={() => offerMutation.mutate()}
                disabled={!canSave}
              >
                {offerMutation.isPending ? 'Запись...' : 'Записать'}
              </button>
            </div>
          </aside>
        )}
      </div>

      <PsychologistApplicationsModal
        applicationId={rejectModalOpen ? id! : null}
        onClose={() => setRejectModalOpen(false)}
        onSuccess={() => {
          message.success('Заявка отклонена');
          queryClient.invalidateQueries({ queryKey: [applicationQueryKey.byId, id] });
          navigate(-1);
        }}
      />
    </div>
  );
};

export default PsychologistApplicationPage;
