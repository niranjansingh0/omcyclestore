import { Minus, Plus } from 'lucide-react';

export default function QuantityInput({ value, onChange }) {
  return (
    <div className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700">
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
        onClick={() => onChange(value - 1)}
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <span className="min-w-10 text-center text-sm font-semibold">{value}</span>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
