import { useParams } from "react-router";
import styles from './Doctor-page.module.css';
import ServiceApi from "@/api/service-api";
import { useFetch } from "@/api/useFetch";
import { useEffect, useState } from "react";
import { DoctorType } from "../doctors-page/constants";
import { doctors } from "../doctors-page/constants";

const DoctorPage = () => {

    const doctor = doctors[0];
    // const [doctor, setDoctor] = useState<DoctorType>();
    // const {id}  = useParams();
    
    // const {fetching, isLoading, error} = useFetch(async () => {
    //     const data = await ServiceApi.getTherapist(id!)
    //     setDoctor(data.data);
    // });

    

    // useEffect(() => {
    //     fetching();
    // }, [])


    return(
        <div className={styles.wrapper}>
            <div className={styles.card__wrapper}>
                <img src={doctor.photo} alt="" className={styles.img}/>
                <div className={styles.card__content}>
                    <p className={styles.thirsname}>{doctor?.last_name.toUpperCase()}</p>
                    <p className={styles.IF}>{[doctor?.first_name, doctor?.middle_name].join(' ')}</p>
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
    )
}

export default DoctorPage;