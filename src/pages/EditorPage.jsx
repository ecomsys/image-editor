import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, FileImage, ArrowDown } from "lucide-react";
import { useState, useMemo, useRef } from "react";
import { centerCrop, makeAspectCrop } from "react-image-crop";
import EditorTabs from "../components/EditorTabs";
import ResizeTool from "../components/ResizeTool";
import CropControls from "../components/CropControls";
import CropPreview from "../components/CropPreview";
import ConvertTool from "../components/ConvertTool";
import ImagePreview from "../components/ImagePreview";
import MirrorTool from "../components/MirrorTool";
import BWTool from "../components/BWTool";
import RotateTool from "../components/RotateTool";
import CompressTool from "../components/CompressTool";
import { getFileInfoFromBase64, formatBytes } from "../utils/fileUtils";

export default function EditorPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [currentImage, setCurrentImage] = useState(state.image);
  const [activeTab, setActiveTab] = useState("resize");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [aspect, setAspect] = useState(1);
  const imgRef = useRef(null);

  const originalInfo = state.originalInfo || {
    name: "file",
    size: 0,
    format: "Unknown",
  };
  const currentInfo = useMemo(() => {
    const info = getFileInfoFromBase64(currentImage);
    return {
      name: originalInfo.name.replace(/(\.[\w\d_-]+)$/i, "_edited$1"),
      ...info,
    };
  }, [currentImage, originalInfo.name]);

  // МГНОВЕННОЕ обновление пропорции (считаем по нажатому значению, а не по стейту)
  const handleAspectChange = (newAspect) => {
    setAspect(newAspect);
    const img = imgRef.current;
    if (!img?.complete || img.naturalWidth === 0) return;

    const ratio = newAspect === 0 ? undefined : newAspect;
    const newCrop = centerCrop(
      makeAspectCrop(
        { unit: "%", width: 80 },
        ratio,
        img.naturalWidth,
        img.naturalHeight,
      ),
      img.naturalWidth,
      img.naturalHeight,
    );
    setCrop(newCrop);
  };

  // Инициализация при загрузке картинки
  const handleImgLoad = (e) => {
    const ratio = aspect === 0 ? undefined : aspect;
    const newCrop = centerCrop(
      makeAspectCrop(
        { unit: "%", width: 80 },
        ratio,
        e.currentTarget.naturalWidth,
        e.currentTarget.naturalHeight,
      ),
      e.currentTarget.naturalWidth,
      e.currentTarget.naturalHeight,
    );
    setCrop(newCrop);
  };

  // Применение обрезки
  const handleApplyCrop = () => {
    if (!completedCrop || !imgRef.current) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;

    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    canvas.width = Math.round(completedCrop.width * scaleX);
    canvas.height = Math.round(completedCrop.height * scaleY);

    ctx.drawImage(
      img,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const fmt = originalInfo.format?.toLowerCase();
    const mime =
      fmt === "jpeg" || fmt === "jpg"
        ? "image/jpeg"
        : fmt === "webp"
          ? "image/webp"
          : "image/png";
    setCurrentImage(
      canvas.toDataURL(mime, mime === "image/png" ? undefined : 0.92),
    );
    setActiveTab("resize");
  };

  const renderTool = () => {
    switch (activeTab) {
      case "resize":
        return <ResizeTool image={currentImage} onApply={setCurrentImage} />;
      case "crop":
        return (
          <CropControls
            aspect={aspect}
            setAspect={handleAspectChange}
            onApply={handleApplyCrop}
            onCancel={() => setActiveTab("resize")}
          />
        );
      case "convert":
        return <ConvertTool image={currentImage} onApply={setCurrentImage} />;
      case "mirror":
        return <MirrorTool image={currentImage} onApply={setCurrentImage} />;
      case "bw":
        return <BWTool image={currentImage} onApply={setCurrentImage} />;
      case "rotate":
        return (
          <RotateTool
            image={currentImage}
            originalImage={state.image}
            onApply={setCurrentImage}
          />
        );
      case "compress":
        return (
          <CompressTool
            image={currentImage}
            onApply={setCurrentImage}
            originalInfo={originalInfo}
          />
        );
      default:
        return null;
    }
  };

  if (!state?.image) return <Navigate to="/" replace />;

  return (
    <div className="min-h-[32rem] min-w-[64rem] h-screen flex flex-col overflow-hidden bg-gray-50 bg-[url('/images/home-bg.webp')] bg-cover bg-no-repeat bg-fixed">
      <header className="shrink-0 bg-white border-b border-slate-300 px-4 py-2">
        <div className="flex items-center gap-1.5 max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-7 h-7 text-blue-500" />
          </button>
          <div className="flex-1 flex items-center justify-between">
            <EditorTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              compact
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="w-full max-w-7xl mx-auto flex gap-0 p-4">
          <div className="w-72 shrink-0 bg-white border border-slate-300 rounded-xl p-4 overflow-y-auto flex-col flex justify-between">
            {renderTool()}

            {/* image info */}
            <div className="flex flex-col items-center gap-1.5 text-xs pl-2 ">
              <div className="flex flex-col items-center w-full gap-1.5 rounded-md bg-gray-100 p-2 border border-slate-500">
                <div className="flex flex-row gap-1">
                  <FileImage className="w-3.5 h-3.5 text-gray-700" />
                  <span
                    className="font-medium text-gray-700 truncate max-w-[7.5rem]"
                    title={originalInfo.name}
                  >
                    {originalInfo.name}
                  </span>
                </div>
                <span className="text-gray-700 font-medium text-md">
                  {originalInfo.format} • {formatBytes(originalInfo.size)}
                </span>
              </div>
              <ArrowDown className="w-4 h-4 text-gray-700" />
              <div className="flex flex-col w-full items-center gap-1.5 rounded-md bg-gray-100 p-2 border border-blue-500">
                <div className="flex flex-row gap-1">
                  <FileImage className="w-3.5 h-3.5 text-blue-500" />
                  <span
                    className="font-medium text-blue-600 truncate max-w-[7.5rem]"
                    title={currentInfo.name}
                  >
                    {currentInfo.name}
                  </span>
                </div>
                <span className="text-blue-600 font-medium text-md">
                  {currentInfo.format} • {formatBytes(currentInfo.size)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 ml-4 bg-white border border-slate-300 rounded-xl p-4 flex items-center justify-center overflow-hidden min-h-0">
            {activeTab === "crop" ? (
              <CropPreview
                image={currentImage}
                imgRef={imgRef}
                crop={crop}
                setCrop={setCrop}
                setCompletedCrop={setCompletedCrop}
                aspect={aspect}
                onImgLoad={handleImgLoad}
              />
            ) : (
              <ImagePreview
                image={currentImage}
                originalName={originalInfo.name} 
                onReset={() => setCurrentImage(state.image)}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
