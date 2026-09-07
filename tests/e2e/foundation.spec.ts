import { test, expect } from '@playwright/test';
for (const [port,title] of [[3000,'به فروشگاه خوش آمدید'],[4200,'پنل فروشنده'],[4300,'مدیریت پلتفرم']] as const) {
 test('app '+port+' renders in both directions',async({page})=>{await page.goto('http://localhost:'+port);await expect(page.getByRole('heading',{name:title})).toBeVisible();await expect(page.locator('html')).toHaveAttribute('dir','rtl');await page.evaluate(()=>document.documentElement.dir='ltr');await expect(page.getByRole('heading',{name:title})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);});
}
test('API health',async({request})=>{const response=await request.get('http://localhost:3001/api/health');expect(response.ok()).toBe(true);expect(await response.json()).toEqual({status:'ok',service:'api'});});

