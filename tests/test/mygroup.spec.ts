import { test, expect } from '@playwright/test';
import { MyGroupPage } from '../page/MyGroupPage';
import { EmaraLoginPage } from '../page/EmaraLoginPage';

test.use({
  httpCredentials: {
    username: process.env.HTTP_USERNAME ?? 'emaraacademy',
    password: process.env.HTTP_PASSWORD ?? 'Emara@2025',
  },
});

test.describe('My Group Page - UI Validation', () => {
  let myGroupPage: MyGroupPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new EmaraLoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env.APP_EMAIL ?? 'sivaneshan@yopmail.com',
      process.env.APP_PASSWORD ?? 'Test@123'
    );

    myGroupPage = new MyGroupPage(page);
    await myGroupPage.goto();
  });

  test.describe('Page Header', () => {
    test('should display group name heading', async () => {
      await expect(myGroupPage.groupTitle).toBeVisible();
      await expect(myGroupPage.groupTitle).toHaveText('selva');
    });

    test('should display Add Member button as enabled', async () => {
      await expect(myGroupPage.addMemberButton).toBeVisible();
      await expect(myGroupPage.addMemberButton).toBeEnabled();
    });

    test('should display Remove button as visible', async () => {
      await expect(myGroupPage.removeButton).toBeVisible();
    });
  });

  test.describe('Member Table - Headers', () => {
    test('should display all column headers in correct order', async () => {
      const expectedHeaders = ['Name', 'Email', 'Phone', 'Date', 'Action'];

      for (let i = 0; i < expectedHeaders.length; i++) {
        // offset by 1 to skip the checkbox column (th index 0)
        await expect(myGroupPage.tableHeaderCells.nth(i + 1)).toContainText(expectedHeaders[i]);
      }
    });

    test('should display checkbox column in table header', async () => {
      const checkboxHeader = myGroupPage.tableHeaderCells.first();
      await expect(checkboxHeader).toBeVisible();
      await expect(checkboxHeader.locator('input[type="checkbox"]')).toBeVisible();
    });
  });

  test.describe('Member Table - Data Row', () => {
    test('should display at least one member in the table', async () => {
      const count = await myGroupPage.getMemberCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should display correct member name', async () => {
      // td[0] = checkbox, td[1] = Name
      await expect(myGroupPage.getMemberCell(0, 1)).toHaveText('siva nesan');
    });

    test('should display correct member email', async () => {
      await expect(myGroupPage.getMemberCell(0, 2)).toHaveText('sivaselvansam@yopmail.com');
    });

    test('should display correct member phone number', async () => {
      await expect(myGroupPage.getMemberCell(0, 3)).toHaveText('1-2846364979');
    });

    test('should display correct member date', async () => {
      await expect(myGroupPage.getMemberCell(0, 4)).toHaveText('06-01-2026');
    });

    test('should display row-level checkbox for each member', async () => {
      const rowCheckbox = myGroupPage.getMemberRow(0).locator('input[type="checkbox"]');
      await expect(rowCheckbox).toBeVisible();
    });
  });

  test.describe('Member Table - Action Buttons', () => {
    test('should display two action buttons per row', async () => {
      await expect(myGroupPage.getActionElements(0)).toHaveCount(2);
    });

    test('should display view (eye) action button', async () => {
      await expect(myGroupPage.getViewButton(0)).toBeVisible();
      await expect(myGroupPage.getViewButton(0)).toBeEnabled();
    });

    test('should display delete (trash) action button', async () => {
      await expect(myGroupPage.getDeleteButton(0)).toBeVisible();
      await expect(myGroupPage.getDeleteButton(0)).toBeEnabled();
    });
  });

  test.describe('Notes Section', () => {
    test('should display Notes heading', async () => {
      await expect(myGroupPage.notesHeading).toBeVisible();
    });

    test('should display terms and conditions link', async () => {
      await expect(myGroupPage.termsLink).toBeVisible();
    });

    test('should display maximum member limit note', async () => {
      await expect(myGroupPage.noteMaxMembers).toBeVisible();
    });

    test('should display remove member policy note', async () => {
      await expect(myGroupPage.noteRemovePolicy).toBeVisible();
    });

    test('should display group creation limit note', async () => {
      await expect(myGroupPage.noteGroupLimit).toBeVisible();
    });

    test('should display all four note items', async ({ page }) => {
      // Scope to the card-body that contains the Note: heading
      const notesCard = page.locator('.card-body').filter({ has: page.locator('h4 b').filter({ hasText: 'Note:' }) });
      const noteItems = notesCard.locator('p.font-xsss');
      await expect(noteItems).toHaveCount(4);
    });
  });
});
