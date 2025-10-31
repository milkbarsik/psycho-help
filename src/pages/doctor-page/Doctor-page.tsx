import { useParams } from 'react-router';
import styles from './Doctor-page.module.css';
import Loader from '@/shared/ui/loader/loader';
import Img from '@/shared/ui/img/Img';
import altPhoto from '@/shared/assets/images/altPhotos/User_Accounts_alt.png';
import { useQuery } from '@tanstack/react-query';
import { therapistQueries } from '@/entities/therapist/api';
import { Result } from 'antd';
import { TRANSLATES } from '@/pages/doctor-page/constants.ts';

const DoctorPage = () => {
  const { id } = useParams();

  const { data: doctor, isLoading, error } = useQuery(therapistQueries.byId(id!));

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div>
        <Result status={'error'} title={error?.message} />
      </div>
    );
  }

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
          <p className={styles.textBold}>{TRANSLATES.aboutMe}</p>
          <p className={styles.text}>{doctor.description}</p>
          <button className={styles.btn} aria-label="Кнопка записаться">
            {TRANSLATES.signup}
          </button>
        </div>
      </div>
      <h2 className={styles.subtitle}>{TRANSLATES.qualification}</h2>
      <div className={styles.qualif__wrapper}>
        <div className={styles.qualif__elem}>
          <p className={styles.qualif__title}>{TRANSLATES.education}</p>
          <p className={styles.qualif__text}>{doctor.qualification}</p>
        </div>
        <div className={styles.qualif__elem}>
          <p className={styles.qualif__title}>{TRANSLATES.consultAreas}</p>
          <p className={styles.qualif__text}>{doctor.consult_areas}</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorPage;
