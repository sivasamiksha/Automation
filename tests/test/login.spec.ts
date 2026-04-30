
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../tests/page/LoginPage';

test('Valid Login', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('TTS_559', 'Sivanesan@1996');

  await expect(page).toHaveURL('/techmango.greythr.com/');
});