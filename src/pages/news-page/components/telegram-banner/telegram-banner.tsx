import React from 'react';
import styles from './telegram-banner.module.css';
import TelegramIcon from '@/shared/assets/images/news/telegram-icon.svg';

export const TelegramBanner: React.FC = () => (
  <aside className={styles.banner}>
    <h2 className={styles.title}>Новости в нашем Telegram</h2>
    <p className={styles.text}>Подпишитесь, чтобы узнавать актуальную информацию самым первым</p>
    <div className={styles.iconWrapper}>
      <img src={TelegramIcon} alt="Telegram" />
    </div>
    <a href={'https://web.telegram.org/'} target={'_blank'} className={styles.button}>
      Подписаться
    </a>
  </aside>
);
