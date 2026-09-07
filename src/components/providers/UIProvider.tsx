import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface UIContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  modal: string | null;
  openModal: (name: string) => void;
  closeModal: () => void;
}

const UIContext = createContext<UIContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  modal: null,
  openModal: () => {},
  closeModal: () => {},
});

export function UIProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [modal, setModal] = useState<string | null>(null);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  const openModal = useCallback((name: string) => setModal(name), []);
  const closeModal = useCallback(() => setModal(null), []);

  return (
    <UIContext.Provider value={{ theme, toggleTheme, modal, openModal, closeModal }}>
      <div data-theme={theme} className={theme === 'dark' ? 'dark' : ''}>
        {children}
      </div>
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
