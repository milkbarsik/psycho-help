import styles from './Polls.module.scss';
import { pollMocks } from '@/pages/resources-page/entities/polls/mocks.ts';
import { PollCard } from '@/pages/resources-page/components';
import { Button } from '@/shared/ui/button';
import { useState } from 'react';

const initialPolls = pollMocks.slice(0, 6);

export const Polls = () => {
  const [polls, setPolls] = useState(initialPolls);

  const handleShowMore = () => setPolls(pollMocks);
  const isShowMoreVisible = polls.length < pollMocks.length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.passList} data-testid="polls-list">
        {polls.map((item) => (
          <PollCard key={item.id} poll={item} />
        ))}
      </div>
      {isShowMoreVisible && (
        <Button
          className={styles.showMore}
          variant="secondary"
          data-testid="show-more-polls"
          onClick={handleShowMore}
        >
          Показать ещё
        </Button>
      )}
    </div>
  );
};
