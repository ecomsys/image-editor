// src/components/ConvertTool.jsx
import { useState } from 'react'
import { convertImageFormat } from '../utils/imageUtils'

const DEFAULT_QUALITY = {
  'image/jpeg': 0.82,
  'image/webp': 0.82,      // Легкий режим по умолчанию
  'image/webp-hq': 1.0,    // Качественный режим (внутренний ключ)
  'image/png': 1.0,
}

export default function ConvertTool({ image, onApply }) {
  const [format, setFormat] = useState('image/webp')
  const [webpMode, setWebpMode] = useState('light') // 'light' | 'hq'
  const [loading, setLoading] = useState(false)

  const handleApply = async () => {
    setLoading(true)
    try {
      // Определяем реальный формат и качество
      let targetFormat = format
      let quality = DEFAULT_QUALITY[format]

      // Если выбран WebP с режимом качества — подменяем ключ
      if (format === 'image/webp') {
        quality = webpMode === 'hq' ? 1.0 : 0.82
      }

      const res = await convertImageFormat(image, targetFormat, quality)
      onApply(res)
    } finally {
      setLoading(false)
    }
  }

  const formatHint = {
    'image/webp': webpMode === 'hq' 
      ? 'Без потерь, максимальное качество' 
      : 'Малый вес, оптимально для веба',
    'image/jpeg': 'Фото: сжатие с потерями, малый вес',
    'image/png': 'Логотипы: прозрачность, без потерь',
  }

  return (
    <div className="space-y-5">
      <h3 className="font-semibold text-lg text-gray-800">Конвертировать формат</h3>
      
      <div className="space-y-4">
        {/* Выбор формата */}
        <div>
          <select 
            value={format} 
            onChange={e => setFormat(e.target.value)} 
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none bg-white"
          >
            <option value="image/webp">WebP</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>            
          </select>
          <p className="text-xs text-gray-500 mt-1.5 ml-1">
            {formatHint[format]}
          </p>
        </div>

        {/* Режим качества для WebP */}
        {format === 'image/webp' && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <label className="flex items-center gap-2 cursor-pointer flex-1">
              <input 
                type="radio" 
                name="webpMode" 
                checked={webpMode === 'light'} 
                onChange={() => setWebpMode('light')}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700">Легкий</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer flex-1">
              <input 
                type="radio" 
                name="webpMode" 
                checked={webpMode === 'hq'} 
                onChange={() => setWebpMode('hq')}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700">Качественный</span>
            </label>
          </div>
        )}
      </div>

      <button 
        onClick={handleApply} 
        disabled={loading} 
        className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50"
      >
        {loading ? 'Конвертация...' : 'Конвертировать'}
      </button>
    </div>
  )
}