export const ResourceEntities = {
  ARTICLES: 'articles',
  TESTS: 'tests',
  POLLS: 'polls',
} as const;

export type TResourceEntity = (typeof ResourceEntities)[keyof typeof ResourceEntities];

// Ключ sessionStorage, в котором хранится последняя открытая вкладка
export const RESOURCES_ENTITY_STORAGE_KEY = 'resources-last-entity';
