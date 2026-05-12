import { MoonStar, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../features/theme/themeSlice';

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      className="rounded-full border border-slate-200 p-2 transition hover:scale-105 dark:border-slate-700"
      aria-label="Toggle theme"
    >
      {mode === 'light' ? <MoonStar size={18} /> : <Sun size={18} />}
    </button>
  );
}
