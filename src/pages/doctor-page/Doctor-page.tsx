import { useParams } from "react-router";
import styles from './Doctor-page.module.css';
import ServiceApi from "@/api/service-api";
import { useFetch } from "@/api/useFetch";
import { useEffect, useState } from "react";

const DoctorPage = () => {

    const {id}  = useParams();
    const {fetching, isLoading, error} = useFetch(async () => {
        const doctor = await ServiceApi.getTherapist(id);
    });

    const [doctor, setDoctor] = useState({});


    console.log(doctor);

    return(
        <div className={styles.wrapper}>
            <span>{id}</span>
            <div className={styles.card__wrapper}>
                <img src="" alt="" className={styles.img}/>
                <div className={styles.card__content}>
                    <p className={styles.thirsname}></p>
                    <p className={styles.IF}> </p>
                    <p className={styles.text}></p>
                    <p className={styles.textBold}></p>
                    <p className={styles.text}></p>
                    <button className={styles.btn}>Записаться</button>
                </div>
            </div>
        <h2 className={styles.subtitle}>Квалификация</h2>
        <div className={styles.qualif__wrapper}>
            <div className={styles.education}>
                <p></p>
                <p></p>
            </div>
            <div className={styles.consult_areas}>
                <p></p>
                <p></p>
            </div>
        </div>
        </div>
    )
}

export default DoctorPage;