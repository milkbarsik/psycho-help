import VkIcon from '../../assets/images/main/footer/vk.svg';
import TgIcon from '../../assets/images/main/footer/tg.svg';
import styles from './footer.module.css'
import { Layout } from 'antd';


const Footer = () => {
  return (
    <div>
      <Layout.Footer className={styles.wrapper}>
        <div className={styles.contentWrapper}>
          <span className={styles.wrapperBefore}></span>
          <div className={styles.flexWrap}>
            <h3>Служба психологической помощи</h3>
            <h3>Будем рады Вам помочь!</h3>
          </div>
          <div className={styles.address}>
            <h3>Адреса:</h3>
            <ol className={styles.list}>
              <li className={styles.listItem}>ул. Большая Семёновская, 38, ауд. В-509</li>
              <li className={styles.listItem}>ул. Прянишникова, 2а, ауд. 1401</li>
              <li className={styles.listItem}>ул. Павла Корчагина, 22, ауд. 239</li>
              <li className={styles.listItem}>ул. Автозаводская, 16, ауд. 1109</li>
            </ol>
          </div>
          <div className={styles.flexWrap}>
            <h3>Тел: +7(495) 223-05-41</h3>
            <div className={styles.socials}>
              <div className={styles.iconBox}>
                <a href="https://vk.com/spp_polytech" className={styles.link}>
                  <img src={VkIcon} alt="Vk" className={styles.icon} />
                </a>
              </div>
              <div className={styles.iconBox}>
                <a href="https://t.me/spp_mospolytech" className={styles.link}>
                  <img src={TgIcon} alt="Tg" className={styles.icon} />
                </a>
              </div>
            </div>
          </div>
          <h3>
            E-mail:{' '}
            <a href="mailto:psycholog@mospolytech.ru" className={styles.link}>
              psycholog@mospolytech.ru
            </a>
          </h3>
          <div className={styles.textWrapper}>
            <div className={styles.textBlock}>
              <p className={styles.text}>
                &copy; 2024 федеральное государственное автономное образовательное учреждение
                высшего образования &laquo;Московский политехнический университет&raquo;,
              </p>
              <p className={styles.text}>Московский Политех</p>
            </div>
          </div>
        </div >
      </Layout.Footer >
    </div >
  );
};

export default Footer;
