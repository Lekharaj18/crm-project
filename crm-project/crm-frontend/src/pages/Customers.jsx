import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Add/Edit Modal state
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', address: '', notes: '' });
    
    // View Modal state
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/customers', formData);
            setShowModal(false);
            setFormData({ name: '', email: '', phone: '', company: '', address: '', notes: '' });
            fetchCustomers();
        } catch (error) {
            console.error("Error saving customer", error);
        }
    };

    if (loading) return <div>Loading customers...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Manage your client database below.</p>
                <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Customer</button>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Company</th>
                            <th style={{ padding: '1rem' }}>Email</th>
                            <th style={{ padding: '1rem' }}>Phone</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No customers found.</td>
                            </tr>
                        ) : (
                            customers.map(customer => (
                                <tr key={customer.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem' }}>{customer.name}</td>
                                    <td style={{ padding: '1rem' }}>{customer.company}</td>
                                    <td style={{ padding: '1rem' }}>{customer.email}</td>
                                    <td style={{ padding: '1rem' }}>{customer.phone}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <button onClick={() => { setSelectedCustomer(customer); setShowViewModal(true); }} style={{ background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>View</button>
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
                        <h2 style={{ marginBottom: '1.5rem' }}>Add New Customer</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Name</label>
                                <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                            </div>
                            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
                                    <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Phone</label>
                                    <input type="text" className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                </div>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Company</label>
                                <input type="text" className="input-field" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Customer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* View Modal */}
            {showViewModal && selectedCustomer && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="glass-panel" style={{ width: '500px', padding: '2rem', background: 'var(--bg-secondary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>Customer Details</h2>
                            <button onClick={() => setShowViewModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Name</p>
                            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{selectedCustomer.name}</p>
                        </div>
                        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Email</p>
                                <p>{selectedCustomer.email}</p>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Phone</p>
                                <p>{selectedCustomer.phone || 'N/A'}</p>
                            </div>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Company</p>
                            <p>{selectedCustomer.company || 'N/A'}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                            <button className="btn-primary" onClick={() => setShowViewModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
