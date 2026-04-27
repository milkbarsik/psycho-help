import type { FC } from 'react';
import UserDashboard from './UserDashboard';
import PsychologistDashboard from './PsychologistDashboard';
import AdminDashboard from './AdminDashboard';
import type { RoleCode } from '@/entities/role/types';

interface DashboardProps {
  userName: string;
  role: RoleCode;
  onBookClick?: () => void;
}

const Dashboard: FC<DashboardProps> = ({ userName, role, onBookClick }) => {
  switch (role) {
    case 'psychologist':
      return <PsychologistDashboard onBookClick={onBookClick} />;
    case 'admin':
    case 'content_manager':
      return <AdminDashboard />;
    case 'user':
    default:
      return <UserDashboard userName={userName} onBookClick={onBookClick || (() => {})} />;
  }
};

export default Dashboard;