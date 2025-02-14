import styles from './Title.module.css'
import doctor from '@/assets/images/doctors/doctors.svg'

const Title = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <div className={styles.content__text}>
                    <h2 className={styles.title}>Психологи</h2>
                    <p className={styles.text}>
                        На этой странице с психологами вы найдёте широкий выбор специалистов,
                        которые помогут вам справиться с различными жизненными ситуациями.
                    </p>
                </div>
            </div>
            <img src={doctor} alt="" className={styles.titleImg}/>
        </div>
    );
}

export default Title;