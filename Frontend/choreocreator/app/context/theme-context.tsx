'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ConfigProvider } from 'antd';
import { darkThemeConfig, lightThemeConfig } from '../theme/themeConfig';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'choreocreator-theme';

function getInitialTheme(): ThemeMode {
    if (typeof window === 'undefined') {
        return 'light';
    }
    return 'light';
}

function getThemeFromBrowser(): ThemeMode {

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
        return stored;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

type ThemeContextValue = {
    mode: ThemeMode;
    setTheme: (mode: ThemeMode) => void;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<ThemeMode>(() => getInitialTheme());

    const setTheme = useCallback((nextMode: ThemeMode) => {
        setMode(nextMode);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, nextMode);
            document.documentElement.dataset.theme = nextMode;
        }
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(mode === 'dark' ? 'light' : 'dark');
    }, [mode, setTheme]);

    React.useEffect(() => {
        document.documentElement.dataset.theme = mode;
    }, [mode]);

    React.useEffect(() => {
        const browserTheme = getThemeFromBrowser();
        setMode(browserTheme);
        document.documentElement.dataset.theme = browserTheme;
    }, []);

    const value = useMemo(() => ({ mode, setTheme, toggleTheme }), [mode, setTheme, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            <ConfigProvider theme={mode === 'dark' ? darkThemeConfig : lightThemeConfig}>
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextValue => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
