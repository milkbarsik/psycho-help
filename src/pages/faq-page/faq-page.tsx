import QuestionsList from '@/features/faq/ui/questions-list';
import FaqImage from '@/shared/assets/images/main/faq/questions_blue_t 1.png';
import styles from './faq-page.module.css';
import { faq } from './constants';

const FaqPage = () => {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.wrapper}>
          <div className={styles.headerContent}>
            <div className={styles.faqName}>
              <h1 className={styles.faq}>FAQ</h1>
              <p className={styles.description}>
                Здесь вы сможете найти ответы на интересующие вас вопросы.
              </p>
            </div>
            <img
              src={FaqImage}
              alt="Изображение на странице с вопросами"
              className={styles.image}
            />
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
