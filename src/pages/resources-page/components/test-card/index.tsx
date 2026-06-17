import { Link } from 'react-router-dom';
import { DEFAULT_TEST_COVER } from '@/pages/resources-page/consts';
import { formatDuration, formatQuestionsCount } from '@/shared/lib/format';
import { toNumber, toText } from '@/shared/lib/coerce';
import type { TTest } from '@/pages/resources-page/entities/tests/models.ts';
import styles from './TestCard.module.scss';

type TProps = {
  test: TTest;
};

// Карточка теста всегда кликабельная целиком — это переход на страницу теста,
// поэтому рендерим обычной ссылкой (доступность и клавиатура работают сами).
export const TestCard = ({ test }: TProps) => {
  const { slug } = test;
  const title = toText(test.title);
  const description = toText(test.description);
  const cover = toText(test.imageSrc) ?? DEFAULT_TEST_COVER;
  const questionsCount = toNumber(test.questionsCount);
  const durationMinutes = toNumber(test.durationMinutes);
  const hasInfo = questionsCount !== null || durationMinutes !== null;

  return (
    <Link
      to={`/test/${slug}`}
      className={styles.card}
      data-testid="test-card"
      aria-label={title ?? undefined}
    >
      <div className={styles.imageWrapper}>
        <img className={styles.image} src={cover} alt={title ?? ''} />
      </div>
      <div className={styles.content}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {description && <p className={styles.description}>{description}</p>}
        {hasInfo && (
          <div className={styles.info}>
            {questionsCount !== null && (
              <span className={styles.infoValue}>{formatQuestionsCount(questionsCount)}</span>
            )}
            {durationMinutes !== null && (
              <span className={styles.infoValue}>{formatDuration(durationMinutes)}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};
