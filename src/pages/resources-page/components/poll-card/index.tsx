import InfoCircleOutlined from '@/shared/assets/images/resources/info-circle-outlined.svg?react';
import ClockCircleOutlined from '@/shared/assets/images/resources/clock-circle-outlined.svg?react';
import { Button } from '@/shared/ui/button';
import { DEFAULT_POLL_COVER, TRANSLATES } from '@/pages/resources-page/consts';
import { formatDuration, formatQuestionsCount } from '@/shared/lib/format';
import { toNumber, toText } from '@/shared/lib/coerce';
import type { TPoll } from '@/pages/resources-page/entities/polls/models.ts';
import styles from './PollCard.module.scss';

type TStat = {
  value: string;
  label: string;
};

type TProps = {
  poll: TPoll;
};

// Карточка опроса некликабельная — пройти можно только по кнопке.
export const PollCard = ({ poll }: TProps) => {
  const { slug } = poll;
  const title = toText(poll.title);
  const description = toText(poll.description);
  const cover = toText(poll.imageSrc) ?? DEFAULT_POLL_COVER;
  const questionsCount = toNumber(poll.questionsCount);
  const durationMinutes = toNumber(poll.durationMinutes);
  const passedCount = toNumber(poll.passedCount);
  const recommendPercent = toNumber(poll.recommendPercent);
  const rating = toNumber(poll.rating);

  // Статистика необязательна и может прийти частично — показываем только то,
  // что бэк реально прислал числом.
  const stats: TStat[] = [];
  if (passedCount !== null) {
    stats.push({ value: String(passedCount), label: TRANSLATES.pollPassed });
  }
  if (recommendPercent !== null) {
    stats.push({ value: `${recommendPercent}%`, label: TRANSLATES.pollRecommend });
  }
  if (rating !== null) {
    stats.push({ value: String(rating), label: TRANSLATES.pollRating });
  }

  const hasInfo = questionsCount !== null || durationMinutes !== null;

  return (
    <div className={styles.card} data-testid="poll-card">
      <div className={styles.imageWrapper}>
        <img className={styles.image} src={cover} alt={title ?? ''} />
        {rating !== null && <span className={styles.badge}>{rating}</span>}
      </div>
      <div className={styles.content}>
        <div className={styles.text}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {stats.length > 0 && (
          <div className={styles.stats}>
            {stats.map((stat) => (
              <div className={styles.stat} key={stat.label}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        )}
        {hasInfo && (
          <div className={styles.info}>
            {questionsCount !== null && (
              <div className={styles.infoItem}>
                <InfoCircleOutlined className={styles.infoIcon} aria-hidden />
                <span className={styles.infoValue}>{formatQuestionsCount(questionsCount)}</span>
              </div>
            )}
            {durationMinutes !== null && (
              <div className={styles.infoItem}>
                <ClockCircleOutlined className={styles.infoIcon} aria-hidden />
                <span className={styles.infoValue}>{formatDuration(durationMinutes)}</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.bottomSlot}>
        <Button className={styles.button} data-testid="pass-poll" to={`/poll/${slug}`}>
          {TRANSLATES.passPoll}
        </Button>
      </div>
    </div>
  );
};
