import styles from './ResourcesPage.module.scss';
import { type ITab, Tabs } from '@/shared/ui/tabs';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { TRANSLATES } from './consts/translates.ts';
import {
  ResourceEntities,
  RESOURCES_ENTITY_STORAGE_KEY,
  type TResourceEntity,
} from '@/pages/resources-page/consts/entities.ts';
import { Articles } from '@/pages/resources-page/entities/articles';
import { Tests } from '@/pages/resources-page/entities/tests';
import { Polls } from '@/pages/resources-page/entities/polls';

const TABS: ITab[] = [
  {
    id: ResourceEntities.ARTICLES,
    content: <Articles />,
    label: TRANSLATES.articles,
  },
  {
    id: ResourceEntities.TESTS,
    content: <Tests />,
    label: TRANSLATES.tests,
  },
  {
    id: ResourceEntities.POLLS,
    content: <Polls />,
    label: TRANSLATES.polls,
  },
];

const isValidEntity = (value: string | null): value is TResourceEntity =>
  !!value && (Object.values(ResourceEntities) as string[]).includes(value);

const getSavedEntity = (): TResourceEntity => {
  const savedEntity = sessionStorage.getItem(RESOURCES_ENTITY_STORAGE_KEY);
  return isValidEntity(savedEntity) ? savedEntity : ResourceEntities.ARTICLES;
};

export const ResourcesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const features = TRANSLATES.features.join(' • ');

  // Вкладка, с которой открывается страница: из урла, иначе - последняя посещённая
  const [initialTab] = useState(() => {
    const entityParam = searchParams.get('entity');
    return isValidEntity(entityParam) ? entityParam : getSavedEntity();
  });

  useEffect(() => {
    const entityParam = searchParams.get('entity');
    if (isValidEntity(entityParam)) {
      sessionStorage.setItem(RESOURCES_ENTITY_STORAGE_KEY, entityParam);
    } else {
      setSearchParams({ entity: getSavedEntity() }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleChangeTab = (tabId: string) => {
    setSearchParams({ entity: tabId });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}>
        <div className={styles.info}>
          <h1 className={styles.title}>{TRANSLATES.title}</h1>
          <p className={styles.features}>{features}</p>
        </div>
        <img className={styles.image} src={TRANSLATES.imgSrc} alt="" />
      </div>

      <Tabs fullWidth defaultActiveTab={initialTab} onChange={handleChangeTab} tabs={TABS} />
    </div>
  );
};
