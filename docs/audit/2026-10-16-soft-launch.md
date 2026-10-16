# Soft launch: публичный доступ без поисковой индексации

Постоянный адрес: https://atlas-larger-fonts-preview.elatedmink17.chatgpt.site/ru/

Доступ посетителей задаётся в Sites независимо от режима сборки. Для soft launch доступ — `public`, а HTML запрещает индексацию через `noindex, follow`.

Сборка из `site/`:

```sh
ATLAS_BASE=/ ATLAS_SOFT_LAUNCH=1 ATLAS_PUBLIC_LAUNCH=0 VITE_ATLAS_PRIVATE_PREVIEW=0 npm run build
```

`ATLAS_SOFT_LAUNCH=1` имеет приоритет над `ATLAS_PUBLIC_LAUNCH=1`: postbuild записывает `noindex, follow` непосредственно в статические HTML, удаляет прежний sitemap и создаёт `robots.txt` с `Allow: /`. Существующий счётчик включён через `VITE_ATLAS_PRIVATE_PREVIEW=0`. EN сохраняет существующие перенаправления на RU с noindex.

Sitemap в поисковые системы не отправлять, индексацию не запрашивать. Ни дизайн, ни научные данные для переключения режима менять не нужно.

## Последующее включение индексации

Только после отдельного разрешения куратора собрать новую ревизию:

```sh
ATLAS_BASE=/ ATLAS_SOFT_LAUNCH=0 ATLAS_PUBLIC_LAUNCH=1 ATLAS_CANONICAL_BASE=https://atlas-larger-fonts-preview.elatedmink17.chatgpt.site/ VITE_ATLAS_PRIVATE_PREVIEW=0 npm run build
```

Эта команда установит `index, follow` на RU-страницах, добавит canonical, sitemap и ссылку на него в robots.txt; счётчик останется включённым. Разместить сборку в том же проекте Sites `appgprj_6acc8e8743548191bdf16fd908a9db6c`, сохраняя публичный URL. Проверить отдаваемый HTML без cookies/авторизации и HTTP-заголовки, включая X-Robots-Tag. Публикация новой версии и действия в поисковых системах требуют отдельной команды; soft launch их не выполняет.
