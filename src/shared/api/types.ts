import type { Role } from '@/entities/role/types';

export type regData = {
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  role: string;
};

export interface ResponseError {
  message: string;
  status: number | undefined;
}
export type User = {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number: string;
  email: string;
  social_media: string;
  roles: Role[];
  study_group?: string;
  avatar_url?: string;
};

export type UserProfileUpdate = Partial<
  Pick<User, 'first_name' | 'middle_name' | 'last_name' | 'phone_number' | 'email' | 'study_group'>
>;

export type AuthRes = {
  status_code: number;
  token: string;
};

export type Therapist = {
  id?: string;
  photo?: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  social_media?: string;
  password: string;
  education: string;
  experience: string;
  qualification: string;
  consult_areas: string;
  short_description: string;
  description: string;
  office: string;
};

export type TextBlockProps = {
  title: string;
  info: string;
};

export const NewsType = {
  Announcement: 'Анонс мероприятия',
  Report: 'Отчет о мероприятии',
} as const;

export type NewsType = (typeof NewsType)[keyof typeof NewsType];
export type News = {
  id: string;
  slug: string;
  image?: string;
  type: NewsType;
  date: string;
  title: string;
  description?: string;
  link?: string;
  text?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
};

// export interface User {
//   userId: number;
//   name: string;
//   username: string;
//   photo?: string[];
//   description?: string;
//   isWorking?: boolean;
// }

// export interface Pageable {
//   pageNumber: number;
//   pageSize: number;
//   sort: {
//     sorted: boolean;
//     empty: boolean;
//     unsorted: boolean;
//   };
//   offset: number;
//   paged: boolean;
//   unpaged: boolean;
// }

// export interface BaseEntityListDTO {
//   content: any;
//   pageable?: Pageable;
// }

// export interface DoctorsList extends BaseEntityListDTO {
//   content: User[];
// }

// "totalPages": 1,
// "totalElements": 1,
// "last": true,
// "size": 10,
// "number": 0,
// "sort": {
//   "sorted": false,
//   "empty": true,
//   "unsorted": true
// },
// "numberOfElements": 1,
// "first": true,
// "empty": false
