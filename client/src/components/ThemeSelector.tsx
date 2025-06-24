import { useRef, useEffect, useState } from 'react';
import { PaletteIcon } from 'lucide-react';
import { THEMES } from '@/constants';
import { useThemeStore } from '@/store/useThemeStore';

const ThemeSelector = () => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useThemeStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className='dropdown dropdown-end z-50' ref={dropdownRef}>
      {/* DROPDOWN TRIGGER */}
      <button
        tabIndex={0}
        className='btn btn-ghost btn-circle'
        onClick={() => setOpen((prev) => !prev)}
        aria-label='Select theme'
        type='button'
      >
        <PaletteIcon className='size-5' />
      </button>

      {open && (
        <div
          className='dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl
          w-56 border border-base-content/10 max-h-80 overflow-y-auto'
        >
          <div className='space-y-1'>
            {THEMES.map((themeOption) => (
              <button
                key={themeOption.name}
                className={`
                  w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors btn 
                  ${
                    theme === themeOption.name
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-base-content/5'
                  }
                `}
                onClick={() => {
                  setTheme(themeOption.name);
                  setOpen(false);
                }}
                type='button'
              >
                <PaletteIcon className='size-4' />
                <span className='text-sm font-medium'>{themeOption.label}</span>
                {/* THEME PREVIEW COLORS */}
                <div className='ml-auto flex gap-1'>
                  {themeOption.colors.map((color, i) => (
                    <span
                      key={i}
                      className='size-2 rounded-full'
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
