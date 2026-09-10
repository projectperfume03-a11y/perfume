import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { username, password });
      login(res.access_token, res.username);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="vip-login">
      <div className="vip-card">
        <div className="vip-login-brand">
          <img src="/roya-wordmark-gold.png" alt="ROYA" className="vip-logo-wordmark" />
          <h1>Espace administrateur</h1>
          <p>Accès réservé — Maison ROYA</p>
        </div>

        <form onSubmit={submit}>
          <div className="form-row">
            <label htmlFor="adm-user">Identifiant</label>
            <input
              id="adm-user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="adm-pass">Mot de passe</label>
            <input
              id="adm-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn-gold btn-block" disabled={loading}>
            {loading ? <span className="spinner-inline" /> : 'Ouvrir la session'}
          </button>

          <Link to="/" className="vip-backlink">
            <ArrowLeft size={14} strokeWidth={1.8} />
            Retour à la boutique
          </Link>
        </form>
      </div>
    </div>
  );
}
