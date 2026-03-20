import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import './LoginPage.css';

const base = import.meta.env.BASE_URL;

export const LoginPage: React.FC = () => {
  const { instance } = useMsal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await instance.loginRedirect(loginRequest);
    } catch {
      setError('Error al iniciar sesión. Intente nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Panel izquierdo — branding */}
      <div className="login-panel-left">
        <div className="login-brand">
          <img src={`${base}logo-dominion.png`} alt="Dominion" className="login-logo-dominion" />
        </div>
        <div className="login-hero">
          <h1 className="login-hero-title">Dashboard<br />Hospital Buin Paine<br />Mobiliario No Clínico</h1>
        </div>
        <p className="login-panel-footer">
          © {new Date().getFullYear()} Dominion Global · Todos los derechos reservados
        </p>
      </div>

      {/* Panel derecho — formulario */}
      <div className="login-panel-right">
        <div className="login-card">
          <div className="login-hospital-logo-wrap">
            <img
              src={`${base}logo-buin-paine.png`}
              alt="Hospital Buin Paine"
              className="login-hospital-logo"
            />
          </div>
          <h2 className="login-card-title">Iniciar sesión</h2>
          <p className="login-card-desc">
            Usa tu cuenta corporativa Microsoft 365 para acceder al sistema.
          </p>
          <button
            className="login-btn-microsoft"
            onClick={handleLogin}
            disabled={loading}
          >
            <MicrosoftIcon />
            {loading ? 'Redirigiendo a Microsoft...' : 'Continuar con Microsoft'}
          </button>
          {error && <p className="login-error">{error}</p>}
          <p className="login-card-footer">
            Acceso exclusivo para personal autorizado
          </p>
        </div>
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
