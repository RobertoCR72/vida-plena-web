export function SimpleBarChart({ data }: { data: Array<{ label: string; value: number; color?: string }> }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-medium text-slate-700">{item.label}</span>
            <span className="text-slate-500">{item.value}</span>
          </div>
          <div className="h-3 rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full"
              style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color || "#2563eb" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
