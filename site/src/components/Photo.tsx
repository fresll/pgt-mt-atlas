import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react'
import { asset } from '../lib/base'
import { useT } from '../i18n'

/**
 * Изображение из public/ с понятным сообщением при ошибке загрузки.
 * Ошибка могла произойти ещё до гидратации (обработчик onError тогда не сработает),
 * поэтому после монтирования состояние картинки проверяется явно.
 */
export function Photo({ path, ...img }: { path: string } & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'>) {
  const t = useT()
  const ref = useRef<HTMLImageElement>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (el && el.complete && el.naturalWidth === 0) setFailed(true)
  }, [])
  return (
    <>
      <img ref={ref} src={asset(path)} onError={() => setFailed(true)} onLoad={() => setFailed(false)} {...img} />
      {failed && (
        <span className="load-error" role="status">
          {t('common.imageError')}
        </span>
      )}
    </>
  )
}
