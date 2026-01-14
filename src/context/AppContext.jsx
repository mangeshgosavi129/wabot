import React, { createContext, useContext, useState, useEffect } from 'react';
import usersData from '../mocks/users.json';
import leadsData from '../mocks/leads.json';
import conversationsData from '../mocks/conversations.json';
import templatesData from '../mocks/templates.json';
import campaignsData from '../mocks/campaigns.json';
import creditsData from '../mocks/credits.json';
import analyticsData from '../mocks/analytics.json';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(usersData[0]); // Mock login
    const [leads, setLeads] = useState(leadsData);
    const [conversations, setConversations] = useState(conversationsData);
    const [templates, setTemplates] = useState(templatesData);
    const [campaigns, setCampaigns] = useState(campaignsData);
    const [credits, setCredits] = useState(creditsData);
    const [analytics, setAnalytics] = useState(analyticsData);

    // Helper to update credits
    const deductCredits = (amount) => {
        setCredits(prev => ({
            ...prev,
            balance: prev.balance - amount,
            history: [
                {
                    id: `txn_${Date.now()}`,
                    type: 'usage',
                    amount: -amount,
                    credits: -amount, // Simplified for mock
                    date: new Date().toISOString()
                },
                ...prev.history
            ]
        }));
    };

    const addCredits = (amount, cost) => {
        setCredits(prev => ({
            ...prev,
            balance: prev.balance + amount,
            history: [
                {
                    id: `txn_${Date.now()}`,
                    type: 'purchase',
                    amount: cost,
                    credits: amount,
                    date: new Date().toISOString()
                },
                ...prev.history
            ]
        }));
    };

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

    const value = {
        user, setUser,
        leads, setLeads,
        conversations, setConversations,
        templates, setTemplates,
        campaigns, setCampaigns,
        credits, addCredits, deductCredits,
        analytics, setAnalytics,
        theme, toggleTheme
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
