import styles from './ResourcesPage.module.scss';
import { type ITab, Tabs } from '@/shared/ui/tabs';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { TRANSLATES } from './consts/translates.ts';
import { ResourceEntities } from '@/pages/resources-page/consts/entities.ts';
import { Articles } from '@/pages/resources-page/entities/articles';

const TABS = [
  {
    id: ResourceEntities.ARTICLES,
    content: <Articles />,
    label: TRANSLATES.articles,
  },
  {
    id: ResourceEntities.TESTS,
    label: TRANSLATES.tests,
    content: <></>,
  },
  {
    id: ResourceEntities.POLLS,
    label: TRANSLATES.polls,
    content: <></>,
  },
] as ITab[];

export const ResourcesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const features = TRANSLATES.features.join(' • ');
  const [, setCurrentTab] = useState<typeof ResourceEntities | null>(null);

  useEffect(() => {
    const tabParam = searchParams.get('entity');
    if (tabParam && Object.values(ResourceEntities)?.includes(tabParam)) {
      setCurrentTab(tabParam as unknown as typeof ResourceEntities);
    } else {
      setCurrentTab(null);
      searchParams.delete('entity');
      setSearchParams(searchParams);
    }
  }, [searchParams]);

  const handleChangeTab = (tabId: string) => {
    setSearchParams({ entity: tabId });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <div className={styles.info}>
          <h2 className={styles.title}>{TRANSLATES.title}</h2>
          <p className={styles.features}>{features}</p>
        </div>
        <div className={styles.image}>
          <img src={TRANSLATES.imgSrc} alt={'resources-image'} />
        </div>
      </div>

      <div className={styles.content}>
        <Tabs
          contentClassName={styles.tabsContent}
          fullWidth
          onChange={handleChangeTab}
          tabs={TABS}
        />
      </div>
    </div>
  );
};
