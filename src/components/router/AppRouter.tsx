import { Routes, Route, Navigate } from 'react-router-dom';
import { routes } from './routes';
import { FC } from 'react';

const AppRouter: FC = () => {

  return (
    <Routes>
      {routes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      <Route path="*" element={<Navigate to='/' />} />
      {/* по аналогии отрисовываем навигацию для других ролей */}
    </Routes>
  );
};

export default AppRouter;
