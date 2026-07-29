import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, Search, Phone, MapPin, X } from 'lucide-react';
import { getOfficers, createOfficer } from '../services/api';

const Officers = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    officer_name: '',
    rank_name: '',
    contact_no: '',
    station_name: ''
  });

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      const data = await getOfficers();
      setOfficers(data);
    } catch (error) {
      console.error('Error fetching officers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createOfficer(formData);
      setShowModal(false);
      setFormData({ officer_name: '', rank_name: '', contact_no: '', station_name: '' });
      await fetchOfficers();
    } catch (error) {
      console.error("Error creating officer:", error);
      alert("Failed to add officer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Officers Directory</h1>
          <p className="page-subtitle">Manage and view all registered law enforcement officers.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={18} />
          <span>Add Officer</span>
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Officers</h2>
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Search officers..." />
          </div>
        </div>
        <div className="card-content">
          {loading ? (
            <p className="text-secondary text-center" style={{ padding: '2rem' }}>Loading officers...</p>
          ) : officers.length === 0 ? (
            <p className="text-secondary text-center" style={{ padding: '2rem' }}>No officers found.</p>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {officers.map((officer) => (
                <div key={officer.officer_id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                      <Shield size={24} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{officer.officer_name}</h3>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{officer.rank_name || 'N/A'}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Phone size={14} />
                      <span>{officer.contact_no || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={14} />
                      <span>{officer.station_name || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
          <div className="card fade-in" style={{ width: '400px', maxWidth: '90%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Add New Officer</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Officer Name *</label>
                <input required type="text" name="officer_name" value={formData.officer_name} onChange={handleInputChange} className="form-control" placeholder="e.g. John Doe" style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Rank</label>
                <input type="text" name="rank_name" value={formData.rank_name} onChange={handleInputChange} className="form-control" placeholder="e.g. Inspector" style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Contact Number</label>
                <input type="text" name="contact_no" value={formData.contact_no} onChange={handleInputChange} className="form-control" placeholder="e.g. +1 234 567 8900" style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Station Name</label>
                <input type="text" name="station_name" value={formData.station_name} onChange={handleInputChange} className="form-control" placeholder="e.g. Central Precinct" style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ background: 'var(--bg-surface-elevated)' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Officer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Officers;
