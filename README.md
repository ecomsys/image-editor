## React image editor by Ecomsys

```bash
Image-Editor/
├── public/
│   ├── images/
│   │   └── home-bg.webp       # фон
│   │
│   ├── .htaccess              # правила доступа для апач
│   ├── preview.jpg            # OG-картинка 1200×630 (для соцсетей)
│   ├── site.webmanifest       # PWA манифест
│   ├── favicon.ico            # фавикон
│   └── ...                    # остальные фавикон
│
├── src/
│   ├── main.jsx                 # Точка входа: рендерит <AppProviders /> в #root
│   ├── index.css                # Глобальные стили + Tailwind директивы
│   │
│   ├── app/
│   │   ├── provider.jsx         # Обверка с autoREM и BrowserRouter
│   │   └── router.jsx           # Главный роутер
│   │
│   ├── pages/
│   │   ├── HomePage.jsx         # Страница загрузки: дроп-зона + кнопка "Выбрать файл"
│   │   └── EditorPage.jsx       # Страница редактора: хедер + инфо-бар + табы + сайдбар + превью
│   │
│   ├── components/
│   │   ├── EditorTabs.jsx       # Навигация: [Размер] [Обрезать] [Сжатие] [Конвертация] [Поворот] [Зеркало] [Ч/Б]
│   │   │
│   │   ├── ResizeTool.jsx       # Изменение размера: ввод ширины/высоты + пропорции
│   │   ├── CropControls.jsx     # Управление кропом: кнопки пропорций (1:1, 4:3, 16:9, свободно)
│   │   ├── CropPreview.jsx      # Область кропа: <ReactCrop> + большое превью
│   │   ├── CompressTool.jsx     # Сжатие: выбор WebP/JPG + слайдер качества + предпросмотр
│   │   ├── ConvertTool.jsx      # Конвертация: выбор формата + умные дефолты качества
│   │   ├── RotateTool.jsx       # Поворот: драг-мышкой + кнопка "Применить" + сброс угла
│   │   ├── MirrorTool.jsx       # Зеркало: кнопки "Горизонтально" / "Вертикально"
│   │   ├── BWTool.jsx           # Ч/Б фильтр: toggle "Применить" / "Вернуть цвет"
│   │   ├── ImageUploader.jsx    # загрузчик изображений
│   │   └── ImagePreview.jsx     # Превью + кнопки "Сбросить" / "Скачать" (с сохранением имени файла)
│   │
│   └── utils/
│       ├── fileUtils.js         # getFileInfoFromBase64(), formatBytes()
│       ├── auto-rem.js          # автомасштабирование
│       ├── resolvers.js         # базовые пути из переменной vite для проекта
│       └── imageUtils.js        # Все функции обработки: convertImageFormat, resizeImage, 
│
├── index.html                   # Мета-теги, SEO, OG, PWA, viewport-скрипт
├── package.json                 # Зависимости: react, react-router-dom, lucide-react, react-image-crop
├── README.md                    # Инструкция по запуску и деплою
├── tailwind.config.js           # Конфигурация Tailwind CSS
└── vite.config.js               # Настройки Vite + React plugin
```



# Как это работает ?

```bash
1. Пользователь загружает файл → HomePage.jsx
   │
2. FileReader читает файл → navigate('/editor', state)
   │
3. EditorPage.jsx инициализирует:
   ├── currentImage = state.image
   ├── originalInfo = state.originalInfo (name, size, format)
   └── activeTab = 'resize'
   │
4. Пользователь выбирает вкладку → setActiveTab()
   │
5. Инструмент в сайдбаре:
   ├── Получает: { image: currentImage, onApply: setCurrentImage }
   ├── Обрабатывает изображение через utils/imageUtils.js
   └── Вызывает onApply(newImage) → обновляет currentImage
   │
6. ImagePreview.jsx автоматически показывает обновлённое изображение
   │
7. Пользователь жмёт "Скачать" → файл с именем "оригинал-edited.формат"
```