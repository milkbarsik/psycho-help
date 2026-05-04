import vk from '@/shared/assets/images/news/vk.svg';
import styles from './NewsBanner.module.scss';

export const NewsBanner = () => {
  return (
    <div className={styles.banner}>
      <div className={styles.banner__info}>
        <h3 className={styles.banner__title}>Новости в нашем VK</h3>
        <p className={styles.banner__text}>
          Подпишитесь, чтобы узнавать актуальную информацию первыми
        </p>
      </div>
      <img src={vk} alt="VK" className={styles.banner__icon} />
      <a
        className={styles.banner__link}
        href="https://vk.com/spp_polytech"
        target="_blank"
        rel="noopener external"
      >
        Подписаться
      </a>
    </div>
  );
};
