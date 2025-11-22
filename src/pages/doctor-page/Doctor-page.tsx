import { useParams } from 'react-router';
import styles from './Doctor-page.module.css';
import ServiceApi from '@/shared/api/service-api';
import { useFetch } from '@/shared/api/useFetch';
import { useEffect, useState } from 'react';
import type { Therapist } from '@/shared/api/types';
import Loader from '@/shared/ui/loader/loader';
import Img from '@/shared/ui/img/Img';
import altPhoto from '@/shared/assets/images/altPhotos/User_Accounts_alt.png';

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
        <h3>{error.message || 'Данные не найдены'}</h3>
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
            <p className={[styles.text, styles.educ].join(' ')}>{doctor.qualification}</p>
            <p className={styles.textBold}>Обо мне:</p>
            <p className={styles.text}>{doctor.description}</p>
            <button className={styles.btn} aria-label="Кнопка записаться">
              Записаться
            </button>
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
