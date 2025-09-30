import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try{
      const res = await axios.post(import.meta.env.VITE_API_BASE+'/auth/login', { email, password });
      // Save token and user
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    }catch(err){
      setErr(err?.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="card" style={{maxWidth:420}}>
      <h2 style={{margin:0}}>Welcome back</h2>
      <p className="muted">Sign in to manage products</p>
      {err && <div style={{color:'red',marginBottom:8}}>{err}</div>}
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn" style={{width:'100%'}} type="submit">Login</button>
      </form>
      <div style={{marginTop:12}}>Don't have account? <Link to="/register">Register</Link></div>
    </div>
  );
}
