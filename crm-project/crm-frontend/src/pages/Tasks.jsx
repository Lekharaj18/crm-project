import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', dueDate: '', priority: 'MEDIUM', status: 'OPEN' });

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', formData);
            setShowModal(false);
            setFormData({ title: '', description: '', dueDate: '', priority: 'MEDIUM', status: 'OPEN' });
            fetchTasks();
        } catch (error) {
            console.error("Error saving task", error);
        }
    };

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'HIGH': return '#ef4444';
            case 'MEDIUM': return '#f59e0b';
            case 'LOW': return '#10b981';
            default: return '#94a3b8';
        }
    };

    if (loading) return <div>Loading tasks...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Manage your daily to-dos and assignments.</p>
                <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Task</button>
            </div>

            <div className="glass-panel" style={{ padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', background: 'transparent', border: 'none', boxShadow: 'none' }}>
                {tasks.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1 / -1', background: 'var(--glass-bg)', borderRadius: '16px' }}>No tasks found.</div>
                ) : (
                    tasks.map(task => (
                        <div key={task.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{task.title}</h3>
                                <span style={{ 
                                    background: `${getPriorityColor(task.priority)}22`, 
                                    color: getPriorityColor(task.priority),
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold'
                                }}>
                                    {task.priority}
                                </span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>{task.description}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Due: {task.dueDate || 'N/A'}</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: task.status === 'COMPLETED' ? 'var(--success)' : 'var(--accent-primary)' }}>{task.status.replace('_', ' ')}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Simple Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="glass-panel" style={{ width: '500px', padding: '2rem', background: 'var(--bg-secondary)' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Add New Task</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Title</label>
                                <input type="text" className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description</label>
                                <textarea className="input-field" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" required></textarea>
                            </div>
                            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Due Date</label>
                                    <input type="date" className="input-field" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Priority</label>
                                    <select className="input-field" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Status</label>
                                <select className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                    <option value="OPEN">Open</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;
