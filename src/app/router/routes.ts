import type { FC } from 'react';
import { HomePage } from '@/pages/home-page';
import { PersonalCabinet } from '@/pages/personal-cabinet';
import { FaqPage } from '@/pages/faq-page';
import { DoctorsPage } from '@/pages/doctors-page';
import { DoctorPage } from '@/pages/doctor-page';
import { ResourcesPage } from '@/pages';

/*
 Тип маршрута:
 - "path" — URL-путь
 - "Component" — React-компонент, который будет отрисован по этому пути

 Здесь использовалось "FC<any>", но "any" убрали,
 так как все текущие страницы не принимают внешних пропсов.

 Если позже появятся страницы с пропсами (например, компоненту нужно будет передавать userId),
 можно сделать тип дженериком:
 *ts
 interface RoutePath<T = Record<string, unknown>> {
   path: string;
   Component: FC<T>;
 }
 и тогда конкретный маршрут можно будет описывать с указанием пропсов:
 *ts
 { path: '/example', Component: ExamplePage as FC<ExampleProps> }
 */

interface routePath {
  path: string;
  Component: FC; // Компонент без пропсов
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
    path: '/resources',
    Component: ResourcesPage,
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
    path: '/resources',
    Component: ResourcesPage,
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
