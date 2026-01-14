import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Megaphone, FileText, Users, BarChart3, Settings, CreditCard, CheckCircle } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Actions', path: '/actions', icon: CheckCircle },
        { name: 'Inbox', path: '/inbox', icon: MessageSquare },
        { name: 'Campaigns', path: '/campaigns', icon: Megaphone },
        { name: 'Templates', path: '/templates', icon: FileText },
        { name: 'Leads', path: '/leads', icon: Users },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Credits', path: '/credits', icon: CreditCard },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                <img
                    src="/logo.png"
                    alt="Bubbles"
                    className="h-20 w-auto object-contain"
                />
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        JS
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">John Smith</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Admin</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
