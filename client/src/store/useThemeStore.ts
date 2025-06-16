import { create } from 'zustand';

type Store = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const useThemeStore = create<Store>()((set) => ({
  theme: localStorage.getItem('chatzy-theme') || 'dracular',
  setTheme: (theme: string) => {
    localStorage.setItem('chatzy-theme', theme);
    set({ theme });
  },
}));
