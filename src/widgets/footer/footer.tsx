import VkIcon from '@/shared/assets/images/footer/vk.svg';
import TgIcon from '@/shared/assets/images/footer/tg.svg';
import OkIcon from '@/shared/assets/images/footer/ok.svg';
import YoutubeIcon from '@/shared/assets/images/footer/youtube.svg';
import styles from './footer.module.css';

const Footer = () => {
  const hotlines = [
    {
      title: 'Горячая линия Московской службы психологической помощи населению:',
      phone: '8 (495) 051 051'
    },
    {
      title: 'Горячей линии по психологической помощи студенческой молодежи',
      phone: '8 (800) 222-55-71'
    },
    {
      title: 'Телефон доверия для детей, подростков и их родителей:',
      phone: '8 (800) 200-01-22'
    },
    {
      title: 'Горячая линия центра экстренной психологической помощи МЧС России:',
      phone: '8 (495) 989-50-50'
    }
  ];

  const addresses = [
    'ул. Большая Семёновская, 38 ауд. 8-509',
    'ул. Прянишникова, 2а ауд. 1401',
    'ул. Павла Корчагина, 22 ауд. 239',
    'ул. Автозаводская, 16 ауд. 1109'
  ];

  const socialLinks = [
    { icon: VkIcon, alt: 'VK', link: 'https://vk.com/spp_polytech' },
    { icon: TgIcon, alt: 'Telegram', link: 'https://t.me/spp_mospolytech' }
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <h2 className={styles.title}>Мы всегда рядом</h2>
          <p className={styles.description}>
            В выходные и праздничные дни, ночью, за срочной психологической помощью можно обратиться по следующим телефонам
          </p>
          
          <div className={styles.hotlinesSection}>
            <div className={styles.illustration}>
              <div className={styles.counselingIllustration}>
                {/* Иллюстрация консультации */}
              </div>
            </div>
            
            <div className={styles.hotlinesGrid}>
              {hotlines.map((hotline, index) => (
                <div key={index} className={styles.hotlineCard}>
                  <h3 className={styles.hotlineTitle}>{hotline.title}</h3>
                  <a href={`tel:${hotline.phone}`} className={styles.hotlinePhone}>
                    {hotline.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.logoSection}>
            <h3 className={styles.logo}>московский политех</h3>
          </div>
          
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Телефон</span>
              <a href="tel:+74952230541" className={styles.contactValue}>+7 (495) 223-05-41</a>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>E-mail</span>
              <a href="mailto:psycholog@mospolytech.ru" className={styles.contactValue}>psycholog@mospolytech.ru</a>
            </div>
          </div>
          
          <div className={styles.socialSection}>
            {socialLinks.map((social, index) => (
              <a key={index} href={social.link} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                <img src={social.icon} alt={social.alt} className={styles.socialIcon} />
              </a>
            ))}
          </div>
        </div>

        <div className={styles.addressesSection}>
          {addresses.map((address, index) => (
            <p key={index} className={styles.address}>{address}</p>
          ))}
        </div>

        <div className={styles.copyright}>
          <p>© 2025 Служба психологической помощи (СПП) Московского Политеха.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
