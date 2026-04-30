import { useColorScheme } from "nativewind";
import { createContext, useContext } from "react";
import { darkTokens, lightTokens, type Tokens } from "./tokens";

const ThemeContext = createContext<Tokens>(lightTokens);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useColorScheme();
  const tokens = colorScheme === "dark" ? darkTokens : lightTokens;
  return (
    <ThemeContext.Provider value={tokens}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): Tokens {
  return useContext(ThemeContext);
}
