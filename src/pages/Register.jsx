import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/logo.png';
import { authAPI } from '../services/api';

const Register = () => {
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
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    motDePasse: '',
    confirmMotDePasse: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Effacer l'erreur du champ modifié
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = 'Le nom est obligatoire';
    if (!formData.prenom) newErrors.prenom = 'Le prénom est obligatoire';
    if (!formData.email) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.telephone) {
      newErrors.telephone = 'Le téléphone est obligatoire';
    }
    if (!formData.motDePasse) {
      newErrors.motDePasse = 'Le mot de passe est obligatoire';
    } else if (formData.motDePasse.length < 8) {
      newErrors.motDePasse = 'Minimum 8 caractères';
    }
    if (!formData.confirmMotDePasse) {
      newErrors.confirmMotDePasse = 'Confirmez votre mot de passe';
    } else if (formData.motDePasse !== formData.confirmMotDePasse) {
      newErrors.confirmMotDePasse = 'Les mots de passe ne correspondent pas';
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
    await authAPI.register({
      first_name: formData.prenom,
      last_name: formData.nom,
      email: formData.email,
      telephone: formData.telephone,
      password: formData.motDePasse,
      confirm_password: formData.confirmMotDePasse
    });
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  } catch (error) {
    setLoading(false);
    const errors = error.response?.data;
    if (errors) {
      setErrors({
        email: errors.email?.[0] || '',
        motDePasse: errors.password?.[0] || '',
        general: errors.non_field_errors?.[0] || ''
      });
    }
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
            Créer un compte
          </span>
        </div>
      </nav>

      {/* CONTENU */}
      <div className="container py-5 flex-grow-1">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">

            {/* CARTE */}
            <div className="card shadow-lg border-0"
                 style={{borderRadius: '20px', overflow: 'hidden'}}>

              {/* EN-TÊTE */}
              <div className="card-header text-white text-center py-4"
                   style={{
                     background: `linear-gradient(135deg,
                       ${colors.primary},
                       ${colors.secondary})`
                   }}>
                <img src={logo} alt="Wonderpark"
                     height="70" className="mb-2"/>
                <h3 className="fw-bold mb-1">Créer un compte</h3>
                <p className="mb-0 opacity-75">
                  Rejoignez la famille Wonderpark !
                </p>
              </div>

              {/* FORMULAIRE */}
              <div className="card-body p-4">

                {/* Message de succès */}
                {success && (
                  <div className="alert alert-success text-center"
                       role="alert">
                    ✅ Compte créé avec succès !
                    Redirection vers la connexion...
                  </div>
                )}

                {!success && (
                  <form onSubmit={handleSubmit}>

                    {/* Nom et Prénom */}
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Nom *
                        </label>
                        <input
                          type="text"
                          name="nom"
                          className={`form-control ${errors.nom ? 'is-invalid' : ''}`}
                          placeholder="Votre nom"
                          value={formData.nom}
                          onChange={handleChange}
                          style={{borderRadius: '10px'}}
                        />
                        {errors.nom && (
                          <div className="invalid-feedback">
                            {errors.nom}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          name="prenom"
                          className={`form-control ${errors.prenom ? 'is-invalid' : ''}`}
                          placeholder="Votre prénom"
                          value={formData.prenom}
                          onChange={handleChange}
                          style={{borderRadius: '10px'}}
                        />
                        {errors.prenom && (
                          <div className="invalid-feedback">
                            {errors.prenom}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Adresse email *
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

                    {/* Téléphone */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Téléphone *
                      </label>
                      <div className="input-group">
                        <span className="input-group-text"
                              style={{borderRadius: '10px 0 0 10px'}}>
                          📞
                        </span>
                        <input
                          type="tel"
                          name="telephone"
                          className={`form-control ${errors.telephone ? 'is-invalid' : ''}`}
                          placeholder="77 000 00 00"
                          value={formData.telephone}
                          onChange={handleChange}
                          style={{borderRadius: '0 10px 10px 0'}}
                        />
                        {errors.telephone && (
                          <div className="invalid-feedback">
                            {errors.telephone}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mot de passe */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Mot de passe *
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
                          placeholder="Minimum 8 caractères"
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

                    {/* Confirmer mot de passe */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Confirmer le mot de passe *
                      </label>
                      <div className="input-group">
                        <span className="input-group-text"
                              style={{borderRadius: '10px 0 0 10px'}}>
                          🔒
                        </span>
                        <input
                          type="password"
                          name="confirmMotDePasse"
                          className={`form-control ${errors.confirmMotDePasse ? 'is-invalid' : ''}`}
                          placeholder="Répétez votre mot de passe"
                          value={formData.confirmMotDePasse}
                          onChange={handleChange}
                          style={{borderRadius: '0 10px 10px 0'}}
                        />
                        {errors.confirmMotDePasse && (
                          <div className="invalid-feedback">
                            {errors.confirmMotDePasse}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bouton S'inscrire */}
                    <button
                      type="submit"
                      className="btn w-100 fw-bold py-3"
                      disabled={loading}
                      style={{
                        background: `linear-gradient(135deg,
                          ${colors.primary},
                          ${colors.secondary})`,
                        color: 'white',
                        borderRadius: '15px',
                        fontSize: '1.1rem'
                      }}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"/>
                          Création du compte...
                        </>
                      ) : (
                        '🎉 Créer mon compte'
                      )}
                    </button>

                    {/* Lien connexion */}
                    <div className="text-center mt-3">
                      <p className="text-muted mb-0">
                        Déjà un compte ?{' '}
                        <Link to="/login"
                              style={{color: colors.primary}}
                              className="fw-bold text-decoration-none">
                          Se connecter
                        </Link>
                      </p>
                    </div>

                  </form>
                )}
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

export default Register;