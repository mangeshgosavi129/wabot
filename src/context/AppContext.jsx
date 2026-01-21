import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/apis';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [leads, setLeads] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [timeSeriesAnalytics, setTimeSeriesAnalytics] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);


    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const fetchInitialData = useCallback(async () => {
        try {
            setLoading(true);
            const [leadsData, conversationsData, templatesData, statsData, analyticsData] = await Promise.all([
                api.getLeads(),
                api.getConversations(),
                api.getTemplates(),
                api.getDashboardStats(),
                api.getAnalytics()
            ]);

            setLeads(leadsData || []);
            setConversations(conversationsData || []);
            setTemplates(templatesData || []);
            setDashboardStats(statsData);
            setTimeSeriesAnalytics(analyticsData || []);
        } catch (error) {
            console.error('Failed to fetch initial data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    const userData = await api.getMe();
                    setIsLoggedIn(true);
                    setUser(userData);
                    await fetchInitialData();
                } catch (error) {
                    console.error('Auth verification failed:', error);
                    logout();
                }
            }
            setAuthLoading(false);
        };

        checkAuth();

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        }
    }, [fetchInitialData, theme]);

    const login = async (email, password) => {
        await api.login({ email, password });
        const userData = await api.getMe();

        setIsLoggedIn(true);
        setUser(userData);
        await fetchInitialData();
    };

    const signupCreateOrg = async (payload) => {
        await api.signupCreateOrg(payload);
        const userData = await api.getMe();

        setIsLoggedIn(true);
        setUser(userData);
        await fetchInitialData();
    };

    const signupJoinOrg = async (payload) => {
        await api.signupJoinOrg(payload);
        const userData = await api.getMe();

        setIsLoggedIn(true);
        setUser(userData);
        await fetchInitialData();
    };

    const logout = () => {
        localStorage.removeItem('auth_token');


        setIsLoggedIn(false);
        setUser(null);
        setLeads([]);
        setConversations([]);
        setTemplates([]);
        setDashboardStats(null);
        setTimeSeriesAnalytics([]);
    };



    const value = {
        user, setUser,
        leads, setLeads,
        conversations, setConversations,
        templates, setTemplates,
        dashboardStats, setDashboardStats,
        timeSeriesAnalytics, setTimeSeriesAnalytics,
        theme, toggleTheme,
        isLoggedIn, login, signupCreateOrg, signupJoinOrg, logout,
        loading, authLoading, fetchInitialData,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
