import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Moon, Activity, User, Settings as SettingsIcon } from 'lucide-react';
import './App.css';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Settings from './components/Settings';

function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="logo">
        <Moon size={28} />
        DeepSleep
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Activity size={20} />
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <User size={20} />
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <SettingsIcon size={20} />
            Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

function Header() {
  return (
    <header className="header">
      <div>
        <h1 style={{ fontSize: '28px', color: '#1e293b' }}>Good Morning, Achal</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Here is your daily sleep insight</p>
      </div>
      <div className="user-profile">
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 500, color: '#1e293b' }}>Achal Gawande</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Default Profile</div>
        </div>
        <div className="avatar">AG</div>
      </div>
    </header>
  );
}

function App() {
  useEffect(() => {
    const isDark = JSON.parse(localStorage.getItem('darkTheme') || 'false');
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings/:tab?" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
