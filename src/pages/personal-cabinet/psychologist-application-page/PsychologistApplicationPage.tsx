import { useMemo, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Select, message, Empty, Input } from 'antd';
import { AxiosError } from 'axios';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import clsx from 'clsx';
import {
  applicationQueries,
  applicationQueryKey,
  offerConsultation,
  acceptApplication,
} from '@/entities/application/api';
import type { MeetingType } from '@/entities/application/types';
import { Role } from '@/entities/role/helpers';
import { useAuth } from '@/features/auth/api/useAuth';
import Loader from '@/shared/ui/loader/loader';
import { ApplicationStatusTag } from '@/pages/personal-cabinet/constants';
import PsychologistRejectModal from '@/features/personal-cabinet/ui/PsychologistRejectModal';
import styles from './PsychologistApplicationPage.module.scss';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ru');

const MOSCOW_TZ = 'Europe/Moscow';

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
  const userId = user?.id;

  const isPsychologist = useMemo(() => !!user && new Role(user.roles).isPsychologist(), [user]);

  const { data: application, isLoading } = useQuery({
    ...applicationQueries.byId(id!),
    enabled: isPsychologist && !!id,
  });

  // Локальные стейты для формы назначения времени
  const [userMeetingType, setUserMeetingType] = useState<MeetingType | null>(null);
  const [userDate, setUserDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Дополнительные поля для формата встречи
  const [locationAddress, setLocationAddress] = useState<string>('');
  const [meetingUrl, setMeetingUrl] = useState<string>('');

  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  // Вычисляемые значения: отдан приоритет пользовательскому вводу
  const meetingType = userMeetingType ?? application?.meeting_type ?? null;
  const selectedDate =
    userDate ??
    (application?.scheduled_at
      ? dayjs(application.scheduled_at).tz(MOSCOW_TZ).startOf('day')
      : null);

  const selectedDateTime = useMemo(() => {
    if (!selectedDate || !selectedTime) return null;
    const [hours, minutes] = selectedTime.split(':').map(Number);
    return selectedDate.tz(MOSCOW_TZ, true).hour(hours).minute(minutes).second(0);
  }, [selectedDate, selectedTime]);

  const acceptMutation = useMutation({
    mutationFn: (applicationId: string) => acceptApplication(applicationId, userId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [applicationQueryKey.list] }),
    onError: (error: AxiosError<{ detail?: string }>) => {
      const detail = error.response?.data?.detail;
      message.error(detail || 'Не удалось выполнить операцию');
    },
  });

  const offerMutation = useMutation({
    mutationFn: () =>
      offerConsultation(id!, {
        psychologist_id: user!.id,
        meeting_type: meetingType!,
        scheduled_at: selectedDateTime!.toISOString(),
        location_address: meetingType === 'offline' ? locationAddress.trim() : undefined,
        meeting_url: meetingType === 'online' ? meetingUrl.trim() : undefined,
      }),
    onSuccess: () => {
      message.success('Консультация предложена, ожидаем подтверждения пользователя');
      queryClient.invalidateQueries({ queryKey: [applicationQueryKey.list] });
      queryClient.invalidateQueries({ queryKey: [applicationQueryKey.byId, id] });
      navigate(-1);
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      const detail = error.response?.data?.detail;
      message.error(detail || 'Не удалось сохранить изменения');
    },
  });

  if (!isPsychologist) return <Navigate to="/" replace />;
  if (isLoading) return <Loader />;
  if (!application) return <Empty description="Заявка не найдена" />;

  const canAccept = application.status === 'new';
  const canChange =
    application.status === 'in_progress' || application.status === 'awaiting_user_confirmation';
  const canReject =
    application.status === 'new' ||
    application.status === 'in_progress' ||
    application.status === 'awaiting_user_confirmation';

  // Проверка обязательных полей для записи
  const canSave =
    canChange &&
    meetingType &&
    selectedDateTime &&
    (meetingType === 'offline' ? locationAddress.trim().length > 0 : meetingUrl.trim().length > 0);

  const disabledDates = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  interface ExpandableTextProps {
    text: string;
  }

  const ExpandableText: React.FC<ExpandableTextProps> = ({ text }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    if (!text) return null;
    return (
      <div className={styles.dataValueDescriptionWrapper}>
      <span
        className={`${styles.dataValueDescription} ${isExpanded ? styles.expanded : ''}`}
      >
        {text}
      </span>
        {text.length > 100 && (
          <button
            className={styles.expandButton}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Свернуть' : 'Открыть полностью'}
          </button>
        )}
      </div>
    );
  };

  const statusUI = ApplicationStatusTag[application.status];

  return (
    <div className={styles.page}>
      <button type="button" onClick={() => navigate(-1)} className={styles.back}>
        <span>&lt;</span>
        <span>Вернуться назад</span>
      </button>

      <div className={styles.layout}>
        {/* правая колонка — основной контент */}
        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Заявка</h1>

          <h2 className={styles.userName}>
            {application.last_name} {application.first_name}
          </h2>

          {/* Статус заявки */}
          <div className={styles.statusRow}>
            <p className={styles.statusLabel}>Статус</p>
            <div className={styles['status']}>
              <div className={clsx(styles['status-dot'], styles[statusUI.className])}></div>
              <span className={styles['status-text']}>{statusUI.text}</span>
            </div>
          </div>

          {/* Причина отклонения */}
          {application.status === 'rejected' && application.reject_reason && (
            <div className={styles.reasonBlock}>
              <span className={styles.reasonLabel}>Причина отказа:</span>
              <span className={styles.reasonText}>{application.reject_reason}</span>
            </div>
          )}

          {/* Причина отмены пользователем */}
          {application.status === 'cancelled' && application.cancel_reason && (
            <div className={styles.reasonBlockCancelled}>
              <span className={styles.reasonLabel}>Причина отмены:</span>
              <span className={styles.reasonText}>{application.cancel_reason}</span>
            </div>
          )}

          {/* Данные, указанные при записи */}
          <section className={styles.dataSection}>
            {/*<h3 className={styles.sectionTitle}>*/}
            {/*  <span className={styles.requiredStar}>*</span> Данные, указанные при записи*/}
            {/*</h3>*/}
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
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Время:</span>
                <span className={styles.dataValue}>{application.scheduled_at || '—'}</span>
              </div>
            </div>
          </section>

          <hr className={styles.divider} />

          <div className={styles.dataItemFull}>
            <span className={styles.dataLabel}>Описание проблемы:</span>
            <ExpandableText text={application.problem_description} />
          </div>


          {/* Кнопки действий */}
          {(canReject || canAccept || canChange) && (
            <div className={styles.actions}>
              {canReject && (
                <button
                  className={styles.btnSecondary}
                  type="button"
                  onClick={() => setRejectModalOpen(true)}
                >
                  Отклонить заявку
                </button>
              )}
              {canAccept && (
                <button
                  className={styles.btnConfirm}
                  onClick={() => acceptMutation.mutate(application.id)}
                  disabled={acceptMutation.isPending}
                >
                  В работу
                </button>
              )}
              {canChange && (
                <button
                  className={styles.btnPrimary}
                  type="button"
                  onClick={() => offerMutation.mutate()}
                  disabled={!canSave}
                >
                  {offerMutation.isPending ? 'Сохранение...' : 'Запросить подтверждение'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Правая колонка — запись на сессию */}
        {canChange && (
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
                headerRender={({ value, onChange }) => {
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
            </div>
            {/* Формат и дата (только при редактировании) */}
            {canChange && (
              <section className={styles.dataSection}>
                <h3 className={styles.sectionTitle}>Назначить консультацию</h3>
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>Формат</label>
                    <Select
                      value={meetingType}
                      onChange={(val) => {
                        setUserMeetingType(val);
                        setLocationAddress('');
                        setMeetingUrl('');
                      }}
                      options={MEETING_TYPE_OPTIONS}
                      placeholder="Выберите формат"
                      className={styles.fieldSelect}
                    />
                  </div>

                  {meetingType === 'offline' && (
                    <div className={`${styles.formField} ${styles.formFieldGrow}`}>
                      <label className={styles.fieldLabel}>Адрес проведения</label>
                      <Input
                        placeholder="Укажите кабинет / здание"
                        value={locationAddress}
                        onChange={(e) => setLocationAddress(e.target.value)}
                      />
                    </div>
                  )}

                  {meetingType === 'online' && (
                    <div className={`${styles.formField} ${styles.formFieldGrow}`}>
                      <label className={styles.fieldLabel}>Ссылка на встречу</label>
                      <Input
                        placeholder="Zoom, Google Meet или другая платформа"
                        value={meetingUrl}
                        onChange={(e) => setMeetingUrl(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </section>
            )}
          </aside>
        )}
      </div>

      <PsychologistRejectModal
        type="application"
        entityId={rejectModalOpen ? id! : null}
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
