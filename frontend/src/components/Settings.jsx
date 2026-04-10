import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
    const { tab } = useParams();
    const navigate = useNavigate();
    const activeTab = tab || 'preferences';

    // Read initial states from localStorage
    const getInitialState = (key, defaultVal) => {
        const saved = localStorage.getItem(key);
        return saved !== null ? JSON.parse(saved) : defaultVal;
    };

    const [notifications, setNotifications] = useState(() => getInitialState('notifications', true));
    const [darkTheme, setDarkTheme] = useState(() => getInitialState('darkTheme', false));
    const [dataSharing, setDataSharing] = useState(() => getInitialState('dataSharing', false));
    const [smartActuation, setSmartActuation] = useState(() => getInitialState('smartActuation', true));

    const [savedMessage, setSavedMessage] = useState(false);

    // Apply dark theme dynamically to body and save to local storage
    useEffect(() => {
        if (darkTheme) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }, [darkTheme]);

    const saveSettings = () => {
        // Persist all settings to localStorage
        localStorage.setItem('notifications', JSON.stringify(notifications));
        localStorage.setItem('darkTheme', JSON.stringify(darkTheme));
        localStorage.setItem('dataSharing', JSON.stringify(dataSharing));
        localStorage.setItem('smartActuation', JSON.stringify(smartActuation));

        setSavedMessage(true);
        setTimeout(() => setSavedMessage(false), 2000);
    };

    return (
        <div className="settings-container animate-fade-in">
            <div className="settings-tabs">
                <button className={`tab-btn ${['preferences', 'notifications', 'account'].includes(activeTab) ? 'active' : ''}`} onClick={() => navigate('/settings/preferences')}>Preferences & UI</button>
                <button className={`tab-btn ${['integrations', 'privacy', 'help'].includes(activeTab) ? 'active' : ''}`} onClick={() => navigate('/settings/integrations')}>Integrations & Privacy</button>
            </div>

            <div className="card settings-card">
                <div className="settings-header">
                    <h2 className="card-title" style={{ marginBottom: 0 }}>App Settings</h2>
                    <div>
                        {savedMessage && <span className="save-indicator">Settings Saved!</span>}
                        <button className="primary-btn" onClick={saveSettings}>Save Changes</button>
                    </div>
                </div>

                {['preferences', 'notifications', 'account'].includes(activeTab) && (
                    <div className="settings-section">
                        <h3>Display & Notifications</h3>

                        <div className="setting-toggle-row">
                            <div className="setting-info">
                                <h4>Push Notifications</h4>
                                <p>Receive daily sleep scores and insights directly to your device.</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
                                <span className="slider round"></span>
                            </label>
                        </div>

                        <div className="setting-toggle-row">
                            <div className="setting-info">
                                <h4>Dark Theme</h4>
                                <p>Switch between the pastel light theme and a dark sleep-friendly aesthetic.</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" checked={darkTheme} onChange={() => setDarkTheme(!darkTheme)} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                )}

                {['integrations', 'privacy', 'help'].includes(activeTab) && (
                    <div className="settings-section animate-fade-in">
                        <h3>Integrations & Data Privacy</h3>

                        <div className="setting-toggle-row">
                            <div className="setting-info">
                                <h4>Smart Actuation Sync</h4>
                                <p>Allow the app to automatically adjust room temperature and lighting based on sleep phase.</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" checked={smartActuation} onChange={() => setSmartActuation(!smartActuation)} />
                                <span className="slider round"></span>
                            </label>
                        </div>

                        <div className="setting-toggle-row">
                            <div className="setting-info">
                                <h4>Anonymous Data Sharing</h4>
                                <p>Share anonymized sensor data with the ML model creation team to improve baseline algorithms.</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" checked={dataSharing} onChange={() => setDataSharing(!dataSharing)} />
                                <span className="slider round"></span>
                            </label>
                        </div>

                        <div className="setting-toggle-row">
                            <div className="setting-info">
                                <h4>Account Management</h4>
                                <p>Permanently delete your profile and wipe all historic sleep telemetry data.</p>
                            </div>
                            <button className="danger-btn" onClick={() => alert('Wipe mock initiated.')}>Wipe Data</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Settings;
