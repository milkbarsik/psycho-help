import { test, expect } from '@playwright/test';

test('Проверка статей', async ({ page }) => {
  await page.goto('/resources');
  const cards = page.locator('[class*=articleList] > div');
  await expect(cards).toHaveCount(6);
  await page.getByRole('button', { name: 'Показать ещё' }).click();
  await expect(cards).toHaveCount(9);
  const navPromise = page.waitForURL(/\/article\/[a-z0-9-]+$/);
  await page.getByRole('link', { name: 'Читать' }).first().click();
  await navPromise;
  await expect(page).toHaveURL(/\/article\/[a-z0-9-]+$/);
});

test('Проверка тестов', async ({ page }) => {
  await page.goto('/resources');
  await page.getByRole('tab', { name: 'Тесты' }).click();
  const cards = page.getByTestId('test-card');
  await expect(cards).toHaveCount(6);
  const firstCard = cards.first();
  const navPromise = page.waitForURL(/\/test\/.*/);
  await firstCard.click();
  await navPromise;
  await expect(page).toHaveURL(/\/test\/.+/);
});
