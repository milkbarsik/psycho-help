import type { Role } from '@/entities/role/types';
export type User = {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number: string;
  email: string;
  social_media: string;
  roles: Role[];
};

export type RegistrationData = {
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  role: string;
};

export type UserUpdate = {
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number: string;
  email: string;
  social_media: string;
  study_group: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type UserPasswordUpdate = {
  old_password: string;
  new_password: string;
};
