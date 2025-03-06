import Doctor from "./components/doctor/Doctor";
import Title from "./components/title/Title";
import styles from './DoctorPage.module.css';
import ServiceApi from "@/api/service-api";
import { useFetch } from "@/api/useFetch";


import DoctorList from "./components/doctor-list/DoctorList";
import { useEffect, useState } from "react";
import { DoctorType } from "./constants";

 const DoctorsPage = () => {

    const [doctors, setDoctors] = useState<DoctorType[]>([]);

    const {fetching, isLoading, error} = useFetch(async () => {
        const data = await ServiceApi.getTherapists();
        setDoctors(data.data);
    })

    useEffect(() => {
        fetching();
    }, [])

    return ( 
        <div className={styles.wrapper}>
            <Title />
            <DoctorList doctors={doctors} />
        </div>
    );
}
 
export default DoctorsPage;