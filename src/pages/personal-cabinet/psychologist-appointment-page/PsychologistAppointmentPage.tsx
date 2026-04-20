import { useMemo, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Descriptions, Input, message, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  appointmentQueries,
  appointmentQueryKey,
  completeAppointment,
} from '@/entities/appointment/api';
import { Role } from '@/entities/role/helpers';
import { useAuth } from '@/features/auth/api/useAuth';
import Loader from '@/shared/ui/loader/loader';
import { APPOINTMENT_STATUS_TAG } from '@/pages/personal-cabinet/ui/appointments/PsychologistAppointmentsConstants';
import PsychologistAppointmentsModal from '@/features/personal-cabinet/ui/PsychologistAppointmentsModal';
import styles from './PsychologistAppointmentPage.module.scss';

const TYPE_LABELS: Record<string, string> = {
  Online: 'Онлайн',
  Offline: 'Очно',
};

const formatDateTime = (iso?: string | null) => {
  if (!iso) return '—';
  return dayjs(iso).format('D MMMM YYYY, HH:mm');
};

const PsychologistAppointmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuth((s) => s.user);

  const isPsychologist = useMemo(() => !!user && new Role(user.roles).isPsychologist(), [user]);

  const { data: appointment, isLoading } = useQuery({
    ...appointmentQueries.byId(id!),
    enabled: isPsychologist && !!id,
  });

  const [comment, setComment] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [commentInitializedForId, setCommentInitializedForId] = useState<string | null>(null);

  if (appointment?.comment && appointment.id !== commentInitializedForId) {
    setCommentInitializedForId(appointment.id);
    setComment(appointment.comment);
  }

  const completeMutation = useMutation({
    mutationFn: () => completeAppointment(id!, comment),
    onSuccess: () => {
      message.success('Запись завершена');
      setComment('');
      queryClient.invalidateQueries({ queryKey: [appointmentQueryKey.list] });
      queryClient.invalidateQueries({ queryKey: [appointmentQueryKey.byId, id] });
      navigate(-1);
    },
    onError: () => {
      message.error('Не удалось завершить запись');
    },
  });

  if (!isPsychologist) return <Navigate to="/" replace />;
  if (isLoading) return <Loader />;
  if (!appointment) return <Empty description="Запись не найдена" />;

  // const statusTag = STATUS_TAG[appointment.status];
  const isActive = appointment.status === 'awaiting';

  // TODO: Оно наверное пока что упадёт, надо будет поправить
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serverCancelReason = (appointment as any).cancel_reason;

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

      <h2 className={styles.title}>Запись на консультацию</h2>

      {/* Причина отмены (если запись уже отменена) */}
      {appointment.status === 'cancelled' && serverCancelReason && (
        <div className={styles.reasonBlockCancelled}>
          <span className={styles.reasonLabel}>Причина отмены:</span>
          <span className={styles.reasonText}>{serverCancelReason}</span>
        </div>
      )}

      <Descriptions column={1} bordered size="middle">
        <Descriptions.Item label="Дата и время">
          {formatDateTime(appointment.scheduled_time)}
        </Descriptions.Item>
        <Descriptions.Item label="Формат">
          {TYPE_LABELS[appointment.type] ?? appointment.type}
        </Descriptions.Item>
        <Descriptions.Item label="Место">{appointment.venue || '—'}</Descriptions.Item>
        <Descriptions.Item label="Причина">{appointment.reason || '—'}</Descriptions.Item>
        <Descriptions.Item label="Причина записи">{appointment.reason || '—'}</Descriptions.Item>
        <Descriptions.Item label="Статус">
          <div className={styles.statusRow}>
            {/* <span className={`${styles.statusDot} ${getStatusColorClass(appointment.status)}`} />
            <span className={styles.statusText}>{STATUS_LABELS[appointment.status]}</span> */}
          </div>
        </Descriptions.Item>

        <Descriptions.Item label="Заключение">
          {isActive ? (
            <Input.TextArea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Введите заключение по консультации"
              maxLength={2000}
              showCount
            />
          ) : (
            appointment.comment || '—'
          )}
        </Descriptions.Item>
      </Descriptions>

      {isActive && (
        <div className={styles.actions}>
          <Button
            type="primary"
            size="large"
            onClick={() => completeMutation.mutate()}
            loading={completeMutation.isPending}
            disabled={comment.trim().length === 0} // Желательно иметь заполненное заключение для завершения
          >
            Завершить сессию
          </Button>
          <Button danger size="large" onClick={() => setCancelModalOpen(true)}>
            Отменить запись
          </Button>
        </div>
      )}

      <PsychologistAppointmentsModal
        type="appointment"
        entityId={cancelModalOpen ? id! : null}
        onClose={() => setCancelModalOpen(false)}
        onSuccess={() => {
          message.success('Запись отменена');
          queryClient.invalidateQueries({ queryKey: [appointmentQueryKey.byId, id] });
          navigate(-1);
        }}
      />
    </article>
  );
};

export default PsychologistAppointmentPage;
