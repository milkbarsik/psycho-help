import { useMemo, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Descriptions, Tag, DatePicker, Select, Modal, Input, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  applicationQueries,
  applicationQueryKey,
  offerConsultation,
  rejectApplication,
} from '@/entities/application/api';
import type { ApplicationStatus, MeetingType } from '@/entities/application/types';
import { Role } from '@/entities/role/helpers';
import { useAuth } from '@/features/auth/api/useAuth';
import Loader from '@/shared/ui/loader/loader';
import styles from './PsychologistApplicationPage.module.scss';

const STATUS_TAG: Record<ApplicationStatus, { label: string; color: string }> = {
  new: { label: 'Новая', color: 'blue' },
  in_progress: { label: 'В работе', color: 'orange' },
  awaiting_user_confirmation: { label: 'Ожидает подтверждения', color: 'cyan' },
  completed: { label: 'Завершено', color: 'green' },
  rejected: { label: 'Отклонено', color: 'red' },
  cancelled: { label: 'Отменено', color: 'default' },
  expired: { label: 'Истекло', color: 'default' },
};

const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  online: 'Онлайн',
  offline: 'Очно',
};

const MEETING_TYPE_OPTIONS = [
  { value: 'online' as const, label: 'Онлайн' },
  { value: 'offline' as const, label: 'Очно' },
];

const formatDateTime = (iso?: string | null) => {
  if (!iso) return '—';
  return dayjs(iso).format('D MMMM YYYY, HH:mm');
};

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

  // Editable state for in_progress status
  const [meetingType, setMeetingType] = useState<MeetingType | null>(null);
  const [scheduledAt, setScheduledAt] = useState<dayjs.Dayjs | null>(null);
  const [initializedForId, setInitializedForId] = useState<string | null>(null);

  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Initialize editable fields when application loads (state-during-render)
  if (application && application.status === 'in_progress' && application.id !== initializedForId) {
    setInitializedForId(application.id);
    if (application.meeting_type) setMeetingType(application.meeting_type);
    if (application.scheduled_at) setScheduledAt(dayjs(application.scheduled_at));
  }

  const offerMutation = useMutation({
    mutationFn: () =>
      offerConsultation(id!, {
        psychologist_id: user!.id,
        meeting_type: meetingType!,
        scheduled_at: scheduledAt!.toISOString(),
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

  const rejectMutation = useMutation({
    mutationFn: () => rejectApplication(id!, rejectReason),
    onSuccess: () => {
      message.success('Заявка отклонена');
      setRejectModalOpen(false);
      queryClient.invalidateQueries({ queryKey: [applicationQueryKey.list] });
      queryClient.invalidateQueries({ queryKey: [applicationQueryKey.byId, id] });
      navigate(-1);
    },
    onError: () => {
      message.error('Не удалось отклонить заявку');
    },
  });

  if (!isPsychologist) return <Navigate to="/" replace />;
  if (isLoading) return <Loader />;
  if (!application) return <p>Заявка не найдена</p>;

  const statusTag = STATUS_TAG[application.status];
  const isInProgress = application.status === 'in_progress';
  const canSave = isInProgress && meetingType && scheduledAt;

  return (
    <article className={styles.wrapper}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        className={styles.back}
      >
        Назад
      </Button>

      <h2 className={styles.title}>Заявка на консультацию</h2>

      <Descriptions column={1} bordered size="middle">
        <Descriptions.Item label="ФИО">
          {application.last_name} {application.first_name}
        </Descriptions.Item>
        <Descriptions.Item label="Email">{application.email || '—'}</Descriptions.Item>
        <Descriptions.Item label="Телефон">{application.phone || '—'}</Descriptions.Item>
        <Descriptions.Item label="Статус в университете">
          {application.university_status}
        </Descriptions.Item>
        <Descriptions.Item label="Предпочтительный кампус">
          {application.preferred_campus || '—'}
        </Descriptions.Item>
        <Descriptions.Item label="Описание проблемы">
          {application.problem_description}
        </Descriptions.Item>
        <Descriptions.Item label="Статус">
          <Tag color={statusTag.color}>{statusTag.label}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Дата создания">
          {formatDateTime(application.created_at)}
        </Descriptions.Item>

        {isInProgress ? (
          <>
            <Descriptions.Item label="Формат">
              <Select
                value={meetingType}
                onChange={setMeetingType}
                options={MEETING_TYPE_OPTIONS}
                placeholder="Выберите формат"
                style={{ minWidth: 200 }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Дата и время">
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format="DD.MM.YYYY HH:mm"
                value={scheduledAt}
                onChange={setScheduledAt}
                placeholder="Выберите дату и время"
                style={{ minWidth: 250 }}
              />
            </Descriptions.Item>
          </>
        ) : (
          <>
            <Descriptions.Item label="Формат">
              {application.meeting_type ? MEETING_TYPE_LABELS[application.meeting_type] : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Дата и время">
              {formatDateTime(application.scheduled_at)}
            </Descriptions.Item>
          </>
        )}

        {application.reject_reason && (
          <Descriptions.Item label="Причина отклонения">
            {application.reject_reason}
          </Descriptions.Item>
        )}
        {application.cancel_reason && (
          <Descriptions.Item label="Причина отмены">{application.cancel_reason}</Descriptions.Item>
        )}
      </Descriptions>

      {isInProgress && (
        <div className={styles.actions}>
          <Button
            type="primary"
            size="large"
            onClick={() => offerMutation.mutate()}
            loading={offerMutation.isPending}
            disabled={!canSave}
          >
            Сохранить
          </Button>
          <Button danger size="large" onClick={() => setRejectModalOpen(true)}>
            Отклонить
          </Button>
        </div>
      )}

      <Modal
        title="Отклонить заявку"
        open={rejectModalOpen}
        onCancel={() => setRejectModalOpen(false)}
        onOk={() => rejectMutation.mutate()}
        okText="Отклонить"
        cancelText="Отмена"
        okButtonProps={{
          danger: true,
          disabled: rejectReason.trim().length === 0,
          loading: rejectMutation.isPending,
        }}
      >
        <p>Укажите причину отклонения:</p>
        <Input.TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Причина отклонения"
          maxLength={500}
          showCount
        />
      </Modal>
    </article>
  );
};

export default PsychologistApplicationPage;
