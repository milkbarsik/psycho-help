import QuestionsList from './components/questions-list';
import FaqImage from '../../assets/images/main/faq/shrug_rafiki_1.svg';
import styles from './faq-page.module.css';
import { faq } from './constants';

const FaqPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.faqName}>
            <h1 className={styles.faq}>FAQ</h1>
            <p className={styles.description}>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. A enim, ex deleniti expedita
              debitis nisi reiciendis non ipsam earum sit in adipisci ducimus. Vero eveniet a
              pariatur recusandae autem dolor. (описание)
            </p>
          </div>
          <img src={FaqImage} alt="" />
        </div>
      </div>
      <div className={styles.questions}>
        <QuestionsList questions={faq} />
      </div>
    </div>
  );
};

export default FaqPage;
