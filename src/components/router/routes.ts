import { FC } from 'react';
import HomePage from '../../pages/home-page/home-page';
import PersonalCabinet from '../../pages/personal-cabinet/personal-cabinet';
import FaqPage from '../../pages/faq-page/faq-page';
import DoctorsPage from '../../pages/doctors-page/DoctorsPage';

interface routePath {
  path: string;
  Component: FC<any>;
}

// Список всех урлов, а также компонентов, отрисовываемых при нахождении на одном из них

export const routes: routePath[] = [
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: '/cabinet',
    Component: PersonalCabinet,
  },
  {
    path: '/faq',
    Component: FaqPage,
  },
  {
    path: '/therapists/',
    Component: DoctorsPage,
  },
];
