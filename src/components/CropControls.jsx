export default function CropControls({ aspect, setAspect, onApply, onCancel }) {
  const presets = [
    { label: '1:1', value: 1 },
    { label: '4:3', value: 4/3 },
    { label: '16:9', value: 16/9 },
    { label: 'Свободно', value: 0 },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-800">Обрезать</h3>
      <div className="flex flex-wrap gap-2">
        {presets.map(p => (
          <button
            key={p.value}
            onClick={() => setAspect(p.value)}
            className={`cursor-pointer flex-1 px-2 py-2 text-md rounded-lg border transition min-w-[3.75rem] ${
              aspect === p.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-800">
        Выделите область и нажмите "Применить"
      </div>
      <div className="flex gap-2 pt-2">
        <button onClick={onCancel} className="cursor-pointer flex-1 px-3 py-2 text-md border border-slate-300 rounded-lg hover:bg-gray-50 transition">Отмена</button>
        <button onClick={onApply} className="cursor-pointer flex-1 px-3 py-2 text-md bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">Применить</button>
      </div>
    </div>
  );
}