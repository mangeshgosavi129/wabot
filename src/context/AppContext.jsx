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

    const [conversations, setConversations] = useState([]);

    const fetchInitialData = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const [templatesData, statsData, analyticsData, orgData, conversationsData] = await Promise.all([
                api.getTemplates(),
                api.getDashboardStats(),
                api.getAnalytics(),
                api.getOrganization(),
                api.getConversations(),
            ]);

            setTemplates(templatesData || []);
            setDashboardStats(statsData);
            setAnalyticsReport(analyticsData || null);
            setOrganization(orgData || null);
            setConversations(conversationsData || []);
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
        if (isLoggedIn && initialDataLoaded) {
            const token = localStorage.getItem('auth_token');
            if (token) {
                console.log('[AppContext] Initiating WebSocket connect with token present');
                wsClient.connect(token);
            } else {
                console.warn('[AppContext] No auth_token found in localStorage; skipping WebSocket connect');
            }
        } else {
            console.log('[AppContext] isLoggedIn=false or initialDataPending -> disconnecting WebSocket');
            wsClient.disconnect();
        }
    }, [isLoggedIn, initialDataLoaded]);

    // WebSocket Event Router
    useEffect(() => {
        if (!isLoggedIn) return;

        const handleConversationUpdated = (payload) => {
            console.log('🔄 Conversation updated handler called:', payload);
            if (!payload?.conversation) return;

            setConversations(prev => {
                const existing = (prev || []).find(c => c.id === payload.conversation.id);
                if (existing) {
                    return prev.map(c => c.id === payload.conversation.id ? { ...c, ...payload.conversation } : c);
                }
                return [...(prev || []), payload.conversation];
            });
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

        // Tap into connection lifecycle for debugging
        const logOpen = () => console.log('[AppContext] WebSocket connection: open');
        const logClose = () => console.log('[AppContext] WebSocket connection: close');
        wsClient.on('connection:open', logOpen);
        wsClient.on('connection:close', logClose);

        // Register primary handlers
        wsHandlerManager.registerHandlers({
            onConversationUpdated: handleConversationUpdated,
            onActionHumanAttentionRequired: handleHumanAttention,
            onAck: handleAck,
            onError: handleError,
            onServerHello: handleServerHello,
        });

        return () => {
            wsClient.off('connection:open', logOpen);
            wsClient.off('connection:close', logClose);
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
        conversations, setConversations,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
