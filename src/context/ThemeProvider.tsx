// src/context/ThemeContext.tsx
import React, { createContext, useState, useMemo, useContext, ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline, PaletteMode, Theme } from '@mui/material';
import { getDesignTokens } from '../theme';

interface ThemeContextType {
    toggleColorMode: () => void;
    mode: PaletteMode;
    theme: Theme;
}

// Create the context with a default value (can be undefined or a default object)
// We'll provide a proper default inside the provider
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface CustomThemeProviderProps {
    children: ReactNode;
}

// Create the provider component
export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({ children }) => {
    const [mode, setMode] = useState<PaletteMode>('dark'); // Default mode

    // Memoize the toggle function
    const toggleColorMode = useMemo(
        () => () => {
            setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        },
        [],
    );

    // Memoize the theme object based on the mode
    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    // Value object for the context provider
    const contextValue = useMemo(() => ({
        toggleColorMode,
        mode,
        theme,
    }), [toggleColorMode, mode, theme]);

    return (
        <ThemeContext.Provider value={contextValue}>
            {/* Use MUI's ThemeProvider to apply the theme */}
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

// Custom hook to use the theme context
export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a CustomThemeProvider');
    }
    return context;
};
