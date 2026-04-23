import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input, message, Modal } from 'antd';
import { AxiosError } from 'axios';
import { applicationQueryKey, rejectApplication } from '@/entities/application/api';
import { appointmentQueryKey, cancelAppointment } from '@/entities/appointment/api';

type ModalType = 'application' | 'appointment';

const CONFIG: Record<
  ModalType,
  {
    title: string;
    okText: string;
    label: string;
    sublabel: string;
    placeholder: string;
    mutationFn: (id: string, reason: string) => Promise<unknown>;
    queryKey: string;
  }
> = {
  application: {
    title: 'Заявка',
    okText: 'Отклонить',
    label: 'Вы уверены, что хотите отклонить заявку? Укажите причину ниже.',
    sublabel: 'Причина отклонения заявки*',
    placeholder:
      'Клиент увидит это сообщение. Укажите причину отклонения и рекомендации (например, новое время, другой формат)',
    mutationFn: rejectApplication,
    queryKey: applicationQueryKey.list,
  },
  appointment: {
    title: 'Запись',
    okText: 'Отменить',
    label: 'Вы уверены, что хотите отменить запись? Укажите причину ниже.',
    sublabel: 'Причина отмены записи*',
    placeholder:
      'Клиент увидит это сообщение. Укажите причину отмены и рекомендации (например, новое время, другой формат)',
    mutationFn: cancelAppointment,
    queryKey: appointmentQueryKey.list,
  },
};

interface PsychologistRejectModalProps {
  type: ModalType;
  entityId: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const PsychologistRejectModal = ({
  type,
  entityId,
  onClose,
  onSuccess,
}: PsychologistRejectModalProps) => {
  const queryClient = useQueryClient();
  const [reason, setReason] = useState('');
  const config = CONFIG[type];

  const mutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => config.mutationFn(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [config.queryKey] });
      setReason('');
      onClose();
      onSuccess?.();
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      const detail = error.response?.data?.detail;
      message.error(detail || 'Не удалось выполнить операцию');
    },
  });

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Modal
      styles={{
        body: { marginBottom: 25 },
      }}
      centered={true}
      title={config.title}
      open={entityId !== null}
      onCancel={handleClose}
      okText={config.okText}
      cancelText="Закрыть"
      okButtonProps={{
        danger: true,
        disabled: reason.trim().length === 0,
        loading: mutation.isPending,
      }}
      onOk={() => {
        if (entityId && reason.trim()) {
          mutation.mutate({ id: entityId, reason: reason.trim() });
        }
      }}
    >
      <p style={{ marginBottom: 5 }}>{config.label}</p>
      <p style={{ color: 'var(--color-label-neutral-secondary)' }}>{config.sublabel}</p>
      <Input.TextArea
        rows={6}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder={config.placeholder}
        maxLength={500}
        showCount
      />
    </Modal>
  );
};

export default PsychologistRejectModal;
