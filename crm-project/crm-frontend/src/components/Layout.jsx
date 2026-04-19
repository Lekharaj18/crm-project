import React, { useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Dashboard' },
        { path: '/customers', label: 'Customers' },
        { path: '/leads', label: 'Leads' },
        { path: '/tasks', label: 'Tasks' },
        { path: '/sales', label: 'Sales Pipeline' }
    ];

    return (
        <div className="app-container">
            {/* Sidebar */}
            <div style={{ width: '250px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-light)', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '2rem' }}>Nexus CRM</h2>
                
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    {navItems.map(item => (
                        <li key={item.path}>
                            <Link 
                                to={item.path} 
                                style={{
                                    display: 'block',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    color: location.pathname === item.path ? 'white' : 'var(--text-secondary)',
                                    background: location.pathname === item.path ? 'var(--accent-primary)' : 'transparent',
                                    transition: 'all 0.2s',
                                    fontWeight: location.pathname === item.path ? '600' : '400'
                                }}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
                    <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Logged in as: <br/>
                        <strong style={{color: 'white'}}>{user?.fullName}</strong>
                    </div>
                    <button onClick={handleLogout} className="btn-primary" style={{ width: '100%', background: 'var(--danger)', boxShadow: 'none' }}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="main-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ textTransform: 'capitalize' }}>
                        {location.pathname === '/' ? 'Overview Dashboard' : location.pathname.substring(1).replace('-', ' ')}
                    </h1>
                </div>
                
                {/* Router Outlet for nested pages */}
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
