import { Page, Locator } from '@playwright/test';

export class MyGroupPage {
  readonly page: Page;

  readonly groupTitle: Locator;
  readonly addMemberButton: Locator;
  readonly removeButton: Locator;

  readonly table: Locator;
  readonly tableHeaderCells: Locator;
  readonly memberRows: Locator;

  readonly notesHeading: Locator;
  readonly termsLink: Locator;
  readonly noteMaxMembers: Locator;
  readonly noteRemovePolicy: Locator;
  readonly noteGroupLimit: Locator;

  constructor(page: Page) {
    this.page = page;

    // heading is an h2 with class courses-title — two headings named 'selva' exist on page
    this.groupTitle = page.locator('h2.courses-title').filter({ hasText: 'selva' });
    // Add Member and Remove are <a> tags styled as buttons
    this.addMemberButton = page.locator('a.btn').filter({ hasText: 'Add Member' });
    this.removeButton = page.locator('a.btn').filter({ hasText: 'Remove' });

    this.table = page.locator('table');
    this.tableHeaderCells = page.locator('table thead th');
    this.memberRows = page.locator('table tbody tr');

    // Note: heading is <h4><b>Note:</b></h4> — avoid matching hidden modal duplicate
    this.notesHeading = page.locator('h4 b').filter({ hasText: 'Note:' });
    this.termsLink = page.getByRole('link', { name: 'Please read the terms and conditions related to the groups' });
    // Note items are <p> elements, not <li>
    this.noteMaxMembers = page.getByText('Maximum member in a group - 5');
    this.noteRemovePolicy = page.getByText('Removing a group member is possible once in a year.');
    this.noteGroupLimit = page.getByText('The user can create 1 group and join 1 group.');
  }

  async goto() {
    await this.page.goto('https://uat.emara-academy.com/myaccount/mygroup', { waitUntil: 'domcontentloaded' });
  }

  getMemberRow(rowIndex: number): Locator {
    return this.memberRows.nth(rowIndex);
  }

  getMemberCell(rowIndex: number, cellIndex: number): Locator {
    return this.memberRows.nth(rowIndex).locator('td').nth(cellIndex);
  }

  // View button is an <a> tag; delete button is a <button>
  getViewButton(rowIndex: number): Locator {
    return this.memberRows.nth(rowIndex).locator('a.group-view-icon');
  }

  getDeleteButton(rowIndex: number): Locator {
    return this.memberRows.nth(rowIndex).locator('button');
  }

  // Returns all interactive action elements (1 <a> + 1 <button>) in a row
  getActionElements(rowIndex: number): Locator {
    return this.memberRows.nth(rowIndex).locator('a.group-view-icon, button');
  }

  async getMemberCount(): Promise<number> {
    return await this.memberRows.count();
  }
}
