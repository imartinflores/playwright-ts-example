 import { test, expect, chromium  } from '@playwright/test';

 const capabilities = {
    browserName: "Chrome", // Browsers allowed: `Chrome`, `MicrosoftEdge`, `pw-chromium`, `pw-firefox` and `pw-webkit`
    browserVersion: "latest",
    "LT:Options": {
      platform: "Windows 10",
      build: "Playwright Build",
      name: "Playwright Test",
      user: "your-user",
      accessKey: "your-key",
    },
  };

  test('Should add item to cart', async({})=>{
    const browser = await chromium.connect(
      `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
    )
    const page = await browser.newPage()
    await page.goto('https://ecommerce-playground.lambdatest.io/');  
    await page.locator("span.title", {hasText: 'Mega Menu' }).hover()
    await page.locator("a[title=Desktop]").click();
    await page.locator("div.carousel-item.active > img[title='HTC Touch HD']").click()
    await page.locator("#container button[title='Add to Cart']").click();
    await page.locator("a.btn.btn-primary.btn-block",{hasText: 'View Cart'}).click()
    try {
      await expect(page.locator("td.text-left", {hasText: 'HTC Touch   HD'})).toBeVisible()
      await expect(page.locator("div[class$='flex-nowrap'] >   input")).toHaveValue("1")

      // Mark the test as completed or failed
      await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'passed', remark: 'Item added' } })}`)
    } catch {
      await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'failed', remark: 'Item has not been added' } })}`)
    }
    await browser.close()
  })

 
  test(`Should add item to cart using API`, async({page})=>{
    const Url = 'https://ecommerce-playground.lambdatest.io/index.php/' ;
    await page.goto(Url);
    const response =await page.request.post(Url, {
      params:{
        route: "checkout/cart/add"
      },
      form: {
        product_id: 28,
        quantity: 1
      }
    })
    await page.goto(`${Url}?route=checkout/cart`)
    await expect(page.locator("td.text-left", {hasText: 'HTC Touch HD'})).toBeVisible()
    await expect(page.locator("div[class$='flex-nowrap'] > input")).toHaveValue("1")
})



