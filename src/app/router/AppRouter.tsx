import { Routes, Route, Navigate } from 'react-router-dom';
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
  );
};

export default AppRouter;
