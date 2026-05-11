import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/logo.png';
import { authAPI } from '../services/api';

const Login = () => {
  const navigate = useNavigate();

  const colors = {
    primary: '#E8A020',
    secondary: '#E91E8C',
    green: '#4CAF50',
    blue: '#2196F3',
    purple: '#9C27B0',
    dark: '#3E2010',
    light: '#FFF9F0'
  };

  const [formData, setFormData] = useState({
    email: '',
    motDePasse: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    setLoginError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.motDePasse) {
      newErrors.motDePasse = 'Le mot de passe est obligatoire';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validate();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  setLoading(true);
  try {
    const response = await authAPI.login({
      email: formData.email,
      password: formData.motDePasse
    });

    const { user, tokens } = response.data;

    // Sauvegarder les tokens et l'utilisateur
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('user', JSON.stringify(user));

    setLoading(false);

    // Redirection selon le rôle
    if (user.role === 'admin') {
      navigate('/dashboard/admin');
    } else if (user.role === 'gestionnaire') {
      navigate('/dashboard/gestionnaire');
    } else if (user.role === 'caissier') {
      navigate('/dashboard/caissier');
    } else if (user.role === 'comptable') {
      navigate('/dashboard/comptable');
    } else {
  navigate('/mes-reservations');
}
  } catch (error) {
    setLoading(false);
    setLoginError(
      error.response?.data?.error ||
      'Email ou mot de passe incorrect'
    );
  }
};

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.light,
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* NAVBAR */}
      <nav className="navbar navbar-dark shadow"
           style={{backgroundColor: colors.dark}}>
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="Wonderpark" height="50"/>
          </Link>
          <span className="text-white fw-semibold">
            Connexion
          </span>
        </div>
      </nav>

      {/* CONTENU */}
      <div className="container py-5 flex-grow-1">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">

            {/* CARTE */}
            <div className="card shadow-lg border-0"
                 style={{borderRadius: '20px', overflow: 'hidden'}}>

              {/* EN-TÊTE */}
              <div className="card-header text-white text-center py-4"
                   style={{
                     background: `linear-gradient(135deg,
                       ${colors.dark},
                       ${colors.purple})`
                   }}>
                <img src={logo} alt="Wonderpark"
                     height="70" className="mb-2"/>
                <h3 className="fw-bold mb-1">Connexion </h3>
                <p className="mb-0 opacity-75">
                  Connectez-vous à votre compte
                </p>
              </div>

              {/* FORMULAIRE */}
              <div className="card-body p-4">

                {/* Erreur de connexion */}
                {loginError && (
                  <div className="alert alert-danger text-center"
                       role="alert">
                    ❌ {loginError}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Adresse email
                    </label>
                    <div className="input-group">
                      <span className="input-group-text"
                            style={{borderRadius: '10px 0 0 10px'}}>
                        📧
                      </span>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="exemple@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        style={{borderRadius: '0 10px 10px 0'}}
                      />
                      {errors.email && (
                        <div className="invalid-feedback">
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mot de passe */}
                  <div className="mb-2">
                    <label className="form-label fw-semibold">
                      Mot de passe
                    </label>
                    <div className="input-group">
                      <span className="input-group-text"
                            style={{borderRadius: '10px 0 0 10px'}}>
                        🔒
                      </span>
                      <input
                        type="password"
                        name="motDePasse"
                        className={`form-control ${errors.motDePasse ? 'is-invalid' : ''}`}
                        placeholder="Votre mot de passe"
                        value={formData.motDePasse}
                        onChange={handleChange}
                        style={{borderRadius: '0 10px 10px 0'}}
                      />
                      {errors.motDePasse && (
                        <div className="invalid-feedback">
                          {errors.motDePasse}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mot de passe oublié */}
                  <div className="text-end mb-4">
                    <a href="#"
                       className="text-decoration-none small fw-semibold"
                       style={{color: colors.primary}}>
                      Mot de passe oublié ?
                    </a>
                  </div>

                  {/* Bouton connexion */}
                  <button
                    type="submit"
                    className="btn w-100 fw-bold py-3"
                    disabled={loading}
                    style={{
                      background: `linear-gradient(135deg,
                        ${colors.dark},
                        ${colors.purple})`,
                      color: 'white',
                      borderRadius: '15px',
                      fontSize: '1.1rem'
                    }}>
                    {loading ? (
                      <>
                        <span className="spinner-border
                          spinner-border-sm me-2"/>
                        Connexion en cours...
                      </>
                    ) : (
                      '🔑 Se connecter'
                    )}
                  </button>

                  {/* Lien inscription */}
                  <div className="text-center mt-3">
                    <p className="text-muted mb-0">
                      Pas encore de compte ?{' '}
                      <Link to="/register"
                            style={{color: colors.secondary}}
                            className="fw-bold text-decoration-none">
                        S'inscrire
                      </Link>
                    </p>
                  </div>

                </form>
              </div>
            </div>

            {/* Lien retour accueil */}
            <div className="text-center mt-3">
              <Link to="/"
                    className="text-decoration-none fw-semibold"
                    style={{color: colors.dark}}>
                ← Retour à l'accueil
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="py-3 text-white text-center"
              style={{backgroundColor: colors.dark}}>
        <p className="mb-0 small text-muted">
          © 2025 Wonderpark - Place du Souvenir Africain, Dakar
        </p>
      </footer>

    </div>
  );
};

export default Login;