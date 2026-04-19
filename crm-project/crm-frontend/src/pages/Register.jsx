import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'ROLE_SALES'
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <h1>Nexus CRM</h1>
          <p>Create a new account</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-text" style={{marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}
          
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="fullName"
              className="input-field" 
              value={formData.fullName} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              className="input-field" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              className="input-field" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select 
              name="role" 
              className="input-field" 
              value={formData.role} 
              onChange={handleChange}
              style={{ padding: '12px' }}
            >
              <option value="ROLE_SALES">Sales Rep</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
          </div>
          
          <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '1rem'}}>
            Register
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
