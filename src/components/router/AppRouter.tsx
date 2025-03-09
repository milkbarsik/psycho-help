import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, notAuthRoutes } from './routes';
import { useAuth } from '@/api/auth/useAuth';

const AppRouter = ({ isLoading }: { isLoading: boolean }) => {

	const {isAuth} = useAuth()

	if (isLoading) {
		return <h3>Загрузка...</h3>
	}

  return (
    <Routes>
      {isAuth && authRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
			{!isAuth && notAuthRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      <Route path="*" element={<Navigate to='/' />} />
    </Routes>
  );
};

export default AppRouter;
