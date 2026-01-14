import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, HelpCircle, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { credits, user, theme, toggleTheme } = useApp();
    const navigate = useNavigate();

    return (
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 transition-colors duration-200">
            <div className="flex items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {/* Dynamic header title could go here based on route */}
                    Good Morning, {user?.name.split(' ')[0]}
                </h2>
            </div>

            <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 text-gray-400 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <button
                    onClick={() => navigate('/credits')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary rounded-full text-sm font-medium border border-primary/20 hover:bg-primary/10 transition-colors"
                >
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    {credits.balance.toLocaleString()} Credits
                </button>

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <HelpCircle className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full border-2 border-white dark:border-gray-800"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
