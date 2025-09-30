import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [role,setRole]=useState('user');
  const [err,setErr]=useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try{
      const res = await axios.post(import.meta.env.VITE_API_BASE+'/auth/register', { name, email, password, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    }catch(err){
      setErr(err?.response?.data?.error || 'Register failed');
    }
  };

  return (
    <div className="card" style={{maxWidth:500}}>
      <h2 style={{margin:0}}>Create an account</h2>
      <p className="muted">Quick sign up to manage products</p>
      {err && <div style={{color:'red',marginBottom:8}}>{err}</div>}
      <form onSubmit={submit}>
        <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <select value={role} onChange={e=>setRole(e.target.value)} style={{marginBottom:12}}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button className="btn" style={{width:'100%'}} type="submit">Register</button>
      </form>
      <div style={{marginTop:12}}>Already registered? <Link to="/login">Login</Link></div>
    </div>
  );
}
