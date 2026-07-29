import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/api';
import { Shield, Users, BadgeAlert, FolderOpen } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getDashboardStats();
        setData(stats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const { stats, recent_cases } = data || { stats: {}, recent_cases: [] };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Command Center</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Overview of current operations and metrics.</p>
        </div>
        <button className="btn btn-primary">Generate Report</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title"><FolderOpen size={16} style={{display:'inline', marginRight: 8}}/> Total Cases</div>
          <div className="stat-value">{stats.total_cases || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title"><BadgeAlert size={16} style={{display:'inline', marginRight: 8, color: 'var(--warning)'}}/> Open Cases</div>
          <div className="stat-value" style={{color: 'var(--warning)'}}>{stats.open_cases || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title"><Users size={16} style={{display:'inline', marginRight: 8}}/> Registered Criminals</div>
          <div className="stat-value">{stats.total_criminals || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title"><Shield size={16} style={{display:'inline', marginRight: 8, color: 'var(--accent-primary)'}}/> Active Officers</div>
          <div className="stat-value">{stats.total_officers || 0}</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '24px' }}>Recent Cases</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Title</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent_cases.map(c => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td style={{ fontWeight: 500 }}>{c.title}</td>
                  <td>{c.date}</td>
                  <td>
                    <span className={`badge ${c.status?.toLowerCase().replace(' ', '-') || 'open'}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recent_cases.length === 0 && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', padding: '32px'}}>No recent cases found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
