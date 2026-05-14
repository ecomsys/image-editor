// src/utils/imageUtils.js

// Конвертация формата — с поддержкой качества
export const convertImageFormat = (imageDataUrl, format = 'image/jpeg', quality = 0.82) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      let width = img.width
      let height = img.height

      // Оптимизация: если фото гигантское — уменьшаем перед конвертацией
      // Но только для "легкого" режима (quality < 1.0)
      const MAX_DIMENSION = quality < 1.0 ? 4096 : 8192
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      canvas.width = width
      canvas.height = height
      
      // Включаем сглаживание для качества
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = quality === 1.0 ? 'high' : 'medium'
      
      ctx.drawImage(img, 0, 0, width, height)
      
      // Для PNG quality игнорируется, для WebP/JPEG — применяется
      const result = canvas.toDataURL(format, quality)
      resolve(result)
    }
    img.src = imageDataUrl
  })
}


// 🪞 Зеркальное отражение — с сохранением формата
export const mirrorImage = (imageDataUrl, direction = 'horizontal') => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      
      if (direction === 'horizontal') {
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
      } else {
        ctx.translate(0, canvas.height)
        ctx.scale(1, -1)
      }
      
      ctx.drawImage(img, 0, 0)
      
      // Сохраняем формат оригинала
      const fmt = imageDataUrl.match(/image\/(\w+);base64/)?.[1]?.toLowerCase()
      const mime = fmt === 'jpeg' || fmt === 'jpg' ? 'image/jpeg' : fmt === 'webp' ? 'image/webp' : 'image/png'
      const quality = mime === 'image/png' ? undefined : 0.92
      
      resolve(canvas.toDataURL(mime, quality))
    }
    img.src = imageDataUrl
  })
}

// ⚫ Ч/Б фильтр — с сохранением формата
export const toBlackAndWhite = (imageDataUrl) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
        data[i] = avg
        data[i + 1] = avg
        data[i + 2] = avg
      }
      
      ctx.putImageData(imageData, 0, 0)
      
      // Сохраняем формат оригинала
      const fmt = imageDataUrl.match(/image\/(\w+);base64/)?.[1]?.toLowerCase()
      const mime = fmt === 'jpeg' || fmt === 'jpg' ? 'image/jpeg' : fmt === 'webp' ? 'image/webp' : 'image/png'
      const quality = mime === 'image/png' ? undefined : 0.92
      
      resolve(canvas.toDataURL(mime, quality))
    }
    img.src = imageDataUrl
  })
}
// Поворот — с защитой от бесконечного роста холста
export const rotateImage = (imageDataUrl, degrees) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const rad = (degrees * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));

      // Bounding box повёрнутого изображения
      let newWidth = Math.round(img.width * cos + img.height * sin);
      let newHeight = Math.round(img.width * sin + img.height * cos);

      // Лимит размера: если вылезает > 4096 — масштабируем вниз
      const MAX_DIM = 4096;
      const scale = Math.min(1, MAX_DIM / newWidth, MAX_DIM / newHeight);

      newWidth = Math.round(newWidth * scale);
      newHeight = Math.round(newHeight * scale);

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');

      // Трансформации: центр → поворот → масштаб → отрисовка
      ctx.translate(newWidth / 2, newHeight / 2);
      ctx.rotate(rad);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      // Сохраняем исходный формат
      const fmt = imageDataUrl.match(/image\/(\w+);base64/)?.[1]?.toLowerCase();
      const mime = fmt === 'jpeg' || fmt === 'jpg' ? 'image/jpeg' : fmt === 'webp' ? 'image/webp' : 'image/png';
      const quality = mime === 'image/png' ? undefined : 0.92;

      resolve(canvas.toDataURL(mime, quality));
    };
    img.src = imageDataUrl;
  });
};

// Resize с сохранением пропорций (если указано только одно значение)
export const resizeImage = (imageDataUrl, width, height) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      let newWidth = width || img.width;
      let newHeight = height || img.height;
      
      if (width && !height) {
        newHeight = Math.round((img.height * width) / img.width);
      } else if (!width && height) {
        newWidth = Math.round((img.width * height) / img.height);
      }
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // Сохраняем исходный формат
      const formatMatch = imageDataUrl.match(/image\/(\w+);base64/);
      const originalFormat = formatMatch?.[1]?.toLowerCase();
      const outputFormat = 
        originalFormat === 'jpeg' || originalFormat === 'jpg' ? 'image/jpeg' :
        originalFormat === 'webp' ? 'image/webp' :
        'image/png';
      
      const quality = (outputFormat === 'image/jpeg' || outputFormat === 'image/webp') ? 0.92 : undefined;
      
      resolve(canvas.toDataURL(outputFormat, quality));
    };
    img.src = imageDataUrl;
  });
};