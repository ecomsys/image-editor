// src/utils/fileUtils.js

export const getFileInfoFromBase64 = (dataUrl) => {
  if (!dataUrl) return { size: 0, format: 'Unknown' }
  const [header, base64] = dataUrl.split(',')
  const mime = header.match(/data:(.*);base64/)?.[1] || 'unknown'
  const format = mime.split('/')[1]?.toUpperCase() || 'Unknown'
  
  // Точный расчёт размера из base64
  const padding = (base64.match(/=/g) || []).length
  const size = Math.floor((base64.length * 3) / 4) - padding
  return { size, format }
}

export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}