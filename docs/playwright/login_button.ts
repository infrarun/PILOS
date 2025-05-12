import { chromium, Page, devices } from 'playwright';

type ColorScheme = null | "light" | "dark" | "no-preference";

declare global {
  interface Window {
    createBorderHighlight: (el: HTMLElement) => void;
    createStyledFloatingLabel: (el: HTMLElement, text: string) => void;
  }
}

function createBorderHighlight(el: HTMLElement): void {
  el.style.border = '4px solid red';
  el.style.borderRadius = '4px';
  el.style.boxSizing = 'border-box';
}

function createStyledFloatingLabel(el: HTMLElement, text: string): void {
  if (!el) return;

  const label = document.createElement('div');
  label.textContent = text;

  Object.assign(label.style, {
    position: 'absolute',
    top: `${el.offsetTop - 20}px`,
    left: `${el.offsetLeft}px`,
    backgroundColor: 'blue',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    zIndex: 10000,
    pointerEvents: 'none'
  });

  document.body.appendChild(label);
}

async function recordLoginPage(page: Page) : Promise<Page> {
  await page.goto('https://pilos.thm.de');
  const button = page.locator('[id="pv_id_4_0"]');
  await button.waitFor({ state: 'visible' });
  await button.evaluate((el: HTMLElement) => {
    window.createBorderHighlight(el);
    window.createStyledFloatingLabel(el, "1");
  });
  return page;
}

(async () => {
  const browser = await chromium.launch({ headless: false });

  const colorSchemes: ColorScheme[] = ["light", "dark"];
  const locales = ["en", "de"];

  for (const locale of locales ) {
    for (const colorScheme of colorSchemes ) {
      const context = await browser.newContext({
        ...devices['Desktop Chrome HiDPI'],
        isMobile: false,
        colorScheme: colorScheme,
        locale: locale
      });
      const page: Page = await context.newPage();
      await page.addInitScript(`
        window.createBorderHighlight = ${createBorderHighlight.toString()};
        window.createStyledFloatingLabel = ${createStyledFloatingLabel.toString()};
      `);

      const rect = await recordLoginPage(page);
      await rect.screenshot({ path: `${locale}/login-button-${colorScheme}.png`, fullPage: false });
      await context.close();
    }
  }
  await browser.close();
})();
