import { Page, Locator } from '@playwright/test';

export class EmaraLoginPage {
  readonly page: Page;
  readonly loginTrigger: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginTrigger = page.locator('a.login-btn').first();
    this.emailInput = page.locator('#loginemail');
    this.passwordInput = page.locator('#loginpassword');
    this.submitButton = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await this.page.goto('https://uat.emara-academy.com/language-change/en');
  }

  async login(email: string, password: string) {
    await this.loginTrigger.click();
    await this.emailInput.waitFor({ state: 'visible' });
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForURL('**/myaccount/**');
  }
}
