import { test, expect } from '@playwright/test';
for (const [port, persian, english] of [
  [3100, 'به فروشگاه خوش آمدید', 'Welcome to the store'],
  [
    Number(process.env.E2E_MERCHANT_PORT ?? 4200),
    'پنل فروشنده',
    'Merchant panel',
  ],
  [4300, 'مدیریت پلتفرم', 'Platform administration'],
] as const) {
  test(`app ${port} switches language and persists preference`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`http://localhost:${port}`);
    await expect(page).toHaveURL(new RegExp('/fa$'));
    await expect(page.getByRole('heading', { name: persian })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await page.getByRole('combobox', { name: 'زبان' }).selectOption('en');
    await expect(page).toHaveURL(new RegExp('/en$'));
    await expect(page.getByRole('heading', { name: english })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page).toHaveTitle(port === 3100 ? 'Store' : english);
    await page.goto(`http://localhost:${port}`);
    await expect(page).toHaveURL(new RegExp('/en$'));
    await expect(page.getByRole('heading', { name: english })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.goto(`http://localhost:${port}/en/missing?from=test#section`);
    await expect(
      page.getByRole('heading', { name: 'Page not found' }),
    ).toBeVisible();
    await page.getByRole('combobox', { name: 'Language' }).selectOption('fa');
    await expect(page).toHaveURL(
      new RegExp('/fa/missing\\?from=test#section$'),
    );
    await expect(
      page.getByRole('heading', { name: 'صفحه پیدا نشد' }),
    ).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });
}
test('storefront English is server-rendered', async ({ request }) => {
  const response = await request.get('http://localhost:3100/en');
  const html = await response.text();
  expect(html).toContain('lang="en"');
  expect(html).toContain('dir="ltr"');
  expect(html).toContain('Welcome to the store');
  expect(html).toContain('<title>Store</title>');
});
test('API health', async ({ request }) => {
  const response = await request.get('http://localhost:3101/api/health');
  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual({ status: 'ok', service: 'api' });
});
