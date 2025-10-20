import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { authRoutes, notAuthRoutes } from './routes';
import { useAuth } from '@/features/auth/api/useAuth';
import { Loader } from '@/shared/ui';
import { useAppContext } from '@/app/context';

const AppRouter = () => {
  const isAuth = useAuth((state) => state.isAuth);
  const { isAppLoading: isLoading } = useAppContext();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {isAuth &&
          authRoutes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        {!isAuth &&
          notAuthRoutes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
