import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export default function CropPreview({ image, imgRef, crop, setCrop, setCompletedCrop, aspect, onImgLoad }) {
  return (
    // Жёсткий контейнер, который никогда не вылезет за экран
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-2 bg-gray-50">
      <ReactCrop
        crop={crop}
        onChange={setCrop}
        onComplete={setCompletedCrop}
        aspect={aspect || undefined}
        className="max-w-full max-h-[calc(100vh-10rem)]"
      >
        <img
          ref={imgRef}
          src={image}
          onLoad={onImgLoad}
          className="block max-w-full max-h-full"
        />
      </ReactCrop>
    </div>
  )
}