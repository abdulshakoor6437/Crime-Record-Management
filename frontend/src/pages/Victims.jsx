import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, MapPin, X } from 'lucide-react';
import { getVictims, createVictim } from '../services/api';

const Victims = () => {
  const [victims, setVictims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    victim_name: '',
    age: '',
    gender: 'Male',
    contact_no: '',
    address: ''
  });

  useEffect(() => {
    fetchVictims();
  }, []);

  const fetchVictims = async () => {
    try {
      const data = await getVictims();
      setVictims(data);
    } catch (error) {
      console.error('Error fetching victims:', error);
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
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age, 10) : null
      };
      await createVictim(payload);
      setShowModal(false);
      setFormData({ victim_name: '', age: '', gender: 'Male', contact_no: '', address: '' });
      await fetchVictims();
    } catch (error) {
      console.error("Error creating victim:", error);
      alert("Failed to register victim. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Victims Registry</h1>
          <p className="page-subtitle">Maintain records of individuals involved in cases.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Users size={18} />
          <span>Register Victim</span>
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Registered Victims</h2>
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Search victims..." />
          </div>
        </div>
        <div className="card-content" style={{ padding: 0 }}>
          {loading ? (
            <p className="text-secondary text-center" style={{ padding: '2rem' }}>Loading victims...</p>
          ) : victims.length === 0 ? (
            <p className="text-secondary text-center" style={{ padding: '2rem' }}>No victims found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age/Gender</th>
                  <th>Contact Info</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {victims.map((victim) => (
                  <tr key={victim.victim_id}>
                    <td style={{ color: 'var(--text-secondary)' }}>#{victim.victim_id}</td>
                    <td style={{ fontWeight: 500 }}>{victim.victim_name}</td>
                    <td>{victim.age ? `${victim.age} / ` : ''}{victim.gender || 'Unknown'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <Phone size={14} style={{ color: 'var(--text-secondary)' }} />
                        <span>{victim.contact_no || 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <MapPin size={14} />
                        <span style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {victim.address || 'N/A'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
          <div className="card fade-in" style={{ width: '500px', maxWidth: '90%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Register Victim</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Victim Name *</label>
                <input required type="text" name="victim_name" value={formData.victim_name} onChange={handleInputChange} className="form-control" placeholder="e.g. John Smith" style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="form-control" placeholder="e.g. 42" style={{ width: '100%', boxSizing: 'border-box' }} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} className="form-control" style={{ width: '100%', boxSizing: 'border-box' }}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Contact Number</label>
                <input type="text" name="contact_no" value={formData.contact_no} onChange={handleInputChange} className="form-control" placeholder="e.g. +1 555 123 4567" style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="form-control" placeholder="Home address..." style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ background: 'var(--bg-surface-elevated)' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Registering...' : 'Register Victim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Victims;
