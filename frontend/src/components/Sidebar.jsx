import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Files, 
  Users, 
  BadgeAlert, 
  Fingerprint, 
  Settings 
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <ShieldAlert size={28} color="#4f46e5" />
        <span>NEXUS CRM</span>
      </div>
      
      <nav>
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/cases" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Files size={20} />
          <span>Cases</span>
        </NavLink>
        
        <NavLink to="/officers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <BadgeAlert size={20} />
          <span>Officers Directory</span>
        </NavLink>
        
        <NavLink to="/criminals" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Fingerprint size={20} />
          <span>Criminals Database</span>
        </NavLink>
        
        <NavLink to="/victims" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Victims Registry</span>
        </NavLink>
        
        <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
          <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
