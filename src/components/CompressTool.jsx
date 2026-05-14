// src/components/CompressTool.jsx
import { useState } from 'react'

export default function CompressTool({ image, onApply }) {
  const [loading, setLoading] = useState(false)
  const [format, setFormat] = useState('image/webp') // webp | jpeg
  const [quality, setQuality] = useState(0.85)
  const [originalSize, setOriginalSize] = useState(null)
  const [compressedSize, setCompressedSize] = useState(null)
  const [result, setResult] = useState(null)

  // Форматирование байтов
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Б'
    const k = 1024
    const sizes = ['Б', 'КБ', 'МБ']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Получение размера base64
  const getSizeFromBase64 = (base64) => {
    const padding = (base64.match(/=/g) || []).length
    return Math.floor((base64.length * 3) / 4) - padding
  }

  const handleCompress = async () => {
    setLoading(true)
    try {
      const beforeSize = getSizeFromBase64(image)
      setOriginalSize(beforeSize)

      // Сжатие через Canvas (WebP/JPEG поддерживают quality)
      const compressedDataUrl = await new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
          resolve(canvas.toDataURL(format, quality))
        }
        img.src = image
      })

      const afterSize = getSizeFromBase64(compressedDataUrl)
      setCompressedSize(afterSize)
      setResult(compressedDataUrl)
    } catch (err) {
      console.error('Compress error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    if (result) {
      onApply(result)
      setResult(null)
      setOriginalSize(null)
      setCompressedSize(null)
    }
  }

  const savings = originalSize && compressedSize
    ? Math.round((1 - compressedSize / originalSize) * 100)
    : 0

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-800">Сжатие</h3>
      
      {/* Выбор формата */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Формат
        </label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none bg-white"
        >
          <option value="image/webp">WebP</option>
          <option value="image/jpeg">JPG</option>
        </select>
      </div>

      {/* Регулятор качества */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Качество</label>
          <span className="text-sm text-blue-600 font-medium">{Math.round(quality * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.3"
          max="1"
          step="0.01"
          value={quality}
          onChange={(e) => setQuality(parseFloat(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Меньше размер</span>
          <span>Лучше качество</span>
        </div>
      </div>

      {/* Результаты */}
      {originalSize && compressedSize && (
        <div className={`p-3 rounded-lg border ${
          savings > 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
        }`}>
          <p className={`text-sm font-medium ${savings > 0 ? 'text-green-800' : 'text-yellow-800'}`}>
            {savings > 0 ? '✅' : '⚠️'} {formatBytes(originalSize)} → {formatBytes(compressedSize)}
          </p>
          {savings > 0 && (
            <p className="text-xs text-green-600 mt-1">Экономия: {savings}%</p>
          )}
        </div>
      )}

      {/* Кнопки */}
      <div className="flex gap-2">
        <button
          onClick={handleCompress}
          disabled={loading}
          className="cursor-pointer w-full px-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
        >
          {loading ? 'Обработка...' : 'Предпросмотр'}
        </button>
        {result && (
          <button
            onClick={handleApply}
            className="cursor-pointer w-full px-2 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
          >
            Применить
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        {format === 'image/webp'
          ? 'WebP'
          : 'JPG'
        }
      </p>
    </div>
  )
}