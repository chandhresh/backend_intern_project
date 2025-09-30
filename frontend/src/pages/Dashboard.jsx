import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [msg, setMsg] = useState('');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || null);
  const token = localStorage.getItem('token');

  //if no token
  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      loadProducts();
    }
  }, []);

  // Axios 
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    headers: { Authorization: `Bearer ${token}` }
  });

  const loadProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      setMsg(err?.response?.data?.error || 'Could not load products');
      if (err.response?.status === 401) logout();
    }
  };

  const create = async (e) => {
    e.preventDefault();
    try {
      const cleanedPrice = Number(price.replace(/,/g, ''));
      const cleanedStock = Number(stock);
      if (isNaN(cleanedPrice) || isNaN(cleanedStock)) {
        setMsg('Price and Stock must be valid numbers');
        return;
      }

      await api.post('/products', {
        name,
        price: cleanedPrice,
        category,
        stock: cleanedStock
      });
      setName('');
      setPrice('');
      setCategory('');
      setStock('');
      setMsg('');
      loadProducts();
    } catch (err) {
      setMsg(err?.response?.data?.error || 'Create failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete product?')) return;
    try {
      await api.delete('/products/' + id);
      loadProducts();
    } catch (e) {
      setMsg('Delete failed');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="card">
      <div className="topbar">
        <div>
          <h2 style={{ margin: 0 }}>Product Dashboard</h2>
          <div className="muted">
            Manage products — signed in as {user?.name || 'Guest'} ({user?.role || 'user'})
          </div>
        </div>
        <div>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="row" style={{ marginBottom: 16 }}>
        <div className="col">
          {user?.role === 'admin' && (
            <form onSubmit={create}>
              <input placeholder="Product name" value={name} onChange={e => setName(e.target.value)} required />
              <input
                placeholder="Price"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
              />
              <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} required />
              <input placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} required />
              <button className="btn" type="submit" style={{ marginTop: 8 }}>Add product</button>
            </form>
          )}
        </div>
        <div className="col">
          {msg && <div style={{ color: 'red' }}>{msg}</div>}
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                {user?.role === 'admin' && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>₹{p.price.toLocaleString('en-IN')}</td>
                  <td>{p.category}</td>
                  <td>{p.stock}</td>
                  {user?.role === 'admin' && (
                    <td>
                      <button className="btn" style={{ background: '#ff6b6b' }} onClick={() => remove(p._id)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
