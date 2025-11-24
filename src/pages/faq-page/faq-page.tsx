import QuestionsList from '@/features/faq/ui/questions-list';
import FaqImage from '@/shared/assets/images/main/faq/questions_blue_t 1.png';
import styles from './faq-page.module.css';
import { faq, TRANSLATES } from './constants';

const FaqPage = () => {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.wrapper}>
          <div className={styles.headerContent}>
            <div className={styles.faqName}>
              <h1 className={styles.faq}>{TRANSLATES.title}</h1>
              <p className={styles.description}>{TRANSLATES.description}</p>
            </div>
            <img src={FaqImage} alt={TRANSLATES.imgAlt} className={styles.image} />
          </div>
        </div>
      </div>
      <div className={styles.wrapperQuestions}>
        <div className={styles.questions}>
          <QuestionsList questions={faq} />
        </div>
      </div>
    </>
  );
};

export default FaqPage;
