import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const { instance } = useMsal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await instance.loginRedirect(loginRequest);
    } catch (e: any) {
      setError('Error al iniciar sesión. Intente nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo-wrapper">
          <img src="/hospital-buin-paine-dashboard/logo-buin-paine.png" alt="Hospital Buin Paine" className="login-logo" />
        </div>
        <h1 className="login-title">Dashboard</h1>
        <p className="login-subtitle">Hospital Buin Paine</p>
        <p className="login-description">
          Inicie sesión con su cuenta corporativa Microsoft 365 para acceder.
        </p>
        <button
          className="login-btn-microsoft"
          onClick={handleLogin}
          disabled={loading}
        >
          <MicrosoftIcon />
          {loading ? 'Redirigiendo...' : 'Iniciar sesión con Microsoft'}
        </button>
        {error && <p className="login-error">{error}</p>}
        <p className="login-footer">
          Acceso exclusivo para personal autorizado de Dominion Global
        </p>
      </div>
    </div>
  );
};

const MicrosoftIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
  </svg>
);
