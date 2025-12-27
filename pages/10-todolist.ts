
import { Locator, Page, expect } from "@playwright/test";

//data interface



//POM
export class TodoListPage{

  protected readonly page: Page;
  protected itemNum: number;

  constructor(page: Page) {
    this.page = page;
    this.itemNum = 0;
  }

//page methods;

async createItem(itemName: string){

      await this.page.getByRole('button').filter({ hasText: /^add$/ }).click();
      await expect(this.page.getByPlaceholder('A task title #tag @16:00')).toHaveCount(1);

      await this.page.getByPlaceholder('A task title #tag @16:00').fill(itemName );
      await this.page.getByPlaceholder('A task title #tag @16:00').press('Enter');
      await this.page.getByPlaceholder('A task title #tag @16:00').press('Escape');

      await expect.soft(this.page.locator('.tour-undoneList').filter({'hasText': `${itemName}`}).filter({'has':this.page.locator('span.display-value')})).toHaveCount(1);
      await expect(this.page.locator('.tour-undoneList').filter({'hasText': `${itemName}`}).filter({'has':this.page.locator('span.display-value')})).toBeVisible();

      this.itemNum +=1;
}


async markItemDone(itemName: string){
  await this.page.getByText(`${itemName}`).first().hover();
  await this.page.getByRole('button', { name: 'Mark as done/undone [D]' }).click();

  await expect.soft(this.page.locator('.tour-doneList').filter({ hasText: `${itemName}` }).filter({'has':this.page.locator('span.display-value')})).toHaveCount(1);
  await expect(this.page.locator('.tour-doneList').filter({ hasText: `${itemName}` }).filter({'has':this.page.locator('span.display-value')})).toBeVisible();
}

async deleteItem(itemName: string){
  await expect(this.page.locator('span.display-value').filter({ hasText: `${itemName}` })).toHaveCount(1);

  await this.page.locator('span.display-value').filter({ hasText: `${itemName}` }).dispatchEvent('contextmenu');
  await this.page.getByText(/Delete Task/i).click();

  await expect.soft(this.page.locator('span.display-value').filter({ hasText: `${itemName}` })).toHaveCount(0);
  this.itemNum -=1;
}

//locators;

doneNum(): Locator {  
  return this.page.locator('.collapsible-title');
  
}   

}