# System Architecture & Data Flow

This diagram illustrates how health vitals are collected, processed, and ultimately delivered to the user through the DeepSleep web application.

```ascii
+-------------------+       +-----------------------+       +-------------------+
|                   |       |                       |       |                   |
| Hardware Sensors  +-------> Sleep Analysis ML     +-------> Django Backend    |
| (Vitals, Motion)  | Data  | Pipeline (Inference)  | Stream| API Services      |
|                   |       |                       |       |                   |
+-------------------+       +-----------------------+       +---------+---------+
                                                                      |
                                         +----------------------------+-----------------------+
                                         |                                                    |
                                         v                                                    v
                              +--------------------+                               +--------------------+
                              |  Live API Route    |                               | Historical API     |
                              |  /api/live/        |                               | /api/historical/   |
                              +---------+----------+                               +---------+----------+
                                        |                                                    |
                                        |                   +-------------------+            |
                                        |                   |  SQLite Database  |            |
                                        |                   | (DailyHealthRec)  |<-----------+ Read/Write
                                        |                   +-------------------+            |
                                        |                                                    |
                                        v                                                    v
                              +--------------------+                               +--------------------+
                              |  React Frontend    |                               | React Frontend     |
                              |  <Dashboard />     |                               | <HistoricalData /> |
                              | (Real-time Charts) |                               | (Past Comparisons) |
                              +--------------------+                               +--------------------+
```

### Flow Breakdown

1. **Hardware Sensors**: Devices monitor raw biomarkers from the user (heart rate, temperature, movement, etc.).
2. **ML Pipeline**: The model digests raw inputs to detect sleep phases (REM, deep, light, awake) and normalizes metric averages. 
3. **Backend API**: 
   - **Live Data**: The `/api/live/` endpoint proxies the continuous model stream directly memory-to-memory to keep UI latency extremely low.
   - **Historical Data**: The `/api/historical/` endpoint queries the SQLite Database to fetch stored `DailyHealthRecord` rows for previous days.
4. **React Frontend**: The UI periodically polls the backend to dynamically update the live graphs on the Dashboard or visualizes historical stats natively inside the History tab.

### Database ER Diagram

The SQLite database currently consists of a single primary table used for tracking past metrics natively.

```ascii
+-----------------------------------+
|        DailyHealthRecord          |
+-----------------------------------+
| PK | id (Integer)                 |
| UQ | date (Date)                  |
+----+------------------------------+
|    | avg_heart_rate (Float)       |
|    | min_heart_rate (Float)       |
|    | max_heart_rate (Float)       |
|    | avg_temperature (Float)      |
|    | min_temperature (Float)      |
|    | max_temperature (Float)      |
|    | min_spo2 (Float)             |
|    | avg_pulse_rate (Float)       |
|    | min_pulse_rate (Float)       |
|    | max_pulse_rate (Float)       |
|    | avg_sys_bp (Integer)         |
|    | min_sys_bp (Integer)         |
|    | max_sys_bp (Integer)         |
|    | avg_dia_bp (Integer)         |
|    | min_dia_bp (Integer)         |
|    | max_dia_bp (Integer)         |
|    | avg_movement (Float)         |
|    | min_movement (Float)         |
|    | max_movement (Float)         |
+-----------------------------------+
```
