// src/components/BWTool.jsx
import { useState } from 'react'
import { toBlackAndWhite } from '../utils/imageUtils'

export default function BWTool({ image, onApply }) {
  const [loading, setLoading] = useState(false)
  const [isBW, setIsBW] = useState(false)
  const [preBWImage, setPreBWImage] = useState(null)

  const handleToggle = async () => {
    if (isBW) {
      // Отменяем: возвращаем изображение до Ч/Б
      if (preBWImage) {
        onApply(preBWImage)
        setIsBW(false)
        setPreBWImage(null)
      }
    } else {
      // ⚫ Применяем Ч/Б
      setLoading(true)
      try {
        setPreBWImage(image) // Сохраняем текущее состояние
        const result = await toBlackAndWhite(image)
        onApply(result)
        setIsBW(true)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-800">Чёрно-белый</h3>
      
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`cursor-pointer border border-slate-400 hover:opacity-75 w-full px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2 ${
          isBW 
            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 ' 
            : 'bg-gray-800 text-white hover:bg-gray-900'
        }`}
      >
        {loading ? (
          'Обработка...'
        ) : isBW ? (
          <>Вернуть цвет</>
        ) : (
          <>Применить Ч/Б</>
        )}
      </button>
      
      <p className="text-xs text-gray-400 text-center">
        {isBW ? 'Нажми ещё раз, чтобы отменить' : 'Конвертирует в оттенки серого'}
      </p>
    </div>
  )
}