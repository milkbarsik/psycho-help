import Title from "./components/title/Title";
import styles from './DoctorPage.module.css';
import ServiceApi from "@/api/service-api";
import { useFetch } from "@/api/useFetch";


import DoctorList from "./components/doctor-list/DoctorList";
import { useEffect, useState } from "react";
import { therapist } from "@/api/types";

 const DoctorsPage = () => {

    const [doctors, setDoctors] = useState<therapist[]>([]);

    const {fetching, isLoading, error} = useFetch(async () => {
        const res = await ServiceApi.getTherapists();
				if (res.status === 200) {
					setDoctors(res.data);
				}
    })

    useEffect(() => {
        fetching();
    }, [])

   if (isLoading) {
			return (
				<div>
					<h3>Загрузка...</h3>
				</div>
			)
			
		} else if (!doctors) {
			return (
				<div>
					<h3>
						{
							error.message
						}
					</h3>
				</div>
			)
		} else {
			return ( 
        <div className={styles.wrapper}>
            <Title />
						<DoctorList doctors={doctors} />
        </div>
    	);
		}
}
 
export default DoctorsPage;