import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input, Modal } from 'antd';
import { appointmentQueryKey, cancelAppointment } from '@/entities/appointment/api';

interface PsychologistAppointmentsModalProps {
  appointmentId: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const PsychologistAppointmentsModal = ({
  appointmentId,
  onClose,
  onSuccess,
}: PsychologistAppointmentsModalProps) => {
  const queryClient = useQueryClient();
  const [cancelReason, setCancelReason] = useState('');

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => cancelAppointment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [appointmentQueryKey.list] });
      setCancelReason('');
      onClose();
      onSuccess?.();
    },
  });

  const handleClose = () => {
    setCancelReason('');
    onClose();
  };

  return (
    <Modal
      title="Отменить запись"
      open={appointmentId !== null}
      onCancel={handleClose}
      okText="Отменить"
      cancelText="Отмена"
      okButtonProps={{
        danger: true,
        disabled: cancelReason.trim().length === 0,
        loading: cancelMutation.isPending,
      }}
      onOk={() => {
        if (appointmentId && cancelReason.trim()) {
          cancelMutation.mutate({ id: appointmentId, reason: cancelReason.trim() });
        }
      }}
    >
      <p>Укажите причину отмены:</p>
      <Input.TextArea
        rows={4}
        value={cancelReason}
        onChange={(e) => setCancelReason(e.target.value)}
        placeholder="Причина отмены"
        maxLength={500}
        showCount
      />
    </Modal>
  );
};

export default PsychologistAppointmentsModal;
