import { Button } from '@/shared/ui';
import { LeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { asArray } from '@/shared/lib/coerce';
import styles from './ArticlePage.module.scss';
import { TRANSLATES as t } from './constants';
import { mockArticlePageData } from './mocks';
import type { TArticleContentItem } from './models';

const parseContentData = (item: TArticleContentItem | null | undefined, index: number | string) => {
  if (!item) {
    return null;
  }

  const key = `article-content-${item.type}-${index}`;

  switch (item.type) {
    case 'p':
      return <p key={key}>{item.data}</p>;

    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6': {
      const Tag = item.type;
      return <Tag key={key}>{item.data}</Tag>;
    }

    case 'image':
      return item.src ? (
        <div className={styles.imageWrapper} key={key}>
          <img src={item.src} alt={item.alt} />
        </div>
      ) : null;
    case 'ul':
    case 'ol': {
      const ListTag = item.type;
      return (
        <ListTag key={key} className={styles.list}>
          {asArray(item.items).map((listItem, listIndex) => (
            <li key={`${key}-${listIndex}`}>{listItem}</li>
          ))}
        </ListTag>
      );
    }
    case 'block':
      return (
        <div className={styles.block} key={key}>
          {asArray(item.data).map((blockItem, blockIndex) =>
            parseContentData(blockItem, `${key}-${blockIndex}`),
          )}
        </div>
      );

    default:
      return null;
  }
};

export const ArticlePage = () => {
  const data = mockArticlePageData;

  if (!data) {
    return <div className={styles.wrapper}>{t.notFound}</div>;
  }

  const date = dayjs(data.date);

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <Link to="/resources" className={styles.backButton}>
          <LeftOutlined aria-hidden />
          {t.materials}
        </Link>

        <div className={styles.info}>
          {date.isValid() && <p className={styles.date}>{date.format('DD.MM.YYYY')}</p>}
          {data.author && <p className={styles.author}>{data.author}</p>}
        </div>
      </div>
      {data.title && <h1 className={styles.title}>{data.title}</h1>}
      <div className={styles.content}>{asArray(data.content).map(parseContentData)}</div>

      <Button
        className={styles.bottomBtn}
        icon={<LeftOutlined aria-hidden />}
        variant="secondary"
        to="/resources"
      >
        {t.other}
      </Button>
    </div>
  );
};
