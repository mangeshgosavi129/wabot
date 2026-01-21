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
                    // In a real app, you might want to call a /me endpoint to verify token
                    // For now, we assume token is valid if present and fetch initial data
                    setIsLoggedIn(true);
                    // Minimal user info from token or stored elsewhere
                    setUser({ email: localStorage.getItem('user_email') || 'user@example.com' });
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
        const response = await api.login({ email, password });
        localStorage.setItem('user_email', email);
        setIsLoggedIn(true);
        setUser({ email, id: response.user_id, organization_id: response.organization_id });
        await fetchInitialData();
    };

    const signupCreateOrg = async (payload) => {
        const response = await api.signupCreateOrg(payload);
        localStorage.setItem('user_email', payload.email);
        setIsLoggedIn(true);
        setUser({ email: payload.email, id: response.user_id, organization_id: response.organization_id });
        await fetchInitialData();
    };

    const signupJoinOrg = async (payload) => {
        const response = await api.signupJoinOrg(payload);
        localStorage.setItem('user_email', payload.email);
        setIsLoggedIn(true);
        setUser({ email: payload.email, id: response.user_id, organization_id: response.organization_id });
        await fetchInitialData();
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_email');
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
