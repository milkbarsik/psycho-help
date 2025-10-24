import Title from '@/features/therapists/ui/title';
import styles from './DoctorPage.module.css';
import ServiceApi from '@/shared/api/service-api';
import { useFetch } from '@/shared/api/useFetch';

import DoctorList from '@/features/therapists/ui/doctor-list';
import { useEffect, useState } from 'react';
import type { Therapist } from '@/shared/api/types';
import Loader from '@/shared/ui/loader/loader';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Therapist[]>([]);

  const { fetching, isLoading, error } = useFetch(async () => {
    const res = await ServiceApi.getTherapists();
    if (res.status === 200) {
      setDoctors(res.data);
    }
  });

  useEffect(() => {
    fetching();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  } else if (!doctors) {
    return (
      <div>
        <h3>{error.message}</h3>
      </div>
    );
  } else {
    return (
      <div className={styles.wrapper}>
        <Title />
        <DoctorList doctors={doctors} />
      </div>
    );
  }
};

export default DoctorsPage;






// Для мок данных

// import Title from '@/features/therapists/ui/title';
// import styles from './DoctorPage.module.css';
// import DoctorList from '@/features/therapists/ui/doctor-list';
// import { useState } from 'react';
// import type { Therapist } from '@/shared/api/types';
// import { mockDoctors } from '@/shared/api/mockDoctors';

// const DoctorsPage = () => {
//   const [doctors] = useState<Therapist[]>(mockDoctors);

//   return (
//     <div className={styles.wrapper}>
//       <Title />
//       <DoctorList doctors={doctors} />
//     </div>
//   );
// };

// export default DoctorsPage;

