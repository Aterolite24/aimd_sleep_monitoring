import React, { useState, useEffect } from 'react';
import { Heart, Activity, Wind, Volume2, ThermometerSun, Moon, ActivitySquare } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
    const [liveData, setLiveData] = useState({
        heart_rate: 0,
        temperature: 0,
        min_spo2: 0,
        pulse_rate: 0,
        sys_bp: 0,
        dia_bp: 0,
        movement_intensity: 0,
        timestamp: ''
    });

    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchLive = () => {
            fetch('http://localhost:8000/api/live/')
                .then(res => res.json())
                .then(data => {
                    setLiveData(data);
                    setChartData(prev => {
                        const newHistory = [...prev, data];
                        // Keep last 15 points
                        return newHistory.slice(-15);
                    });
                })
                .catch(err => console.error("Error fetching live data:", err));
        };

        fetchLive();
        const interval = setInterval(fetchLive, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dashboard-container animate-fade-in">

            {/* Top Row: Key Stats */}
            <div className="top-grid">

                {/* Real-time Status Card */}
                <div className="card score-card">
                    <h3 className="card-title">Live Status</h3>
                    <div className="score-ring">
                        <div className="score-value" style={{ position: 'relative', background: 'var(--pastel-blue)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                            <Activity className="icon" size={40} color="var(--accent-blue)" />
                        </div>
                    </div>
                    <p className="score-desc" style={{ textAlign: 'center', marginTop: '1rem', fontWeight: 600 }}>Monitoring Active</p>
                    <p className="score-desc" style={{ textAlign: 'center', fontSize: '12px' }}>Last updated: {liveData.timestamp}</p>
                </div>

                {/* Live Env Grid */}
                <div className="env-grid">
                    <div className="card stat-card" style={{ backgroundColor: 'var(--pastel-pink)' }}>
                        <div className="stat-icon"><Heart className="icon" size={24} color="#ec4899" /></div>
                        <div className="stat-info">
                            <h4>Heart Rate</h4>
                            <p>{liveData.heart_rate} bpm</p>
                        </div>
                    </div>
                    <div className="card stat-card" style={{ backgroundColor: 'var(--pastel-blue)' }}>
                        <div className="stat-icon"><Activity className="icon" size={24} color="var(--accent-blue)" /></div>
                        <div className="stat-info">
                            <h4>SpO2</h4>
                            <p>{liveData.min_spo2}%</p>
                        </div>
                    </div>
                    <div className="card stat-card" style={{ backgroundColor: 'var(--pastel-mint)' }}>
                        <div className="stat-icon"><ThermometerSun className="icon" size={24} color="#10b981" /></div>
                        <div className="stat-info">
                            <h4>Body Temp</h4>
                            <p>{liveData.temperature}°C</p>
                        </div>
                    </div>
                    <div className="card stat-card" style={{ backgroundColor: 'var(--pastel-purple)' }}>
                        <div className="stat-icon"><Heart className="icon" size={24} color="var(--accent-purple)" /></div>
                        <div className="stat-info">
                            <h4>Pulse Rate</h4>
                            <p>{liveData.pulse_rate} bpm</p>
                        </div>
                    </div>
                    <div className="card stat-card" style={{ backgroundColor: '#ffedd5' }}>
                        <div className="stat-icon"><ActivitySquare className="icon" size={24} color="#f97316" /></div>
                        <div className="stat-info">
                            <h4>Blood Pressure</h4>
                            <p>{liveData.sys_bp}/{liveData.dia_bp}</p>
                        </div>
                    </div>
                    <div className="card stat-card" style={{ backgroundColor: '#f3e8ff' }}>
                        <div className="stat-icon"><Activity className="icon" size={24} color="#8b5cf6" /></div>
                        <div className="stat-info">
                            <h4>Movement</h4>
                            <p>{liveData.movement_intensity}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Real-time Charts */}
            <div className="card chart-card mt-6">
                <div className="chart-header">
                    <h3 className="card-title">Live Vitals Stream</h3>
                </div>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="timestamp" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="left" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={[50, 150]} />
                            <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={[90, 100]} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                labelStyle={{ color: 'var(--text-main)', fontWeight: 600 }}
                            />
                            <Legend verticalAlign="top" height={36} />
                            <Line yAxisId="left" type="monotone" dataKey="heart_rate" name="Heart Rate (bpm)" stroke="#ec4899" strokeWidth={3} dot={false} isAnimationActive={false} />
                            <Line yAxisId="left" type="monotone" dataKey="pulse_rate" name="Pulse Rate (bpm)" stroke="var(--accent-purple)" strokeWidth={3} dot={false} isAnimationActive={false} />
                            <Line yAxisId="right" type="monotone" dataKey="min_spo2" name="Min SpO2 (%)" stroke="var(--accent-blue)" strokeWidth={3} dot={false} isAnimationActive={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Sleep Architecture Chart */}
            <div className="card chart-card mt-6">
                <div className="chart-header">
                    <h3 className="card-title">Live Sleep Architecture</h3>
                    <div className="legend">
                        <span><div className="dot" style={{ background: 'var(--accent-purple)' }}></div> REM & Deep</span>
                        <span><div className="dot" style={{ background: 'var(--pastel-blue-dark)' }}></div> Light</span>
                        <span><div className="dot" style={{ background: '#f87171' }}></div> Awake</span>
                    </div>
                </div>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorStage" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--pastel-purple)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="timestamp" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
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
                            <Area type="stepAfter" dataKey="sleep_stage" stroke="var(--accent-purple)" strokeWidth={3} fillOpacity={1} fill="url(#colorStage)" isAnimationActive={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
