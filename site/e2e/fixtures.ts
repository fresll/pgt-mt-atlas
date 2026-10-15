// Общие fixture для e2e: тесты не зависят от внешней сети.
// В index.html подключён счётчик GoatCounter (https://gc.zgo.at/count.js); в песочнице и CI без сети
// запрос к нему падает с console error. Во всех тестах скрипт счётчика подменяется пустым JS,
// а отправка просмотров (*.goatcounter.com) — пустым ответом. Импортируйте test и expect отсюда.
import { test as base, expect, type BrowserContext, type Route } from '@playwright/test'

export const COUNTER_SCRIPT = 'https://gc.zgo.at/count.js'
export const COUNTER_ENDPOINT = 'https://pgt-mt-atlas.goatcounter.com/count'

/** Подменяет внешний счётчик в контексте браузера (для контекстов, созданных в тесте вручную). */
export async function stubCounter(context: BrowserContext, script = '') {
  await context.route('https://gc.zgo.at/**', (route: Route) => route.fulfill({ status: 200, contentType: 'text/javascript', body: script }))
  await context.route('https://*.goatcounter.com/**', (route: Route) => route.fulfill({ status: 204, body: '' }))
}

export const test = base.extend<{ offlineCounter: void }>({
  offlineCounter: [
    async ({ context }, use) => {
      await stubCounter(context)
      await use()
    },
    { auto: true },
  ],
})

export { expect }
export type { Page } from '@playwright/test'
