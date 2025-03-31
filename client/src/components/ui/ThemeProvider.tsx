import { createContext, ReactNode } from "react";

type ThemeProviderProps = {
  children: ReactNode;
};

// Context to provide theme-related values if needed in the future
export const ThemeContext = createContext({});

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={{}}>
      {children}
    </ThemeContext.Provider>
  );
}
