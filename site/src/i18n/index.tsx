import { plural } from '../lib/format'
import { createInstance, type i18n as I18n } from 'i18next'
import { createContext, useContext, type ReactNode } from 'react'
import { I18nextProvider, initReactI18next, useTranslation } from 'react-i18next'
import type { Lang } from '../data/atlas'
import en from './en'
import ru from './ru'
import es from './es'

export const LANGS: Lang[] = ['en', 'ru', 'es']

// По экземпляру i18next на язык: при статической генерации страницы разных языков
// рендерятся последовательно, и общий экземпляр со сменой языка дал бы гонку.
const instances = Object.fromEntries(
  LANGS.map((lng) => {
    const inst = createInstance()
    inst.use(initReactI18next).init({
      lng,
      fallbackLng: 'en',
      resources: { en: { translation: en }, ru: { translation: ru }, es: { translation: es } },
      interpolation: { escapeValue: false },
      initAsync: false,
    })
    return [lng, inst]
  }),
) as Record<Lang, I18n>

const LangContext = createContext<Lang>('en')

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <LangContext.Provider value={lang}>
      <I18nextProvider i18n={instances[lang]}>{children}</I18nextProvider>
    </LangContext.Provider>
  )
}

export function useLang(): Lang {
  return useContext(LangContext)
}

export function useT() {
  const { t } = useTranslation()
  return t
}

export function useCountWord() {
  const t = useT()
  const lang = useLang()
  return (n: number, key: string) => plural(n, lang, t(`countWords.${key}`, { returnObjects: true }) as unknown as [string, string, string])
}
