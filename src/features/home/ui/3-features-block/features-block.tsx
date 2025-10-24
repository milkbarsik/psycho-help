import styles from './features-block.module.css';

const FeaturesBlock = () => {
  return (
    <div className={styles.features}>
      <div className={styles.features__grid}>
        <div className={styles.features__grid_1}>
          <div className={styles.features__1_content}>
            <span className={styles.features__1_title}>Компетентые психологи</span>
            <span className={styles.features__1_text}>
              Наши специалисты имеют высшее психологическое образование и практический опыт. Мы
              гарантируем бережную и профессиональную помощь
            </span>
          </div>
          <button className={styles.features__1_button}>Смотреть всех</button>
        </div>
        <div className={styles.features__grid_2}>
          <span className={styles.features__2_title}>График работы</span>
          <span className={styles.features__2_text}>
            Служба доступна в течение всего года. Приём ведётся в будние дни, кроме официальных
            праздников
          </span>
        </div>
        <div className={styles.features__grid_3}>
          <span className={styles.features__3_title}>Формат консультаций</span>
          <span className={styles.features__3_text}>
            Очная встреча в вузе или дистанционно по телефону, через мессенджеры, Zoom, Skype или
            e-mail
          </span>
        </div>
        <div className={styles.features__grid_4}>
          <div className={styles.features__4_content}>
            <span className={styles.features__4_title}>Перенос или пропуск консультации</span>
            <span className={styles.features__4_text}>
              Если встречу нужно перенести, просьба сообщить об этом заранее. Пропуск без
              предупреждения не допускается
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesBlock;
