import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    leads: 0,
    tasks: 0,
    salesValue: 0,
    activeLeads: 0,
    completedTasks: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const dummyChartData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 6000 },
    { name: 'Wed', revenue: 5500 },
    { name: 'Thu', revenue: 8780 },
    { name: 'Fri', revenue: 7890 },
    { name: 'Sat', revenue: 11000 },
    { name: 'Sun', revenue: 13490 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [customersRes, leadsRes, tasksRes, salesRes] = await Promise.all([
          api.get('/customers'),
          api.get('/leads'),
          api.get('/tasks'),
          api.get('/sales')
        ]);

        const customers = customersRes.data;
        const leads = leadsRes.data;
        const tasks = tasksRes.data;
        const sales = salesRes.data;

        const totalSalesValue = sales.reduce((sum, sale) => sum + (sale.amount || 0), 0);
        const activeLeads = leads.filter(l => l.status !== 'LOST' && l.status !== 'CONVERTED').length;
        const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;

        setStats({
          customers: customers.length,
          leads: leads.length,
          tasks: tasks.length,
          salesValue: totalSalesValue,
          activeLeads,
          completedTasks
        });

        // Get 4 most recent tasks
        setRecentTasks(tasks.slice(0, 4));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}><div style={{ color: 'var(--accent-primary)', fontSize: '1.2rem' }}>Loading Dashboard Data...</div></div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Welcome back to Nexus
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', background: 'var(--accent-glow)', filter: 'blur(30px)', borderRadius: '50%' }}></div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Total Revenue Expected</span>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{formatCurrency(stats.salesValue)}</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', background: 'rgba(16, 185, 129, 0.2)', filter: 'blur(30px)', borderRadius: '50%' }}></div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Total Customers</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.customers}</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', background: 'rgba(245, 158, 11, 0.2)', filter: 'blur(30px)', borderRadius: '50%' }}></div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Active Leads</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.activeLeads}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '6px' }}>/ {stats.leads} total</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', background: 'rgba(239, 68, 68, 0.2)', filter: 'blur(30px)', borderRadius: '50%' }}></div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Tasks Completed</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.completedTasks}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '6px' }}>/ {stats.tasks} done</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
        {/* Quick Actions & Overview */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/customers')} style={{ flex: '1', minWidth: '150px' }}>+ New Customer</button>
            <button className="btn-primary" onClick={() => navigate('/leads')} style={{ flex: '1', minWidth: '150px', background: 'linear-gradient(135deg, #10b981, #059669)' }}>+ Add Lead</button>
            <button className="btn-primary" onClick={() => navigate('/tasks')} style={{ flex: '1', minWidth: '150px', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>+ Create Task</button>
          </div>

          <div style={{ marginTop: '2rem', height: '250px', background: 'var(--bg-primary)', borderRadius: '8px', padding: '1rem', border: '1px solid var(--border-light)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-light)', borderRadius: '8px' }} itemStyle={{ color: 'var(--text-primary)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#38bdf8" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>Recent Tasks</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentTasks.length > 0 ? recentTasks.map(task => (
              <div key={task.id} style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '8px', borderLeft: `3px solid ${task.priority === 'HIGH' ? 'var(--danger)' : task.priority === 'MEDIUM' ? 'var(--warning)' : 'var(--success)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <strong style={{ fontSize: '0.95rem' }}>{task.title}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{task.dueDate || 'No Date'}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.description}</p>
              </div>
            )) : (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>No tasks found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
