import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', contactInfo: '', source: 'WEB', status: 'NEW' });

    const fetchLeads = async () => {
        try {
            const response = await api.get('/leads');
            setLeads(response.data);
        } catch (error) {
            console.error("Error fetching leads", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await api.put(`/leads/${formData.id}`, formData);
            } else {
                await api.post('/leads', formData);
            }
            setShowModal(false);
            setFormData({ name: '', contactInfo: '', source: 'WEB', status: 'NEW' });
            fetchLeads();
        } catch (error) {
            console.error("Error saving lead", error);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'NEW': return '#3b82f6';
            case 'CONTACTED': return '#f59e0b';
            case 'CONVERTED': return '#10b981';
            case 'LOST': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    if (loading) return <div>Loading leads...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Track and convert your sales prospects.</p>
                <button className="btn-primary" onClick={() => { setFormData({ name: '', contactInfo: '', source: 'WEB', status: 'NEW' }); setShowModal(true); }}>+ Add Lead</button>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Contact</th>
                            <th style={{ padding: '1rem' }}>Source</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No leads found.</td>
                            </tr>
                        ) : (
                            leads.map(lead => (
                                <tr key={lead.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: '500' }}>{lead.name}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{lead.contactInfo}</td>
                                    <td style={{ padding: '1rem' }}>{lead.source}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ 
                                            background: `${getStatusColor(lead.status)}22`, 
                                            color: getStatusColor(lead.status),
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: '600'
                                        }}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button onClick={() => { setFormData(lead); setShowModal(true); }} style={{ background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Simple Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="glass-panel" style={{ width: '500px', padding: '2rem', background: 'var(--bg-secondary)' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>{formData.id ? 'Edit Lead' : 'Add New Lead'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Name</label>
                                <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Contact Info (Email/Phone)</label>
                                <input type="text" className="input-field" value={formData.contactInfo} onChange={e => setFormData({...formData, contactInfo: e.target.value})} required />
                            </div>
                            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Source</label>
                                    <select className="input-field" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}>
                                        <option value="WEB">Web</option>
                                        <option value="REFERRAL">Referral</option>
                                        <option value="ADS">Ads</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Status</label>
                                    <select className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                        <option value="NEW">New</option>
                                        <option value="CONTACTED">Contacted</option>
                                        <option value="CONVERTED">Converted</option>
                                        <option value="LOST">Lost</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Lead</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leads;
