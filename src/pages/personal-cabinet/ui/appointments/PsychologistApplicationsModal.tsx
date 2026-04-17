import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input, Modal } from 'antd';
import { applicationQueryKey, rejectApplication } from '@/entities/application/api';

interface PsychologistApplicationsModalProps {
  applicationId: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const PsychologistApplicationsModal = ({
  applicationId,
  onClose,
  onSuccess,
}: PsychologistApplicationsModalProps) => {
  const queryClient = useQueryClient();
  const [rejectReason, setRejectReason] = useState('');

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectApplication(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [applicationQueryKey.list] });
      setRejectReason('');
      onClose();
      onSuccess?.();
    },
  });

  const handleClose = () => {
    setRejectReason('');
    onClose();
  };

  return (
    <Modal
      title="Отклонить заявку"
      open={applicationId !== null}
      onCancel={handleClose}
      okText="Отклонить"
      cancelText="Отмена"
      okButtonProps={{
        danger: true,
        disabled: rejectReason.trim().length === 0,
        loading: rejectMutation.isPending,
      }}
      onOk={() => {
        if (applicationId && rejectReason.trim()) {
          rejectMutation.mutate({ id: applicationId, reason: rejectReason.trim() });
        }
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
  );
};

export default PsychologistApplicationsModal;
