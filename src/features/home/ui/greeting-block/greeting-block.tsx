// import { Flex } from 'antd';
import GreetingImage from '@/shared/assets/images/help_blue_t 1.png';
import OnlineImage from '@/shared/assets/images/main_page_display.svg'
import OfflineImage from '@/shared/assets/images/main_page_profile.svg'
// import { SERVICE_PROPS } from '@/features/home/config/constants';
import styles from './greeting-block.module.css';

const GreatingBlock = () => {
  return (
    <div className={styles.greetingBlock}>
        <div className={styles.blockItems}>
          <h1 className={styles.greetingTitle}>
          Помощь психолога для студентов и сотрудников
          </h1>
          <p className={styles.greetingDescription}>
          Иногда справляться с трудностями в одиночку тяжело. Наши психологи помогут найти выход. Консультации бесплатны, конфиденциальны и доступны очно или онлайн
          </p>
          <div className={styles.buttonWrapper}>
            <div className={styles.typeButtonWrapper}>
              <button className={styles.oflineSingup}>
                <img src={OfflineImage} className={styles.oflineSingupImg}/>
                <span>лично</span>
              </button>
              <button className={styles.onlineSingup}>
                <img src={OnlineImage} className={styles.onlineSingupImg}/>
                <span>онлайн</span>
              </button>
            </div>
            <button type="submit" className={styles.signupButton}>
              <span className={styles.signupButton__text}>Записаться</span>
            </button>
          </div>
        </div>

      <div>
        <div className={styles.greetingImageWrapper}>
          <img src={GreetingImage} alt="Иллюстрация на главной странице" className={styles.greetingImage}/>
        </div>
      </div>
    </div>
  );
};

export default GreatingBlock;
