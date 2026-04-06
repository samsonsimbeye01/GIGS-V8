import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    const toggleTheme = () => {
        context.setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return { theme: context.theme, toggleTheme };
};

export default useTheme;