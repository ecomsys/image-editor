// src/components/ImagePreview.jsx
export default function ImagePreview({ image, onReset, originalName }) {
  const handleDownload = () => {
    // Определяем расширение
    const ext = image.includes('jpeg') ? 'jpg' : image.includes('png') ? 'png' : 'webp'
    
    // Формируем имя: если есть оригинал → имя-edited.ext, иначе → edited-timestamp.ext
    const baseName = originalName 
      ? originalName.replace(/\.[^/.]+$/, '') // убираем старое расширение
      : `edited-${Date.now()}`
    
    const link = document.createElement('a')
    link.href = image
    link.download = `${baseName}_edited.${ext}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-end gap-2 mb-3">
        <button onClick={onReset} className="cursor-pointer px-3 py-1.5 text-xs text-gray-600 border border-slate-300 rounded hover:bg-gray-50">
          Сбросить
        </button>
        <button onClick={handleDownload} className="cursor-pointer px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
          Скачать
        </button>
      </div>
      
      <div className="flex-1 bg-gray-50 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-auto">
        <img 
          src={image} 
          alt="Preview" 
          className="max-w-full max-h-full object-contain" 
        />
      </div>
    </div>
  )
}