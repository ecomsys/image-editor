// src/components/ImageUploader.jsx
import { Upload } from 'lucide-react'

export default function ImageUploader({ onImageLoad }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => onImageLoad(event.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => onImageLoad(event.target.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Простой заголовок */}
      <header className="w-full py-4 px-6 bg-white border-b">
        <h1 className="text-xl font-bold text-gray-800">Image Editor</h1>
      </header>

      {/* Кнопка по центру экрана */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div 
          className="w-full max-w-md p-10 text-center bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 hover:border-blue-500 transition cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <label className="flex flex-col items-center gap-4 cursor-pointer">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-800">Выберите изображение</p>
              <p className="text-sm text-gray-500 mt-1">или перетащите файл сюда</p>
            </div>
            <span className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
              Загрузить
            </span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="hidden" 
            />
          </label>
        </div>
      </main>

    </div>
  )
}