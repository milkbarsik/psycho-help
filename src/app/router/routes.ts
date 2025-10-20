import type { FC } from 'react';
import { lazy } from 'react';

const HomePage = lazy(() => import('@/pages/home-page').then(module => ({ default: module.HomePage })));
const PersonalCabinet = lazy(() => import('@/pages/personal-cabinet').then(module => ({ default: module.PersonalCabinet })));
const FaqPage = lazy(() => import('@/pages/faq-page').then(module => ({ default: module.FaqPage })));
const DoctorsPage = lazy(() => import('@/pages/doctors-page').then(module => ({ default: module.DoctorsPage })));
const DoctorPage = lazy(() => import('@/pages/doctor-page').then(module => ({ default: module.DoctorPage })));

interface routePath {
  path: string;
  Component: FC<any>;
}

// Список всех урлов, а также компонентов, отрисовываемых при нахождении на одном из них

export const authRoutes: routePath[] = [
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: '/faq',
    Component: FaqPage,
  },
  {
    path: '/therapists/',
    Component: DoctorsPage,
  },
  {
    path: '/therapists/:id',
    Component: DoctorPage,
  },
  {
    path: '/cabinet',
    Component: PersonalCabinet,
  },
];

export const notAuthRoutes: routePath[] = [
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: '/faq',
    Component: FaqPage,
  },
  {
    path: '/therapists/',
    Component: DoctorsPage,
  },
  {
    path: '/therapists/:id',
    Component: DoctorPage,
  },
];
