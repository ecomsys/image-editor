src/
├── App.jsx                 # Главный роутер: Upload → Editor (с вкладками)
├── pages/
│   ├── HomePage.jsx     # Страница загрузки
│   └── EditorPage.jsx   # Страница редактора
├── components/
│   ├── EditorTabs.jsx      # Навигация по вкладкам
│   ├── ResizeTool.jsx      # Инструмент: Размер
│   ├── CompressTool.jsx    # Инструмент: Сжатие
│   ├── ConvertTool.jsx     # Инструмент: Конвертация
│   └── ImagePreview.jsx    # Общий блок превью + скачивание
└── utils/
    └── imageUtils.js       # Твои функции (оставляем как есть)