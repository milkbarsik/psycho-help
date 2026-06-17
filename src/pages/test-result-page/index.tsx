import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import styles from './TestResultPage.module.scss';
import { getMockTestResult } from './mocks';
import { TRANSLATES as t } from './constants';
import { Button } from '@/shared/ui';
import { LeftOutlined } from '@ant-design/icons';
import { DEFAULT_TEST_COVER } from '@/pages/resources-page/consts';
import { asArray } from '@/shared/lib/coerce';
import type { TTestAnswers } from '@/pages/test-page/models';

export const TestResultPage = () => {
  const { slug } = useParams();
  const location = useLocation();

  const answers = (location.state as { answers?: TTestAnswers } | null)?.answers;

  if (!answers) {
    return <Navigate to={`/test/${slug}`} replace />;
  }

  const result = getMockTestResult(answers);

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <Link to="/resources?entity=tests" className={styles.backButton}>
          <LeftOutlined aria-hidden />
          {t.materials}
        </Link>
      </div>

      <h1 className={styles.title}>{t.title}</h1>

      <div className={styles.content}>
        <div className={styles.main}>
          <div className={styles.imageWrapper}>
            <img src={result.imageSrc || DEFAULT_TEST_COVER} alt={result.title} />
          </div>
          <div className={styles.description}>
            {asArray(result.description).map((paragraph, index) => (
              <p key={`test-result-paragraph-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>

        <aside className={styles.recommendations}>
          <h2 className={styles.recommendationsTitle}>{t.recommendations}</h2>
          <ul className={styles.recommendationsList}>
            {asArray(result.recommendations).map((recommendation, index) => (
              <li key={`test-result-recommendation-${index}`}>{recommendation}</li>
            ))}
          </ul>
        </aside>
      </div>

      <div className={styles.buttons}>
        <Button className={styles.bottomBtn} variant="secondary" to={`/test/${slug}`}>
          {t.retake}
        </Button>
        <Button className={styles.bottomBtn} variant="secondary" to="/resources?entity=tests">
          {t.other}
        </Button>
      </div>
    </div>
  );
};
