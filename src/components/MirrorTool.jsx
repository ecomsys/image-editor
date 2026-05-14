// src/components/MirrorTool.jsx
import { useState } from 'react'
import { mirrorImage } from '../utils/imageUtils'

export default function MirrorTool({ image, onApply }) {
  const [loading, setLoading] = useState(false)

  const handleMirror = async (direction) => {
    setLoading(true)
    try {
      const result = await mirrorImage(image, direction)
      onApply(result)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-800">Зеркало</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleMirror('horizontal')}
          disabled={loading}
          className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200  border border-slate-300  rounded-lg font-medium transition disabled:opacity-50"
        >
          ↔ Гориз.
        </button>
        <button
          onClick={() => handleMirror('vertical')}
          disabled={loading}
          className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200  border border-slate-300  rounded-lg font-medium transition disabled:opacity-50"
        >
          ↕ Вертик.
        </button>
      </div>
      
      <p className="text-xs text-gray-400 text-center">
        Мгновенное отражение без потери качества
      </p>
    </div>
  )
}