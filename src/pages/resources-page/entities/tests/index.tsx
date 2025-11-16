import styles from './Tests.module.scss';
import { testMocks } from '@/pages/resources-page/entities/tests/mocks.ts';
import { TestCard } from '@/pages/resources-page/components';

export const Tests = () => {
  const tests = testMocks;

  return (
    <div className={styles.wrapper}>
      <div className={styles.testList}>
        {tests.map((item, index) => {
          return (
            <TestCard
              ellipseDescription
              title={item.title}
              info={{
                key: item.countQuestion,
                value: item.time,
              }}
              description={item.description}
              hasHorizontalDesktopVersion
              key={`tests-${index}`}
            />
          );
        })}
      </div>
    </div>
  );
};
