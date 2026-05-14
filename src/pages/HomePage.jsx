import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        navigate("/editor", {
          state: {
            image: e.target.result,
            originalInfo: {
              name: file.name,
              size: file.size,
              format: file.type.split("/")[1].toUpperCase(),
            },
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-w-[64rem] min-h-screen flex flex-col bg-gray-50 bg-[url('/images/home-bg.webp')] bg-cover bg-no-repeat bg-fixed">
      <header className="w-full py-4 px-6 bg-white border-b border-slate-300 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800"><span className="text-blue-600">Ecomsys</span> Images Editor</h1>
        <span>десктопное приложение для редактирования изображений</span>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md p-10 text-center bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 hover:border-blue-500 transition cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            processFile(e.dataTransfer.files[0]);
          }}
        >
          <label className="flex flex-col items-center gap-4 cursor-pointer">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-800">
                Выберите изображение
              </p>
              <p className="text-sm text-gray-500 mt-1">
                или перетащите файл сюда
              </p>
            </div>
            <span className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
              Загрузить
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => processFile(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
      </main>
    </div>
  );
}
