import { useState, useRef, useEffect } from "react";
import { RotateCcw, RotateCw } from "lucide-react";
import { rotateImage } from "../utils/imageUtils";

export default function RotateTool({ image, onApply
  // , originalImage 
}) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [startRotation, setStartRotation] = useState(0);
  const containerRef = useRef(null);

  // Вычисляем угол между курсором и центром элемента
  const getAngle = (e, rect) => {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI) + 90;
  };

  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    setIsDragging(true);
    setStartAngle(getAngle(e, rect));
    setStartRotation(rotation);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const delta = getAngle(e, rect) - startAngle;
    setRotation(startRotation + delta);
  };

  const handleMouseUp = () => setIsDragging(false);

  // Глобальные слушатели для плавного драга за пределами зоны
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, startAngle, startRotation]);

  // Применить вращение
  const handleApply = async () => {
    if (Math.abs(rotation) < 0.5) return;
    try {
      const result = await rotateImage(image, Math.round(rotation));
      onApply(result);
      setRotation(0);
    } catch (err) {
      console.error("Rotate error:", err);
    }
  };

  // Сбросить к оригиналу
  const handleReset = () => {
    // if (originalImage) onApply(originalImage);
    setRotation(0);
  };

  

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-800">Поворот</h3>

      {/* Зона вращения */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        className={`bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 p-6 flex items-center justify-center min-h-[10rem] cursor-grab active:cursor-grabbing select-none transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : "hover:border-gray-400"
        }`}
      >
        <div
          className="transition-transform duration-75"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <img
            src={image}
            alt="Preview"
            className="max-w-[6.25rem] max-h-[6.25rem] object-contain pointer-events-none"
          />
        </div>
      </div>

      {/* Контролы */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handleReset}
          disabled={Math.abs(rotation) < 0.5}
          className="text-md w-full px-3 py-2 border border-slate-300 cursor-pointer bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-200 rounded-lg transition flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" /> Сброс
        </button>
        <button
          onClick={handleApply}
          disabled={Math.abs(rotation) < 0.5}
          className="text-md w-full px-4 py-2 bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition flex items-center gap-1"
        >
          Применить <RotateCw className="w-4 h-4" />
        </button>
      </div>

      <p className="text-4xl font-bold text-gray-800 text-center">
        {Math.round(rotation)}°
      </p>

      <p className="text-xs text-gray-400 text-center">
        Тяни мышкой по кругу для вращения
      </p>
    </div>
  );
}
