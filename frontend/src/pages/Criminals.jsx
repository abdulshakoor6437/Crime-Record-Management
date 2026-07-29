import React, { useState, useEffect } from 'react';
import { UserX, Search, MapPin, X } from 'lucide-react';
import { getCriminals, createCriminal } from '../services/api';

const Criminals = () => {
  const [criminals, setCriminals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    criminal_name: '',
    age: '',
    gender: 'Male',
    address: '',
    status: 'Wanted'
  });

  useEffect(() => {
    fetchCriminals();
  }, []);

  const fetchCriminals = async () => {
    try {
      const data = await getCriminals();
      setCriminals(data);
    } catch (error) {
      console.error('Error fetching criminals:', error);
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
      await createCriminal(payload);
      setShowModal(false);
      setFormData({ criminal_name: '', age: '', gender: 'Male', address: '', status: 'Wanted' });
      await fetchCriminals();
    } catch (error) {
      console.error("Error creating criminal:", error);
      alert("Failed to add profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Arrested': return <span className="badge badge-success">Arrested</span>;
      case 'Wanted': return <span className="badge badge-error">Wanted</span>;
      case 'Released': return <span className="badge badge-warning">Released</span>;
      default: return <span className="badge">{status || 'Unknown'}</span>;
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Criminals Database</h1>
          <p className="page-subtitle">Track and manage criminal profiles and statuses.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <UserX size={18} />
          <span>Add Profile</span>
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Criminal Profiles</h2>
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Search by name..." />
          </div>
        </div>
        <div className="card-content" style={{ padding: 0 }}>
          {loading ? (
            <p className="text-secondary text-center" style={{ padding: '2rem' }}>Loading criminals...</p>
          ) : criminals.length === 0 ? (
            <p className="text-secondary text-center" style={{ padding: '2rem' }}>No records found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age/Gender</th>
                  <th>Status</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {criminals.map((criminal) => (
                  <tr key={criminal.criminal_id}>
                    <td style={{ color: 'var(--text-secondary)' }}>#{criminal.criminal_id}</td>
                    <td style={{ fontWeight: 500 }}>{criminal.criminal_name}</td>
                    <td>{criminal.age ? `${criminal.age} / ` : ''}{criminal.gender || 'Unknown'}</td>
                    <td>{getStatusBadge(criminal.status)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <MapPin size={14} />
                        <span style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {criminal.address || 'N/A'}
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
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Add Criminal Profile</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Criminal Name *</label>
                <input required type="text" name="criminal_name" value={formData.criminal_name} onChange={handleInputChange} className="form-control" placeholder="e.g. Jane Doe" style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="form-control" placeholder="e.g. 35" style={{ width: '100%', boxSizing: 'border-box' }} />
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="form-control" style={{ width: '100%', boxSizing: 'border-box' }}>
                  <option value="Wanted">Wanted</option>
                  <option value="Arrested">Arrested</option>
                  <option value="Released">Released</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="form-control" placeholder="Last known address..." style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ background: 'var(--bg-surface-elevated)' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Criminals;
