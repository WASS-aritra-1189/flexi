import { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../Components/Sidebar/Sidebar';

const DUMMY_NOTIFICATIONS = [
    { id: 1, icon: 'bx bxs-user-plus', color: '#2563eb', title: 'New User Registered', desc: 'A new user has signed up on the platform.', time: '2 min ago', read: false },
    { id: 2, icon: 'bx bx-store', color: '#7c3aed', title: 'New Vendor Request', desc: 'Vendor "Hotel Sunrise" has requested approval.', time: '15 min ago', read: false },
    { id: 3, icon: 'bx bxs-calendar-check', color: '#d97706', title: 'New Booking', desc: 'Booking #1042 has been confirmed.', time: '1 hr ago', read: false },
    { id: 4, icon: 'bx bx-dollar-circle', color: '#059669', title: 'Payment Received', desc: '₹12,500 payment received for booking #1039.', time: '3 hr ago', read: true },
    { id: 5, icon: 'bx bx-error-circle', color: '#dc2626', title: 'Booking Cancelled', desc: 'Booking #1038 was cancelled by the user.', time: 'Yesterday', read: true },
];

const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
    const notifRef = useRef(null);
    const adminName = localStorage.getItem('adminName') || 'Admin';

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    return (
        <div className="layout">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(prev => !prev)} />
            <div className="main-wrapper" style={{ marginLeft: collapsed ? '90px' : '310px' }}>
                <div className="topbar">
                    <div className="topbar__welcome">
                        <i className="bx bxs-sun topbar__greet-icon"></i>
                        <span>{greeting}, <strong>{adminName}</strong>!</span>
                    </div>
                    <div className="topbar__actions">
                        <div className="topbar__notif" ref={notifRef}>
                            <div className="topbar__notif-btn" onClick={() => setNotifOpen(p => !p)}>
                                <i className="bx bx-bell"></i>
                                {unreadCount > 0 && (
                                    <span className="topbar__badge">{unreadCount}</span>
                                )}
                            </div>

                            {notifOpen && (
                                <div className="notif-panel">
                                    <div className="notif-panel__header">
                                        <span className="notif-panel__title">
                                            <i className="bx bx-bell"></i> Notifications
                                            {unreadCount > 0 && <span className="notif-panel__count">{unreadCount}</span>}
                                        </span>
                                        {unreadCount > 0 && (
                                            <button className="notif-panel__mark-all" onClick={markAllRead}>
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div className="notif-panel__list">
                                        {notifications.map(n => (
                                            <div
                                                key={n.id}
                                                className={`notif-item${n.read ? '' : ' notif-item--unread'}`}
                                                onClick={() => markRead(n.id)}
                                            >
                                                <div className="notif-item__icon" style={{ background: `${n.color}18`, color: n.color }}>
                                                    <i className={n.icon}></i>
                                                </div>
                                                <div className="notif-item__body">
                                                    <div className="notif-item__title">{n.title}</div>
                                                    <div className="notif-item__desc">{n.desc}</div>
                                                    <div className="notif-item__time">{n.time}</div>
                                                </div>
                                                {!n.read && <span className="notif-item__dot"></span>}
                                            </div>
                                        ))}
                                    </div>
                                    {notifications.every(n => n.read) && (
                                        <div className="notif-panel__empty">
                                            <i className="bx bx-check-circle"></i>
                                            <span>All caught up!</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <button className="topbar__theme-btn" onClick={() => setDarkMode(p => !p)}>
                            <i className={`bx ${darkMode ? 'bx-sun' : 'bx-moon'}`}></i>
                            {darkMode ? 'Light' : 'Dark'}
                        </button>
                    </div>
                </div>
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;