import React from 'react';
import { Heart, Activity, Wind, Volume2, ThermometerSun, Moon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const sleepData = [
    { time: '10 PM', stage: 1 },
    { time: '11 PM', stage: 3 },
    { time: '12 AM', stage: 4 },
    { time: '1 AM', stage: 2 },
    { time: '2 AM', stage: 4 },
    { time: '3 AM', stage: 1 },
    { time: '4 AM', stage: 3 },
    { time: '5 AM', stage: 2 },
    { time: '6 AM', stage: 0 },
];

const Dashboard = () => {
    return (
        <div className="dashboard-container animate-fade-in">

            {/* Top Row: Score and Key Stats */}
            <div className="top-grid">

                {/* Sleep Score Card */}
                <div className="card score-card">
                    <h3 className="card-title">Daily Sleep Score</h3>
                    <div className="score-ring">
                        <svg viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" className="bg-circle" />
                            <circle cx="50" cy="50" r="40" className="progress-circle" style={{ strokeDasharray: `${85 * 2.51} 251` }} />
                        </svg>
                        <div className="score-value">
                            <span className="number">85</span>
                            <span className="label">Excellent</span>
                        </div>
                    </div>
                    <p className="score-desc">You got 8h 12m of sleep last night.</p>
                </div>

                {/* Environmental Feedback */}
                <div className="env-grid">
                    <div className="card stat-card" style={{ backgroundColor: 'var(--pastel-blue)' }}>
                        <div className="stat-icon"><Heart className="icon" size={24} color="var(--accent-blue)" /></div>
                        <div className="stat-info">
                            <h4>Heart Rate</h4>
                            <p>62 bpm <span className="trend">Normal</span></p>
                        </div>
                    </div>
                    <div className="card stat-card" style={{ backgroundColor: 'var(--pastel-pink)' }}>
                        <div className="stat-icon"><Activity className="icon" size={24} color="#ec4899" /></div>
                        <div className="stat-info">
                            <h4>SpO2</h4>
                            <p>98% <span className="trend">Healthy</span></p>
                        </div>
                    </div>
                    <div className="card stat-card" style={{ backgroundColor: 'var(--pastel-purple)' }}>
                        <div className="stat-icon"><Volume2 className="icon" size={24} color="var(--accent-purple)" /></div>
                        <div className="stat-info">
                            <h4>Noise Level</h4>
                            <p>32 dB <span className="trend">Quiet</span></p>
                        </div>
                    </div>
                    <div className="card stat-card" style={{ backgroundColor: 'var(--pastel-mint)' }}>
                        <div className="stat-icon"><ThermometerSun className="icon" size={24} color="#10b981" /></div>
                        <div className="stat-info">
                            <h4>Room Temp</h4>
                            <p>24°C <span className="trend">Optimal</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sleep Architecture Chart */}
            <div className="card chart-card mt-6">
                <div className="chart-header">
                    <h3 className="card-title">Sleep Architecture</h3>
                    <div className="legend">
                        <span><div className="dot" style={{ background: 'var(--accent-purple)' }}></div> REM & Deep</span>
                        <span><div className="dot" style={{ background: 'var(--pastel-blue-dark)' }}></div> Light</span>
                        <span><div className="dot" style={{ background: '#f87171' }}></div> Awake</span>
                    </div>
                </div>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={sleepData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorStage" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--pastel-purple)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => {
                                if (val === 0) return 'Awake';
                                if (val === 1) return 'REM';
                                if (val === 2) return 'Light';
                                if (val >= 3) return 'Deep';
                                return '';
                            }} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                labelStyle={{ color: 'var(--text-main)', fontWeight: 600 }}
                            />
                            <Area type="stepAfter" dataKey="stage" stroke="var(--accent-purple)" strokeWidth={3} fillOpacity={1} fill="url(#colorStage)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
