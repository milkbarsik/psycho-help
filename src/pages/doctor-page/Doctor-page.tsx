import { useParams } from 'react-router';
import styles from './Doctor-page.module.css';
import ServiceApi from '@/api/service-api';
import { useFetch } from '@/api/useFetch';
import { useEffect, useState } from 'react';
import type { Therapist } from '@/api/types';
import Loader from '@/components/UI/loader/loader';
import Img from '@/components/UI/img/Img';
import altPhoto from '@/assets/images/altPhotos/User_Accounts_alt.png';

const DoctorPage = () => {
  const [doctor, setDoctor] = useState<Therapist | null>(null);
  const { id } = useParams();

  const { fetching, isLoading, error } = useFetch(async () => {
    const res = await ServiceApi.getTherapist(id!);
    if (res.status === 200) {
      setDoctor(res.data);
    }
  });

  useEffect(() => {
    window.scroll(0, 0);
    fetching();
  }, []);

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  } else if (!doctor) {
    return (
      <div>
        <h3>{error.message}</h3>
      </div>
    );
  } else {
    return (
      <div className={styles.wrapper}>
        <div className={styles.card__wrapper}>
          <Img
            className={styles.img}
            photo={`${import.meta.env.VITE_REACT_APP_IMAGE_URL}` + doctor.photo}
            altPhoto={altPhoto}
          />
          <div className={styles.card__content}>
            <p className={styles.thirsname}>{doctor.last_name.toUpperCase()}</p>
            <p className={styles.IF}>{[doctor?.first_name, doctor.middle_name].join(' ')}</p>
            <p className={[styles.text, styles.educ].join(' ')}>{doctor.education}</p>
            <p className={styles.textBold}>Обо мне:</p>
            <p className={styles.text}>{doctor.description}</p>
            <button className={styles.btn}>Записаться</button>
          </div>
        </div>
        <h2 className={styles.subtitle}>Квалификация</h2>
        <div className={styles.qualif__wrapper}>
          <div className={styles.qualif__elem}>
            <p className={styles.qualif__title}>Образование и стаж</p>
            <p className={styles.qualif__text}>{doctor.qualification}</p>
          </div>
          <div className={styles.qualif__elem}>
            <p className={styles.qualif__title}>Сферы консультации</p>
            <p className={styles.qualif__text}>{doctor.consult_areas}</p>
          </div>
        </div>
      </div>
    );
  }
};

export default DoctorPage;
