### Psycho Help — React + Vite

### Быстрый старт

1. Установите зависимости:
```bash
npm i
```
2. Запустите дев-сервер:
```bash
npm run dev
```
3. Откройте ```http://localhost:3000.```

### Скрипты
```bash
- npm run dev: запуск Vite dev-сервера
- npm run build: типизация tsc -b и production-сборка в папку build
- npm run preview: локальный предпросмотр production-сборки
- npm run lint: проверка кода ESLint
```

### Линтинг и стиль

- ESLint: npm run lint
- Рекомендуется единый стиль форматирования (Prettier подключён в devDependencies)

### Сборка и предпросмотр
```bash
npm run build
npm run preview
```
Сборка попадает в build, предпросмотр запускает локальный сервер для проверки прод-версии.