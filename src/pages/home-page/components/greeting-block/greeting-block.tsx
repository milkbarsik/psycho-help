import { Flex } from 'antd';
import GreetingImage from '@/assets/images/help_blue_t 1.png';
import { SERVICE_PROPS } from '../../constants';
import styles from './greeting-block.module.css';

const GreatingBlock = () => {
  return (
    <div className={styles.greetingBlock}>
      <div>
        <div className={styles.blockItems}>
          <h2 className={styles.title4}>Слубжа психологической помощи</h2>
          <h1 className={styles.greetingTitle}>
            Профессиональная помощь <br /> студентам и сотрудникам <br /> университета
          </h1>

          <ul className={styles.greetingList}>
            {SERVICE_PROPS.map((item, index) => (
              <li key={index} className={styles.greetingList__item}>
                <Flex gap={24} style={{ fontSize: '18px' }}>
                  <span>—</span>
                  {item}
                </Flex>
              </li>
            ))}
          </ul>
          <div className={styles.buttonWrapper}>
            <button type="submit" className={styles.signupButton}>
              <span className={styles.signupButton__text}>Записаться</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className={styles.greetingImageWrapper}>
          <img src={GreetingImage} alt="Иллюстрация на главной странице" />
        </div>
        <div className={styles.importantTextWrapper}>
          <span className={styles.importantText}>
            <span className={styles.importantText__bold}>Важно!</span> Консультации проходят в очном
            и онлайн режиме, бесплатны и конфиденциальны.
          </span>
        </div>
      </div>
    </div>
  );
};

export default GreatingBlock;
