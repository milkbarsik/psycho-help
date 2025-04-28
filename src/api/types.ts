import { AxiosResponse } from 'axios';
import { FC } from 'react';

export type user = {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number: string;
  email: string;
  social_media: string;
};

export type Tauth = {
  isAuth: boolean;
  email: string;
  setAuth: (value: boolean) => void;
  setUser: (username: string) => void;
  login: (email: string, password: string) => Promise<AxiosResponse<authRes>>;
  registration: (data: regData) => Promise<AxiosResponse<authRes>>;
  getUser: () => Promise<AxiosResponse<user>>;
  logOut: () => Promise<AxiosResponse>;
};

export type Tprops = {
  setWindow: (param: string) => any;
  isOpen: boolean;
  setModalOpen: (param: boolean) => any;
};

export interface routePath {
  path: string;
  Component: FC<any>;
}

export interface TextBlockProps {
  title: string;
  info: string;
}

export interface BlockWrapperProps {
  component: FC<any>;
  // className: string;
  title?: string;
  name: string;
}

export type regData = {
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  role: string;
};

export type User = {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number: string;
  email: string;
  social_media: string;
};

export type authRes = {
  status_code: number;
  token: string;
};

export type therapist = {
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

export type PostAppointment = {
  patient_id: string;
  therapist_id: string;
  type: 'Offline' | 'Online';
  reason: string;
  remind_time: string;
  venue: string;
};

// export interface Pagination {
//   pageNo?: number;
//   pageSize?: number;
// }

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
