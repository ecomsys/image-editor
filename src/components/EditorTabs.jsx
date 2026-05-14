// src/components/EditorTabs.jsx
export default function EditorTabs({
  activeTab,
  setActiveTab,
  compact = false,
}) {
  const tabs = [
    { id: "resize", label: "Размер" },
    { id: "crop", label: "Обрезать" },
    { id: "convert", label: "Конвертация" },
    { id: "compress", label: "Сжатие" }, 
    { id: "rotate", label: "Поворот" },
    { id: "mirror", label: "Зеркало" },
    { id: "bw", label: "Ч/Б" },
  ];

  return (
    <div
      className={`flex border border-slate-300 rounded-lg overflow-hidden bg-gray-50 px-1.5 ${compact ? "h-9" : ""}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`cursor-pointer flex-1 text-sm font-medium transition-all ${
            activeTab === tab.id
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-blue-200"
          } ${compact ? "py-1.5 px-1.5" : "py-3 px-4"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}