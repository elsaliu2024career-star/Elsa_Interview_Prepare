//11:16

import {test,expect} from '@playwright/test'
import { TodoListPage } from '../pages/10-todolist';
import { todo } from 'node:test';

test.describe('test the todo app', ()=>{

    //data setup
	const URLs = {
        todoHomePage: 'https://app.super-productivity.com/#/tag/TODAY/tasks',
    };
    const todoItems = ['task1','task2','task3'];
    var todoListPage: TodoListPage
	

    //navigation/setup
	test.beforeEach(async({page})=>{
        await page.goto(URLs.todoHomePage);
        await page.getByRole('button', { name: 'Close Tour' }).click();
        todoListPage = new TodoListPage(page);
    });
	
	

    //happy path test

    test('the todo list functionality',async({page})=>{
        

        await test.step('create todo items',async()=>{
            for(let i=0; i<todoItems.length; i++){
                await todoListPage.createItem(todoItems[i]);
            };


        });



        await test.step('mark the item as done',async()=>{
            for(let i=0; i<todoItems.length; i++){
            await todoListPage.markItemDone(todoItems[i]);
            };
        });
        


        await test.step('verify the item is marked as done',async()=>{
            await expect(todoListPage.doneNum()).toBeVisible();
        });

        await test.step('delete todo items',async()=>{
            for(let i=0; i<todoItems.length; i++){
            await todoListPage.deleteItem(todoItems[i]);
            };

            await todoListPage.doneNum().waitFor({state:'detached'});
            await expect(todoListPage.doneNum()).toBeHidden();
        });


    });
	

    //edge case test
    // test('2',async({page})=>{
		
	
	// });





    


});