import Title from '@/features/therapists/ui/title';
import styles from './DoctorPage.module.css';
import DoctorList from '@/features/therapists/ui/doctor-list';
import Loader from '@/shared/ui/loader/loader';
import { useQuery } from '@tanstack/react-query';
import { therapistQueries } from '@/entities/therapist/api';
import { Result } from 'antd';

const DoctorsPage = () => {
  const { data: doctors, isLoading, error } = useQuery(therapistQueries.list());

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  if (!doctors || error) {
    return (
      <div>
        <Result status={'error'} title={error?.message} />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Title />
      <DoctorList doctors={doctors} />
    </div>
  );
};

export default DoctorsPage;
