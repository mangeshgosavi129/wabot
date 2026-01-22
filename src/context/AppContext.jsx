import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/apis';
import { wsClient } from '../lib/websocket';
import { wsHandlerManager } from '../lib/websocket-handlers';
import { WSEvents } from '../lib/types';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [analyticsReport, setAnalyticsReport] = useState(null);
    const [organization, setOrganization] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);


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

    const fetchInitialData = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const [templatesData, statsData, analyticsData, orgData] = await Promise.all([
                api.getTemplates(),
                api.getDashboardStats(),
                api.getAnalytics(),
                api.getOrganization(),
            ]);

            setTemplates(templatesData || []);
            setDashboardStats(statsData);
            setAnalyticsReport(analyticsData || null);
            setOrganization(orgData || null);
            setInitialDataLoaded(true);
        } catch (error) {
            console.error('Failed to fetch initial data:', error);
            setInitialDataLoaded(true); // Mark as loaded even on error to prevent infinite loading
        } finally {
            if (showLoading) setLoading(false);
        }
    }, []);

    // WebSocket Management
    useEffect(() => {
        if (isLoggedIn) {
            const token = localStorage.getItem('auth_token');
            if (token) {
                wsClient.connect(token);
            }
        } else {
            wsClient.disconnect();
        }
    }, [isLoggedIn]);

    // WebSocket Event Router
    useEffect(() => {
        if (!isLoggedIn) return;

        const handleConversationUpdated = (payload) => {
            console.log("Conversation updated:", payload);
            // Conversations are now managed locally by pages
        };

        const handleHumanAttention = (payload) => {
            console.log("Human attention required for:", payload.conversation_ids);
        };

        const handleAck = (payload) => {
            console.log("Acknowledgment received for:", payload.event);
        };

        const handleError = (payload) => {
            console.error("WebSocket error:", payload.message);
        };

        const handleServerHello = (payload) => {
            console.log("Server handshake received:", payload);
        };

        wsHandlerManager.registerHandlers({
            onConversationUpdated: handleConversationUpdated,
            onActionHumanAttentionRequired: handleHumanAttention,
            onAck: handleAck,
            onError: handleError,
            onServerHello: handleServerHello,
        });

        return () => {
            wsHandlerManager.unregisterAllHandlers();
        };
    }, [isLoggedIn, initialDataLoaded]);

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
        setTemplates([]);
        setDashboardStats(null);
        setAnalyticsReport(null);
        setOrganization(null);
        setInitialDataLoaded(false);
        setLoading(false);
    };



    const value = {
        user, setUser,
        templates, setTemplates,
        dashboardStats, setDashboardStats,
        analyticsReport, setAnalyticsReport,
        organization, setOrganization,
        theme, toggleTheme,
        isLoggedIn, login, signupCreateOrg, signupJoinOrg, logout,
        loading, authLoading, initialDataLoaded, fetchInitialData,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
