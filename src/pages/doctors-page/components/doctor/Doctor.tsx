import { FC } from "react";
import { therapist } from "@/api/types";
import styles from './Doctor.module.css';
import arrowLink from '@/assets/images/doctors/link-arrow.svg';
import { Link } from "react-router-dom";

interface Props {
    doctor: therapist;
}

const Doctor: FC<Props> = ({doctor}) => {


    return(
        <div className={styles.wrapper}>
            <img className={styles.photo} src={doctor.photo} alt="doctor_photo" />

            <p className={styles.fio}>{doctor.last_name} <br /> {[doctor.first_name, doctor.middle_name].join(' ')}</p>

            <p className={styles.education}>{doctor.education}</p>

            <p className={styles.short_desc}>{doctor.short_description}</p>

            <p className={styles.experience}>Опыт {doctor.experience} лет</p>

            <Link className={styles.link} to={`/therapists/${doctor.id}`}>Подробнее<span className={styles.arrow_wrapper}><img className={styles.arrow} src={arrowLink} alt="" /></span></Link>
        </div>
    )
}

export default Doctor;