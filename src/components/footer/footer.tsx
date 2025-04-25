import VkIcon from '../../assets/images/main/footer/vk.svg';
import TgIcon from '../../assets/images/main/footer/tg.svg';
import styles from './footer.module.css';
import { Layout } from 'antd';

const Footer = () => {
  const addresses = [
    { text: 'ул. Большая Семёновская, 38, ауд. В-509' },
    { text: 'ул. Прянишникова, 2а, ауд. 1401' },
    { text: 'ул. Павла Корчагина, 22, ауд. 239' },
    { text: 'ул. Автозаводская, 16, ауд. 1109' },
  ];

  const social = [
    { link: 'https://vk.com/spp_polytech', image: VkIcon, alt: 'Vk' },
    { link: 'https://t.me/spp_mospolytech', image: TgIcon, alt: 'Tg' },
  ];

  return (
    <div>
      <Layout.Footer className={styles.wrapper}>
        <div className={styles.contentWrapper}>
          <span className={styles.wrapperBefore}></span>
          <div className={styles.flexWrap}>
            <h3 className={styles.fontSize__18}>Служба психологической помощи</h3>
            <h3 className={styles.fontSize__18}>Будем рады Вам помочь!</h3>
          </div>
          <div className={styles.address}>
            <h3 className={styles.fontSize__18}>Адреса:</h3>
            <ol className={styles.list}>
              {addresses.map((item, index) => (
                <li key={index} className={styles.fontSize__18}>
                  {item.text}
                </li>
              ))}
            </ol>
          </div>
          <div className={styles.flexWrap}>
            <h3 className={styles.phone}>Тел: +7(495) 223-05-41</h3>
            <div className={styles.socials}>
              {social.map((item, index) => (
                <div className={styles.iconBox} key={index}>
                  <img src={item.image} alt={item.alt} className={styles.icon} />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.textWrapper}>
            <h3>
              E-mail:{' '}
              <a href="mailto:psycholog@mospolytech.ru" className={styles.link}>
                psycholog@mospolytech.ru
              </a>
            </h3>
            <div className={styles.textBlock}>
              <p className={styles.text}>
                © {new Date().getFullYear()} федеральное государственное автономное образовательное
                учреждение высшего образования «Московский политехнический университет»,
              </p>
              <p className={styles.text}>Московский Политех</p>
            </div>
          </div>
        </div>
      </Layout.Footer>
    </div>
  );
};

export default Footer;
