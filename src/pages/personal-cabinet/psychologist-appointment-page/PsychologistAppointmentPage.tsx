import { useMemo } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Descriptions, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { $api } from '@/shared/api/http';
import type { Appointment } from '@/entities/appointment/types';
import type { User } from '@/entities/auth';
import { Role } from '@/entities/role/helpers';
import { useAuth } from '@/features/auth/api/useAuth';
import Loader from '@/shared/ui/loader/loader';
import styles from './PsychologistAppointmentPage.module.scss';

const STATUS_TAG: Record<string, { label: string; color: string }> = {
  Approved: { label: 'Ожидается', color: 'green' },
  Accepted: { label: 'Новая', color: 'blue' },
  Cancelled: { label: 'Отменено', color: 'red' },
  Done: { label: 'Пройдено', color: 'default' },
};

const TYPE_LABELS: Record<string, string> = {
  Online: 'Онлайн',
  Offline: 'Очно',
};

const getFullName = (user: User) =>
  [user.last_name, user.first_name, user.middle_name].filter(Boolean).join(' ');

const formatDateTime = (iso?: string) => {
  if (!iso) return { date: '—', time: '—' };
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
    time: d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
  };
};

const PsychologistAppointmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);

  const isPsychologist = useMemo(() => !!user && new Role(user.roles).isPsychologist(), [user]);

  const { data: appointment, isLoading } = useQuery<Appointment>({
    queryKey: ['appointment.byId', id],
    queryFn: async () => (await $api.get(`/appointments/${id}`)).data,
    enabled: isPsychologist && !!id,
  });

  const { data: patient, isLoading: isPatientLoading } = useQuery<User>({
    queryKey: ['user.byId', appointment?.patient_id],
    queryFn: async () => (await $api.get(`/users/user/${appointment!.patient_id}`)).data,
    enabled: isPsychologist && !!appointment?.patient_id,
  });

  if (!isPsychologist) return <Navigate to="/" replace />;
  if (isLoading || isPatientLoading) return <Loader />;
  if (!appointment) return <p>Запись не найдена</p>; // TODO: сделать нормальную страницу 404

  const { date, time } = formatDateTime(appointment.scheduled_time);
  const patientName = patient ? getFullName(patient) : '—';
  const statusTag = STATUS_TAG[appointment.status ?? ''];

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

      <Descriptions column={1} bordered size="middle">
        <Descriptions.Item label="Пациент">{patientName}</Descriptions.Item>
        <Descriptions.Item label="Дата">{date}</Descriptions.Item>
        <Descriptions.Item label="Время">{time}</Descriptions.Item>
        <Descriptions.Item label="Формат">
          {TYPE_LABELS[appointment.type ?? ''] ?? appointment.type}
        </Descriptions.Item>
        <Descriptions.Item label="Место">{appointment.venue || '—'}</Descriptions.Item>
        <Descriptions.Item label="Статус">
          {statusTag ? <Tag color={statusTag.color}>{statusTag.label}</Tag> : appointment.status}
        </Descriptions.Item>
      </Descriptions>
    </article>
  );
};

export default PsychologistAppointmentPage;
