import type { User } from '@/entities/auth';

export interface ResponseError {
  message: string;
  status: number | undefined;
}

export type UserProfileUpdate = Partial<
  Pick<User, 'first_name' | 'middle_name' | 'last_name' | 'phone_number' | 'email' | 'study_group'>
>;

// export type AuthRes = {
//   status_code: number;
//   token: string;
// };

export type TextBlockProps = {
  title: string;
  info: string;
};

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
