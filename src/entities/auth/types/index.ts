import type { Role } from '@/entities/role/types';

export type User = {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  phone_number: string;
  email: string;
  social_media: string | null;
  study_group: string | null;
  roles?: Role[]; // Тут я уже запутался
  avatar_url?: string; // Тут я уже запутался
};

export type RegistrationData = {
  first_name: string;
  middle_name: string | null;
  last_name: string;
  phone_number: string;
  email: string;
  social_media: string | null;
  password: string;
  study_group: string | null;
};

export type LoginData = {
  email: string;
  password: string;
};

export type UserPasswordUpdate = {
  old_password: string;
  new_password: string;
};

// Не используется
export type UserUpdate = {
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  email: string | null;
  social_media: string | null;
  study_group: string | null;
};
