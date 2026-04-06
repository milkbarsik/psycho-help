import { Routes, Route, Navigate } from 'react-router-dom';
import { routes } from './routes';
import { useAuth } from '@/features/auth/api/useAuth';
import { Loader } from '@/shared/ui';
import { useAppContext } from '@/app/context';

const AppRouter = () => {
  const isAuth = useAuth((state) => state.isAuth);
  const { isAppLoading } = useAppContext();

  if (isAppLoading) {
    return <Loader />;
  }

  return (
    <Routes>
      {routes
        .filter(({ authOnly }) => !authOnly || isAuth)
        .map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
