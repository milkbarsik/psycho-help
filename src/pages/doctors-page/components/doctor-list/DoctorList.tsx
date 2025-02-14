import { FC } from "react";
import { DoctorType } from "../../constants";
import Doctor from "../doctor/Doctor";
import styles from './DoctorList.module.css';

interface Props {
    doctors: DoctorType[];
}

const DoctorList: FC<Props> = ({doctors}) => {
    return (
        <div className={styles.wrapper}>  
            <h2 className={styles.title}>Выбрать специалиста</h2>
            <div className={styles.list_wrapper}>
                {doctors.map(doctor => 
                    <Doctor doctor={doctor} key={doctor.id}/>
                )}
            </div>
        </div>
    );
}

export default DoctorList