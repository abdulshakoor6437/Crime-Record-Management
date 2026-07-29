import React, { useEffect, useState } from 'react';
import { getCases, createCase } from '../services/api';
import { Search, Plus, X } from 'lucide-react';

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Open',
    case_date: new Date().toISOString().split('T')[0]
  });

  const fetchCases = async () => {
    try {
      const data = await getCases();
      setCases(data);
    } catch (error) {
      console.error("Error fetching cases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createCase(formData);
      setShowModal(false);
      setFormData({ title: '', description: '', status: 'Open', case_date: new Date().toISOString().split('T')[0] });
      // Refresh list
      await fetchCases();
    } catch (error) {
      console.error("Error creating case:", error);
      alert("Failed to create case. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cases-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Cases Registry</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and view all registered cases.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16}/> New Case
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-secondary)' }}/>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search cases..." 
              style={{ paddingLeft: '40px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select className="form-control" style={{ width: 'auto' }}>
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Solved">Solved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading cases...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cases.map(c => (
                  <tr key={c.case_id}>
                    <td style={{ color: 'var(--text-secondary)' }}>#{c.case_id}</td>
                    <td style={{ fontWeight: 500 }}>{c.title}</td>
                    <td>{c.case_date}</td>
                    <td>
                      <span className={`badge ${c.status?.toLowerCase().replace(' ', '-') || 'open'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn" style={{ padding: '6px 12px', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}>View Details</button>
                    </td>
                  </tr>
                ))}
                {cases.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', padding: '32px', color: 'var(--text-secondary)'}}>No cases found in the registry</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
          <div className="card fade-in" style={{ width: '500px', maxWidth: '90%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Create New Case</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Case Title *</label>
                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-control" placeholder="e.g. Grand Theft Auto - Downtown" style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-control" rows="3" placeholder="Provide case details..." style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="form-control" style={{ width: '100%', boxSizing: 'border-box' }}>
                    <option value="Open">Open</option>
                    <option value="Under Investigation">Under Investigation</option>
                    <option value="Solved">Solved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Date</label>
                  <input type="date" name="case_date" value={formData.case_date} onChange={handleInputChange} className="form-control" style={{ width: '100%', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ background: 'var(--bg-surface-elevated)' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cases;
