import Doctor from "./components/doctor/Doctor";
import Title from "./components/title/Title";
import styles from './DoctorPage.module.css';

import { doctors } from "./constants";
import DoctorList from "./components/doctor-list/DoctorList";

 const DoctorsPage = () => {
    return ( 
        <div className={styles.wrapper}>
            <Title />
            <DoctorList doctors={doctors} />
        </div>
    );
}
 
export default DoctorsPage;