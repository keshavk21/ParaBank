import { expect,Page, Locator } from "@playwright/test";

export class Login{
    page:Page
    userName:Locator
    password:Locator
    login:Locator

    constructor(page:Page){
        this.page=page
        this.userName=page.locator('//input[@name="username"]')
        this.password=page.locator('//input[@name="password"]')
        this.login=page.locator('//input[@value="Log In"]')
    }

    async loginUser(userData:any){
        await this.userName.fill(userData.userName)
        await this.password.fill(userData.password)
        await this.login.click()
        // await expect(this.page.locator('//p[@class="smallText"]/b')).toContainText("Welcome")
    }
}