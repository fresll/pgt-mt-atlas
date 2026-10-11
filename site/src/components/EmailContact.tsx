import { useState } from 'react'
import { useT } from '../i18n'

/** Адрес для ручного копирования и подсказка на случай, если почтовая программа не настроена. */
export function EmailCopy({ email }: { email: string }) {
  const t = useT()
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setState('copied')
    } catch {
      setState('failed')
    }
  }
  return (
    <span className="email-copy">
      <code className="email-address" translate="no">{email}</code>{' '}
      <button type="button" className="ghost" onClick={copy}>
        {t('contact.copy')}
      </button>{' '}
      <span className="small" role="status">
        {state === 'copied' ? t('contact.copied') : state === 'failed' ? t('contact.copyFailed') : ''}
      </span>
    </span>
  )
}
