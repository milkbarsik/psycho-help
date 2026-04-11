import { queryOptions } from '@tanstack/react-query';
import { $api } from '@/shared/api/http';
import type { Application, ApplicationStatus, MeetingType } from './types';

export const applicationQueryKey = {
  list: 'application.list',
  byId: 'application.byId',
};

export const applicationQueries = {
  list: (params?: {
    status?: ApplicationStatus;
    assigned_to?: string;
    sort_by?: string;
    sort_desc?: boolean;
  }) =>
    queryOptions<Application[]>({
      queryKey: [applicationQueryKey.list, params],
      queryFn: async () => (await $api.get('/applications/', { params })).data,
    }),

  byId: (id: string) =>
    queryOptions<Application>({
      queryKey: [applicationQueryKey.byId, id],
      queryFn: async () => (await $api.get(`/applications/${id}`)).data,
      enabled: !!id,
    }),
};

export const acceptApplication = async (applicationId: string, assignedTo: string) => {
  const { data } = await $api.post<Application>(`/applications/${applicationId}/accept`, {
    assigned_to: assignedTo,
  });
  return data;
};

export const offerConsultation = async (
  applicationId: string,
  body: {
    psychologist_id: string;
    meeting_type: MeetingType;
    scheduled_at: string;
    location_address?: string | null;
    meeting_url?: string | null;
  },
) => {
  const { data } = await $api.post<Application>(`/applications/${applicationId}/offer`, body);
  return data;
};

export const rejectApplication = async (applicationId: string, rejectReason: string) => {
  const { data } = await $api.post<Application>(`/applications/${applicationId}/reject`, {
    reject_reason: rejectReason,
  });
  return data;
};
