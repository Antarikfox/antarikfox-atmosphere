# Публикация репозитория

Рекомендуемое имя: **antarikfox-atmosphere**. Оно совпадает с JS-файлом в dist, что требуется для HACS Dashboard.

## Создание на GitHub

1. Войди в GitHub под `Antarikfox`.
2. Создай **Public**-репозиторий `antarikfox-atmosphere`. Не включай создание README, .gitignore и лицензии: они уже подготовлены здесь.
3. Если файлы загружает помощница через подключение GitHub, пришли ссылку на пустой репозиторий.
4. Если загружаешь с компьютера, открой папку проекта и выполни:

```sh
git init -b main
git add .
git commit -m "Prepare Atmosphere public beta"
git remote add origin https://github.com/Antarikfox/antarikfox-atmosphere.git
git push -u origin main
```

Если локальная копия уже инициализирована, повторять git init и первый commit не нужно. Проверь remote перед добавлением; существующий remote автоматически не перезаписывай.

Описание репозитория:

> Animated temperature and humidity card for Home Assistant — graphite instrument, living fog, configurable rooms and sensors. by Antarikfox.

Темы GitHub: `home-assistant`, `lovelace`, `custom-card`, `hacs`, `temperature`, `humidity`.

Если имя или владелец отличаются, обнови URL в README и в этой инструкции. Для HACS само имя репозитория должно совпадать с именем JS-файла; не добавляй суффикс `-card` без соответствующего переименования сборки и hacs.json.

## Перед первым анонсом

1. Дождись успешного workflow **Checks** на GitHub.
2. Установи карточку в HA как пользовательский HACS-репозиторий, выбери свои датчики и проверь окна на реальном устройстве.
3. Создай GitHub Release с тегом `v2.0.1-beta.1`, отметь **Pre-release**. Текст можно взять из CHANGELOG.md. После публикации workflow добавит собранный JS и вариант `.js.txt` в файлы релиза.
4. Для онлайн-демо открой Settings → Pages, выбери публикацию из ветки `main`, папка `/docs`. Страница начнёт работать после успешного развёртывания Pages.
5. В Telegram/Пикабу размести короткое видео и ссылку на репозиторий. Текст анонса есть в `docs/announcement-ru.md`.

Принятие в стандартный каталог HACS — отдельный шаг после тестирования публичной беты. Подготовка hacs.json не означает автоматического включения в каталог.
