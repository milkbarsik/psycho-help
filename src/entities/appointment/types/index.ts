export type Appointment = {
  id?: string;
  patient_id?: string;
  therapist_id?: string;
  type?: AppointmentType;
  reason?: string;
  status?: AppointmentStatusType;
  remind_time: string;
  last_change_time?: string;
  venue?: string;
  date?: string;
  time?: string;
};

export type AppointmentStatusType = 'Approved' | 'Accepted' | 'Cancelled' | 'Done';
export type AppointmentType = 'Offline' | 'Online';
