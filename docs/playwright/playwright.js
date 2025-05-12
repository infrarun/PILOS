const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false }); // Set to true to run in background
  const page = await browser.newPage();

  // Go to your target website
  await page.goto('https://pilos.thm.de');

  const loginLabelId = "pv_id_5_0";
  await expect(page.getByRole("menuitem", { id: loginLabelId })).toBeVisible();
  await page.locator("[]")
  await page.waitForSelector(loginLabelId, (id) => {
    const link = document.getElementById(id);
    link.style.outline = '4px solid red';
  }, loginLabelId);

  // Annotate input fields that have aria-labels
/*
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll(input[aria-label]'));
    inputs.forEach((input, index) => {
      const labelText = input.getAttribute('aria-label');
      const label = document.createElement('div');
      label.textContent = `${index + 1}. ${labelText}`;
      Object.assign(label.style, {
        position: 'absolute',
        top: `${input.offsetTop - 20}px`,
        left: `${input.offsetLeft}px`,
        backgroundColor: 'blue',
        color: 'white',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
        zIndex: 10000,
        pointerEvents: 'none'
      });
      input.parentElement.style.position = 'relative';
      input.parentElement.appendChild(label);
    });
  });
*/
  // Give time for changes to render
  await page.waitForTimeout(500);

  // Take screenshot
  await page.screenshot({ path: 'screenshot_aria.png', fullPage: true });

  await browser.close();
})();
