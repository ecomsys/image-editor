import { useState, useEffect } from 'react'
import { resizeImage } from '../utils/imageUtils'

export default function ResizeTool({ image, onApply }) {
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [lockRatio, setLockRatio] = useState(true)
  const [loading, setLoading] = useState(false)
  const [imgDimensions, setImgDimensions] = useState({ w: 0, h: 0 })

  // Запоминаем оригинальные размеры при загрузке нового изображения
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImgDimensions({ w: img.width, h: img.height })
      setWidth(img.width.toString())
      setHeight(img.height.toString())
    }
    img.src = image
  }, [image])

  const handleWidthChange = (val) => {
    setWidth(val)
    if (lockRatio && imgDimensions.w) {
      setHeight(Math.round((val / imgDimensions.w) * imgDimensions.h).toString())
    }
  }

  const handleHeightChange = (val) => {
    setHeight(val)
    if (lockRatio && imgDimensions.h) {
      setWidth(Math.round((val / imgDimensions.h) * imgDimensions.w).toString())
    }
  }

  const handleApply = async () => {
    setLoading(true)
    try {
      const res = await resizeImage(image, parseInt(width) || null, parseInt(height) || null)
      onApply(res)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <h3 className="font-semibold text-lg text-gray-800">Изменить размер</h3>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <label className="w-16 text-sm font-medium text-gray-600">Width</label>
          <input type="number" value={width} onChange={e => handleWidthChange(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-300 outline-none" placeholder="px" />
        </div>
        <div className="flex items-center gap-3">
          <label className="w-16 text-sm font-medium text-gray-600">Height</label>
          <input type="number" value={height} onChange={e => handleHeightChange(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-300 outline-none" placeholder="px" />
        </div>
        
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input type="checkbox" checked={lockRatio} onChange={() => setLockRatio(!lockRatio)} className="rounded border-slate-300" />
          Сохранять пропорции
        </label>
      </div>

      <button onClick={handleApply} disabled={loading || !width || !height} className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? 'Обработка...' : 'Применить размер'}
      </button>
    </div>
  )
}