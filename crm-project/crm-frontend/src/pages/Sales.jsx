import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ customerId: '', amount: '', status: 'PROPOSAL', date: '' });

    const fetchSales = async () => {
        try {
            const response = await api.get('/sales');
            setSales(response.data);
        } catch (error) {
            console.error("Error fetching sales", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers", error);
        }
    };

    useEffect(() => {
        fetchSales();
        fetchCustomers();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                customer: { id: formData.customerId },
                amount: parseFloat(formData.amount),
                status: formData.status,
                date: formData.date
            };
            
            if (formData.id) {
                await api.put(`/sales/${formData.id}`, payload);
            } else {
                await api.post('/sales', payload);
            }
            setShowModal(false);
            setFormData({ customerId: '', amount: '', status: 'PROPOSAL', date: '' });
            fetchSales();
        } catch (error) {
            console.error("Error saving sale", error);
        }
    };

    if (loading) return <div>Loading pipeline...</div>;

    // Define columns for Kanban board
    const columns = [
        { id: 'PROPOSAL', label: 'Proposal' },
        { id: 'NEGOTIATION', label: 'Negotiation' },
        { id: 'CLOSED_WON', label: 'Closed Won' },
        { id: 'CLOSED_LOST', label: 'Closed Lost' }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Track total value through your sales pipeline.</p>
                <button className="btn-primary" onClick={() => { setFormData({ customerId: '', amount: '', status: 'PROPOSAL', date: '' }); setShowModal(true); }}>+ Add Deal</button>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', height: 'calc(100vh - 200px)' }}>
                {columns.map(col => (
                    <div key={col.id} className="glass-panel" style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{col.label}</h3>
                            <span style={{ background: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>
                                {sales.filter(s => s.status === col.id).length}
                            </span>
                        </div>
                        
                        <div style={{ padding: '1rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {sales.filter(s => s.status === col.id).map(deal => (
                                <div key={deal.id} style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)', cursor: 'pointer' }} onClick={() => { setFormData({ id: deal.id, customerId: deal.customer?.id || '', amount: deal.amount, status: deal.status, date: deal.date }); setShowModal(true); }}>
                                    <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{deal.customer?.name || 'Unknown Client'}</div>
                                    <div style={{ color: 'var(--accent-primary)', fontSize: '1.1rem', fontWeight: 'bold' }}>{formatCurrency(deal.amount)}</div>
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Date: {deal.date || 'N/A'}</div>
                                </div>
                            ))}
                            {sales.filter(s => s.status === col.id).length === 0 && (
                                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1rem' }}>No deals</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="glass-panel" style={{ width: '500px', padding: '2rem', background: 'var(--bg-secondary)' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>{formData.id ? 'Edit Deal' : 'Add New Deal'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Select Customer</label>
                                <select className="input-field" value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})} required>
                                    <option value="" disabled>Select a customer</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Amount ($)</label>
                                <input type="number" step="0.01" className="input-field" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
                            </div>
                            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Status</label>
                                    <select className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                        <option value="PROPOSAL">Proposal</option>
                                        <option value="NEGOTIATION">Negotiation</option>
                                        <option value="CLOSED_WON">Closed Won</option>
                                        <option value="CLOSED_LOST">Closed Lost</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Expected Date</label>
                                    <input type="date" className="input-field" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Deal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sales;
