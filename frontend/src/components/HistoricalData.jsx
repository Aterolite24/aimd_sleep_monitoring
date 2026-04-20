import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Activity, ActivitySquare, ThermometerSun } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const HistoricalData = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [availableDates, setAvailableDates] = useState([]);
    const [historicalData, setHistoricalData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8000/api/historical/')
            .then(res => res.json())
            .then(data => {
                if (data.available_dates && data.available_dates.length > 0) {
                    setAvailableDates(data.available_dates);
                    setSelectedDate(data.available_dates[0]);
                }
            })
            .catch(err => console.error("Error fetching dates:", err));
    }, []);

    useEffect(() => {
        if (!selectedDate) return;
        setLoading(true);
        fetch(`http://localhost:8000/api/historical/?date=${selectedDate}`)
            .then(res => res.json())
            .then(data => {
                setHistoricalData(data.error ? null : data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching historical data:", err);
                setHistoricalData(null);
                setLoading(false);
            });
    }, [selectedDate]);

    return (
        <div className="dashboard-container animate-fade-in">
            <div className="card score-card mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 className="card-title">Historical Health Analytics</h3>
                    <p className="score-desc">Select a date to view past health trends and metrics.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Calendar className="icon" size={24} color="var(--accent-blue)" />
                    <select
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    >
                        {availableDates.map(date => (
                            <option key={date} value={date}>{date}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading && <p>Loading historical data...</p>}

            {!loading && historicalData && (
                <>
                    <div className="env-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>

                        {/* Heart Rate */}
                        <div className="card stat-card" style={{ backgroundColor: 'var(--pastel-pink)' }}>
                            <div className="stat-icon"><Heart className="icon" size={24} color="#ec4899" /></div>
                            <div className="stat-info mt-2">
                                <h4>Heart Rate</h4>
                                <p style={{ marginBottom: '5px' }}>Avg: {historicalData.avg_heart_rate?.toFixed(1)} bpm</p>
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                    Min: {historicalData.min_heart_rate?.toFixed(1)} | Max: {historicalData.max_heart_rate?.toFixed(1)}
                                </div>
                            </div>
                        </div>

                        {/* Temperature */}
                        <div className="card stat-card" style={{ backgroundColor: 'var(--pastel-mint)' }}>
                            <div className="stat-icon"><ThermometerSun className="icon" size={24} color="#10b981" /></div>
                            <div className="stat-info mt-2">
                                <h4>Temperature</h4>
                                <p style={{ marginBottom: '5px' }}>Avg: {historicalData.avg_temperature?.toFixed(1)} °C</p>
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                    Min: {historicalData.min_temperature?.toFixed(1)} | Max: {historicalData.max_temperature?.toFixed(1)}
                                </div>
                            </div>
                        </div>

                        {/* SpO2 */}
                        <div className="card stat-card" style={{ backgroundColor: 'var(--pastel-blue)' }}>
                            <div className="stat-icon"><Activity className="icon" size={24} color="var(--accent-blue)" /></div>
                            <div className="stat-info mt-2">
                                <h4>Minimum SpO2</h4>
                                <p style={{ marginBottom: '5px' }}>{historicalData.min_spo2?.toFixed(1)} %</p>
                            </div>
                        </div>

                        {/* Pulse Rate */}
                        <div className="card stat-card" style={{ backgroundColor: 'var(--pastel-purple)' }}>
                            <div className="stat-icon"><Heart className="icon" size={24} color="var(--accent-purple)" /></div>
                            <div className="stat-info mt-2">
                                <h4>Pulse Rate</h4>
                                <p style={{ marginBottom: '5px' }}>Avg: {historicalData.avg_pulse_rate?.toFixed(1)} bpm</p>
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                    Min: {historicalData.min_pulse_rate?.toFixed(1)} | Max: {historicalData.max_pulse_rate?.toFixed(1)}
                                </div>
                            </div>
                        </div>

                        {/* Blood Pressure */}
                        <div className="card stat-card" style={{ backgroundColor: '#ffedd5' }}>
                            <div className="stat-icon"><ActivitySquare className="icon" size={24} color="#f97316" /></div>
                            <div className="stat-info mt-2">
                                <h4>Blood Pressure</h4>
                                <p style={{ marginBottom: '5px' }}>Avg: {historicalData.avg_sys_bp?.toFixed(0)}/{historicalData.avg_dia_bp?.toFixed(0)}</p>
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                    Sys Max: {historicalData.max_sys_bp?.toFixed(0)} | Dia Max: {historicalData.max_dia_bp?.toFixed(0)}
                                </div>
                            </div>
                        </div>

                        {/* Movement */}
                        <div className="card stat-card" style={{ backgroundColor: '#f3e8ff' }}>
                            <div className="stat-icon"><Activity className="icon" size={24} color="#8b5cf6" /></div>
                            <div className="stat-info mt-2">
                                <h4>Movement Intensity</h4>
                                <p style={{ marginBottom: '5px' }}>Avg: {historicalData.avg_movement?.toFixed(2)}</p>
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                    Max: {historicalData.max_movement?.toFixed(2)}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Historical Sleep Architecture Chart */}
                    {historicalData.sleep_architecture && (
                        <div className="card chart-card mt-6" style={{ width: '100%' }}>
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
                                    <AreaChart data={historicalData.sleep_architecture} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorStageHist" x1="0" y1="0" x2="0" y2="1">
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
                                        <Area type="stepAfter" dataKey="stage" stroke="var(--accent-purple)" strokeWidth={3} fillOpacity={1} fill="url(#colorStageHist)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </>
            )}

            {!loading && !historicalData && selectedDate && (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No historical data available for this date.</p>
                </div>
            )}
        </div>
    );
};

export default HistoricalData;
