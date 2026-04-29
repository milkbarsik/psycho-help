import type { Role } from '@/entities/role/types';

export interface User {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  phone_number: string;
  email: string;
  social_media: string | null;
  study_group: string | null;
  roles?: Role[];
  avatar_url?: string;
}

export interface RegistrationData {
  first_name: string;
  middle_name: string | null;
  last_name: string;
  phone_number: string;
  email: string;
  social_media: string | null;
  password: string;
  study_group: string | null;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserPasswordUpdate {
  old_password: string;
  new_password: string;
}

export interface ResponseError {
  message: string;
  status: number | undefined;
}

// Нужно выбрать один из этих типов, прост я не знаю, насколько критично для бэка, чтобы эти поля были именно null, или же достаточно просто сделать их undefined
export type UserProfileUpdate = Partial<
  Pick<
    User,
    | 'first_name'
    | 'middle_name'
    | 'last_name'
    | 'phone_number'
    | 'email'
    | 'social_media'
    | 'study_group'
  >
>;

export interface UserUpdate {
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  email: string | null;
  social_media: string | null;
  study_group: string | null;
}
