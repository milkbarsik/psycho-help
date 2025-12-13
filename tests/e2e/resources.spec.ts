import { test, expect } from '@playwright/test';

test('Проверка статей', async ({ page }) => {
  await page.goto('/resources');
  const cards = page.locator('[class*=articleList] > div');
  await expect(cards).toHaveCount(5);
  await page.getByRole('button', { name: 'Показать ещё' }).click();
  const newCount = await cards.count();
  expect(newCount).toBeGreaterThan(5);
  const navPromise = page.waitForURL(/\/article\/1/);
  await page.getByRole('button', { name: 'Читать' }).first().click();
  await navPromise;
  await expect(page).toHaveURL(/\/article\/1$/);
});

test('Проверка тестов', async ({ page }) => {
  await page.goto('/resources');
  await page.getByRole('tab', { name: 'Тесты' }).click();
  const cards = page.getByTestId('test-card');
  await expect(cards).toHaveCount(5);
  await page.getByTestId('show-more-tests').click();
  const count = await cards.count();
  expect(count).toBeGreaterThan(5);
  const firstCard = cards.first();
  const navPromise = page.waitForURL(/\/test\/.*/);
  await firstCard.click();
  await navPromise;
  await expect(page).toHaveURL(/\/test\/.+/);
});
