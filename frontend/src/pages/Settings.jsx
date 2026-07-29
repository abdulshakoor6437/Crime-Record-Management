import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Database, Moon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure your system preferences and account settings.</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
        <div className="card">
          <div className="card-content" style={{ padding: '1rem 0' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontWeight: 500, cursor: 'pointer', borderLeft: '3px solid #38bdf8' }}>
                <SettingsIcon size={18} />
                General
              </li>
              <li style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <Shield size={18} />
                Security
              </li>
              <li style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <Bell size={18} />
                Notifications
              </li>
              <li style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <Database size={18} />
                Database Settings
              </li>
            </ul>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 600 }}>General Preferences</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem 0' }}>Theme</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Customize the look and feel of your dashboard.</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', width: '150px' }}>
                  <Moon size={18} /> Dark Mode
                </button>
                <button className="btn" style={{ padding: '0.75rem 1.5rem', width: '150px', background: '#1e293b', border: '1px solid #334155' }}>
                  Light Mode
                </button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
              <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem 0' }}>System Language</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Select your preferred language for the interface.</p>
              <select style={{ width: '100%', maxWidth: '300px', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}>
                <option value="en">English (US)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
