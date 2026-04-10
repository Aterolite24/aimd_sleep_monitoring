import React, { useState } from 'react';
import { User, Settings as SettingsIcon, Shield, Bell, HelpCircle, HardDrive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const [deviceStatus, setDeviceStatus] = useState('connected');
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("Achal Gawande");
    const navigate = useNavigate();

    return (
        <div className="profile-container animate-fade-in">

            {/* Profile Header Card */}
            <div className="card profile-header-card">
                <div className="profile-avatar-large">
                    {name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="profile-info-large">
                    {isEditing ? (
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="name-input"
                            autoFocus
                        />
                    ) : (
                        <h2>{name}</h2>
                    )}
                    <p>Default Profile • ID: 8945-XYZ</p>
                </div>
                <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Save Profile' : 'Edit Profile'}
                </button>
            </div>

            <div className="profile-grid">
                {/* ML & Hardware Status Simulation */}
                <div className="card hardware-card">
                    <h3 className="card-title">System & ML Status </h3>

                    <div className="status-item">
                        <div className="status-label">
                            <HardDrive size={18} color="var(--text-muted)" />
                            <div className="status-text">
                                <strong>Local Controller (Gateway)</strong>
                                <span>Raspberry Pi 4 • Active</span>
                            </div>
                        </div>
                        <div className={`status-indicator ${deviceStatus === 'connected' ? 'status-green' : 'status-red'}`}>
                            <div className={`dot ${deviceStatus === 'connected' ? 'animate-pulse' : ''}`}></div> {deviceStatus === 'connected' ? 'Active' : 'Offline'}
                        </div>
                    </div>

                    <div className="status-item">
                        <div className="status-label">
                            <SettingsIcon size={18} color="var(--text-muted)" />
                            <div className="status-text">
                                <strong>Edge Sensors (Bed/Room)</strong>
                                <span>Piezoelectric, PPG, Accelerometer</span>
                            </div>
                        </div>
                        <div className="status-indicator status-green"><div className="dot"></div> Online</div>
                    </div>

                    <div className="status-item">
                        <div className="status-label">
                            <Shield size={18} color="var(--text-muted)" />
                            <div className="status-text">
                                <strong>ML Data Analysis Engine</strong>
                                <span>Awaiting Model Creation Team</span>
                            </div>
                        </div>
                        <div className="status-indicator status-yellow"><div className="dot"></div> Pending</div>
                    </div>

                    <div className="connect-actions" style={{ marginTop: '24px' }}>
                        <button onClick={() => setDeviceStatus(s => s === 'connected' ? 'disconnected' : 'connected')} className="secondary-btn">
                            {deviceStatus === 'connected' ? 'Simulate Disconnect' : 'Simulate Connect'}
                        </button>
                    </div>
                </div>

                {/* Settings Links */}
                <div className="card links-card">
                    <ul className="settings-list">
                        <li onClick={() => navigate('/settings/notifications')}>
                            <div className="settings-link">
                                <Bell size={20} color="var(--accent-blue)" />
                                <span>Notifications & Alerts</span>
                            </div>
                        </li>
                        <li onClick={() => navigate('/settings/account')}>
                            <div className="settings-link">
                                <User size={20} color="var(--accent-purple)" />
                                <span>Account Preferences</span>
                            </div>
                        </li>
                        <li onClick={() => navigate('/settings/privacy')}>
                            <div className="settings-link">
                                <Shield size={20} color="#10b981" />
                                <span>Privacy & Data</span>
                            </div>
                        </li>
                        <li onClick={() => navigate('/settings/help')}>
                            <div className="settings-link">
                                <HelpCircle size={20} color="#f43f5e" />
                                <span>Help & Support</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Profile;
