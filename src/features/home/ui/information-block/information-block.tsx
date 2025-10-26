import styles from './information-block.module.css'
import informationImage from '@/shared/assets/images/main/information-block/information_block_img.svg'

const InformationBlock = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
    
          <p className={styles.subtitle}>
            В выходные и праздничные дни, ночью, за срочной психологической <br/>помощью можно обратиться по следующим телефонам
          </p>
        </div>

        
        <div className={styles.content}>
          
            <div className={styles.illustration}>
              <div className={styles.illustrationImage}>
                <img 
                  src={informationImage} 
                  alt="Психологическая помощь" 
                  className={styles.illustrationImg}
                />
              </div>
            </div>

          
          <div className={styles.contactCards}>
            
            <div className={styles.contactCard}>
              <h3 className={styles.cardTitle}>
                Горячая линия Московской службы психологической помощи населению:
              </h3>
              <div className={styles.phoneNumbers}>
                <div className={styles.phoneNumber}>
                  <span className={styles.number}>8 (495) 051</span>
                  <span className={styles.label}>с городского <br/>телефона</span>
                </div>
                <div className={styles.phoneNumber}>
                  <span className={styles.number}>051</span>
                  <span className={styles.label}>с мобильного телефона</span>
                </div>
              </div>
            </div>

            <div className={styles.contactCard}>
              <h3 className={styles.cardTitle}>
                Горячей линии по психологической помощи студенческой молодежи
              </h3>
              <div className={styles.phoneNumbers}>
                <div className={styles.phoneNumber}>
                  <span className={styles.number}>8 (800) 222-55-71</span>
                </div>
              </div>
            </div>

            <div className={styles.contactCard}>
              <h3 className={styles.cardTitle}>
                Телефон доверия для детей, подростков и их родителей:
              </h3>
              <div className={styles.phoneNumbers}>
                <div className={styles.phoneNumber}>
                  <span className={styles.number}>8 (800) 200-01-22</span>
                </div>
              </div>
            </div>

            <div className={styles.contactCard}>
              <h3 className={styles.cardTitle}>
                Горячая линия центра экстренной психологической помощи МЧС России:
              </h3>
              <div className={styles.phoneNumbers}>
                <div className={styles.phoneNumber}>
                  <span className={styles.number}>8 (495) 989-50-50</span>
                  <span className={styles.note}>бесплатно по Москве</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationBlock;