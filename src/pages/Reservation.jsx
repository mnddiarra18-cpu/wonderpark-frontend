import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/logo.png';
import { reservationAPI } from '../services/api';

const Reservation = () => {
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

  const formules = [
    {
      id: 1,
      nom: 'Demi-Journée',
      description: 'Accès Piscine + Aire de Jeu',
      prix: 5000,
      duree: 'Demi-journée',
      emoji: '⏰',
      couleur: colors.blue,
      inclus: ['Accès Piscine', 'Accès Aire de Jeu'],
      nonInclus: ['Goûter']
    },
    {
      id: 2,
      nom: 'Journée Entière',
      description: 'Accès Piscine + Aire de Jeu + Goûter',
      prix: 10000,
      duree: 'Journée complète',
      emoji: '☀️',
      couleur: colors.primary,
      inclus: ['Accès Piscine', 'Accès Aire de Jeu', 'Goûter offert'],
      nonInclus: []
    },
    {
      id: 3,
      nom: 'Aire de Jeu 1h',
      description: 'Accès Aire de Jeu uniquement - 1 heure',
      prix: 5000,
      duree: '1 heure',
      emoji: '🎠',
      couleur: colors.green,
      inclus: ['Accès Aire de Jeu'],
      nonInclus: ['Piscine', 'Goûter']
    },
    {
      id: 4,
      nom: 'Aire de Jeu 2h',
      description: 'Accès Aire de Jeu + Goûter - 2 heures',
      prix: 10000,
      duree: '2 heures',
      emoji: '🎡',
      couleur: colors.purple,
      inclus: ['Accès Aire de Jeu', 'Goûter inclus'],
      nonInclus: ['Piscine']
    },
    {
      id: 5,
      nom: 'Anniversaire',
      description: 'Espace privatisé + Activités + Goûter',
      prix: 0,
      duree: 'Sur devis',
      emoji: '🎂',
      couleur: colors.secondary,
      inclus: ['Espace privatisé', 'Activités au choix', 'Goûter inclus'],
      nonInclus: []
    }
  ];

  const creneaux = [
    '08h00 - 10h00',
    '10h00 - 12h00',
    '12h00 - 14h00',
    '14h00 - 16h00',
    '16h00 - 18h00',
    '18h00 - 20h00'
  ];

  const [etape, setEtape] = useState(1);
  const [formData, setFormData] = useState({
    formule: null,
    date: '',
    creneau: '',
    nombreEnfants: 1,
    nombreAccompagnateurs: 1,
    enfants: [{ nom: '', prenom: '', age: '' }],
    modePaiement: '',
    notes: '',
    genreAnniversaire: '',
    themeAnniversaire: '',
    ageAnniversaire: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Obtenir la date minimum (aujourd'hui)
  const today = new Date().toISOString().split('T')[0];

  const handleFormuleSelect = (formule) => {
    setFormData({ ...formData, formule });
    setErrors({ ...errors, formule: '' });
  };

  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
  setErrors({ ...errors, [name]: '' });
};

  const handleEnfantChange = (index, field, value) => {
  const newEnfants = [...formData.enfants];
  newEnfants[index] = { ...newEnfants[index], [field]: value };
  setFormData({ ...formData, enfants: newEnfants });
};

  const calculerMontant = () => {
    if (!formData.formule) return 0;
    if (formData.formule.prix === 0) return 'Sur devis';

    const prixFormule = formData.formule.prix * formData.nombreEnfants;
    const accompagnateursPay = Math.max(0, formData.nombreAccompagnateurs - 1);
    const prixAccompagnateurs = accompagnateursPay * 2000;
    const total = prixFormule + prixAccompagnateurs;

    return total.toLocaleString('fr-FR');
  };

  const validerEtape1 = () => {
    const newErrors = {};
    if (!formData.formule) newErrors.formule = 'Choisissez une formule';
    if (!formData.date) newErrors.date = 'Choisissez une date';
    if (!formData.creneau) newErrors.creneau = 'Choisissez un créneau';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const validerEtape2 = () => {
  const newErrors = {};
  if (formData.formule?.nom === 'Anniversaire') {
    if (!formData.ageAnniversaire) {
      newErrors.ageAnniversaire = 'L\'âge est requis';
    }
    if (!formData.genreAnniversaire) {
      newErrors.genreAnniversaire = 'Choisissez le genre';
    }
    if (!formData.themeAnniversaire) {
      newErrors.themeAnniversaire = 'Choisissez un thème';
    }
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const validerEtape3 = () => {
    const newErrors = {};
    if (!formData.modePaiement) {
      newErrors.modePaiement = 'Choisissez un mode de paiement';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const etapeSuivante = () => {
    if (etape === 1 && validerEtape1()) setEtape(2);
    else if (etape === 2 && validerEtape2()) setEtape(3);
    else if (etape === 3 && validerEtape3()) setEtape(4);
  };

  const etapePrecedente = () => {
    if (etape > 1) setEtape(etape - 1);
  };

  

const handleSubmit = async () => {
  setLoading(true);
  try {
    const prixFormule = formData.formule.prix * formData.nombreEnfants;
    const accompagnateursPay = Math.max(
      0, formData.nombreAccompagnateurs - 1
    );
    const prixAccompagnateurs = accompagnateursPay * 2000;
    const montantTotal = prixFormule + prixAccompagnateurs;

    // Appel API Django
    const response = await reservationAPI.creer({
  formule_id: formData.formule.id,
  date: formData.date,
  nombre_enfants: formData.nombreEnfants,
  nombre_accompagnateurs: parseInt(formData.nombreAccompagnateurs),
  enfants: formData.enfants.map(e => ({ age: parseInt(e.age) })),
  mode_paiement: formData.modePaiement,
  notes: formData.notes,
  genre_anniversaire: formData.genreAnniversaire || '',
  theme_anniversaire: formData.themeAnniversaire || '',
  age_anniversaire: formData.ageAnniversaire || ''
});

    setLoading(false);

    if (formData.modePaiement === 'en_ligne') {
      navigate('/paiement', {
        state: {
          reservationId: response.data.reservation.id,
          formule: formData.formule.nom,
          emoji: formData.formule.emoji,
          date: formData.date,
          creneau: formData.creneau,
          nombreEnfants: formData.nombreEnfants,
          nombreAccompagnateurs: formData.nombreAccompagnateurs,
          accompagnateursPay: accompagnateursPay,
          montantFormule: prixFormule,
          montantAccompagnateurs: prixAccompagnateurs,
          montantTotal: montantTotal
        }
      });
    } else {
      setEtape(5);
    }
  } catch (error) {
  setLoading(false);
  console.log('Détail erreur:', error.response?.data);
  alert('Erreur: ' + JSON.stringify(error.response?.data));
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
        style={{ backgroundColor: colors.dark }}>
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="Wonderpark" height="50" />
          </Link>
          <span className="text-white fw-semibold">
            Réservation en ligne
          </span>
        </div>
      </nav>

      <div className="container py-4 flex-grow-1">

        {/* BARRE DE PROGRESSION */}
        {etape < 5 && (
          <div className="row justify-content-center mb-4">
            <div className="col-md-8">
              <div className="d-flex justify-content-between
                              align-items-center mb-2">
                {['Formule', 'Enfants', 'Paiement',
                  'Confirmation'].map((label, i) => (
                    <div key={i} className="text-center flex-fill">
                      <div className="rounded-circle d-inline-flex
                                    align-items-center justify-content-center
                                    fw-bold mb-1"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: etape > i
                            ? colors.green
                            : etape === i + 1
                              ? colors.primary
                              : '#ddd',
                          color: etape >= i + 1 ? 'white' : '#999',
                          fontSize: '0.9rem'
                        }}>
                        {etape > i ? '✓' : i + 1}
                      </div>
                      <div className="small fw-semibold"
                        style={{
                          color: etape >= i + 1
                            ? colors.dark
                            : '#999'
                        }}>
                        {label}
                      </div>
                    </div>
                  ))}
              </div>
              <div className="progress" style={{ height: '6px' }}>
                <div className="progress-bar"
                  style={{
                    width: `${((etape - 1) / 3) * 100}%`,
                    backgroundColor: colors.primary
                  }} />
              </div>
            </div>
          </div>
        )}

        <div className="row justify-content-center">
          <div className="col-md-9 col-lg-8">

            {/* ÉTAPE 1 : CHOIX FORMULE */}
            {etape === 1 && (
              <div>
                <h4 className="fw-bold mb-4 text-center"
                  style={{ color: colors.dark }}>
                  🎯 Choisissez votre formule
                </h4>

                {errors.formule && (
                  <div className="alert alert-danger">
                    {errors.formule}
                  </div>
                )}

                <div className="row g-3 mb-4">
                  {formules.map((formule) => (
                    <div className="col-md-6" key={formule.id}>
                      <div
                        className="card h-100 border-2"
                        style={{
                          borderRadius: '15px',
                          cursor: 'pointer',
                          border: formData.formule?.id === formule.id
                            ? `3px solid ${formule.couleur}`
                            : '2px solid #eee',
                          backgroundColor:
                            formData.formule?.id === formule.id
                              ? `${formule.couleur}15`
                              : 'white',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => handleFormuleSelect(formule)}>
                        <div className="card-body p-3">
                          <div className="d-flex align-items-center mb-2">
                            <span className="fs-3 me-2">
                              {formule.emoji}
                            </span>
                            <div>
                              <h6 className="fw-bold mb-0"
                                style={{ color: formule.couleur }}>
                                {formule.nom}
                              </h6>
                              <small className="text-muted">
                                {formule.duree}
                              </small>
                            </div>
                            <div className="ms-auto fw-bold"
                              style={{ color: formule.couleur }}>
                              {formule.prix === 0
                                ? 'Sur devis'
                                : `${formule.prix.toLocaleString()} F`}
                            </div>
                          </div>
                          <ul className="list-unstyled mb-0 small">
                            {formule.inclus.map((item, i) => (
                              <li key={i} className="text-success">
                                ✅ {item}
                              </li>
                            ))}
                            {formule.nonInclus.map((item, i) => (
                              <li key={i} className="text-muted">
                                ❌ {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Date et Créneau */}
                <div className="card border-0 shadow-sm p-4 mb-4"
                  style={{ borderRadius: '15px' }}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        📅 Date de réservation *
                      </label>
                      <input
                        type="date"
                        name="date"
                        className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                        min={today}
                        value={formData.date}
                        onChange={handleChange}
                        style={{ borderRadius: '10px' }}
                      />
                      {errors.date && (
                        <div className="invalid-feedback">
                          {errors.date}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        🕐 Créneau horaire *
                      </label>
                      <select
                        name="creneau"
                        className={`form-select ${errors.creneau ? 'is-invalid' : ''}`}
                        value={formData.creneau}
                        onChange={handleChange}
                        style={{ borderRadius: '10px' }}>
                        <option value="">Choisir un créneau</option>
                        {creneaux.map((c, i) => (
                          <option key={i} value={c}>{c}</option>
                        ))}
                      </select>
                      {errors.creneau && (
                        <div className="invalid-feedback">
                          {errors.creneau}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  className="btn w-100 fw-bold py-3"
                  onClick={etapeSuivante}
                  style={{
                    backgroundColor: colors.primary,
                    color: 'white',
                    borderRadius: '15px',
                    fontSize: '1.1rem'
                  }}>
                  Continuer →
                </button>
              </div>
            )}

            {/* ÉTAPE 2 : INFORMATIONS */}
{etape === 2 && (
  <div>
    <h4 className="fw-bold mb-4 text-center"
        style={{color: colors.dark}}>
      👶 Informations
    </h4>

    <div className="card border-0 shadow-sm p-4 mb-4"
         style={{borderRadius: '15px'}}>

      {/* Nombre d'enfants et accompagnateurs */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="form-label fw-semibold">
            👶 Nombre d'enfants
          </label>
          <input
            type="number"
            name="nombreEnfants"
            className="form-control"
            min="1"
            max="20"
            value={formData.nombreEnfants}
            onChange={handleChange}
            style={{borderRadius: '10px'}}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">
            👨‍👩‍👧 Nombre d'accompagnateurs
          </label>
          <input
            type="number"
            name="nombreAccompagnateurs"
            className="form-control"
            min="1"
            max="10"
            value={formData.nombreAccompagnateurs}
            onChange={handleChange}
            style={{borderRadius: '10px'}}
          />
          <small className="text-success mt-1 d-block">
            ✅ 1er gratuit | 🥤 Boisson offerte pour tous
          </small>
        </div>
      </div>

      {/* Section Anniversaire uniquement */}
      {formData.formule?.nom === 'Anniversaire' && (
        <div className="mt-2">
          <div className="p-3 rounded mb-4"
               style={{
                 backgroundColor: `${colors.secondary}10`,
                 border: `2px solid ${colors.secondary}30`,
                 borderRadius: '15px'
               }}>
            <h6 className="fw-bold mb-3"
                style={{color: colors.secondary}}>
              🎉 Détails de l'anniversaire
            </h6>

            {/* Âge de l'enfant */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                🎂 Âge de l'enfant qui fête son anniversaire
              </label>
              <input
                type="number"
                name="ageAnniversaire"
                className={`form-control ${errors.ageAnniversaire ? 'is-invalid' : ''}`}
                placeholder="Ex: 5"
                min="1"
                max="18"
                value={formData.ageAnniversaire}
                onChange={handleChange}
                style={{
                  borderRadius: '10px',
                  maxWidth: '200px'
                }}
              />
              {errors.ageAnniversaire && (
                <div className="invalid-feedback">
                  {errors.ageAnniversaire}
                </div>
              )}
            </div>

            {/* Genre */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                L'enfant est :
              </label>
              {errors.genreAnniversaire && (
                <div className="text-danger small mb-2">
                  {errors.genreAnniversaire}
                </div>
              )}
              <div className="row g-3">
                <div className="col-6">
                  <div
                    className="card text-center p-3"
                    style={{
                      borderRadius: '15px',
                      cursor: 'pointer',
                      border: formData.genreAnniversaire === 'garcon'
                        ? `3px solid ${colors.blue}`
                        : '2px solid #eee',
                      backgroundColor:
                        formData.genreAnniversaire === 'garcon'
                        ? `${colors.blue}15`
                        : 'white',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setFormData({
                      ...formData,
                      genreAnniversaire: 'garcon',
                      themeAnniversaire: ''
                    })}>
                    <div className="fs-1">👦</div>
                    <span className="fw-bold"
                          style={{color: colors.blue}}>
                      Garçon
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    className="card text-center p-3"
                    style={{
                      borderRadius: '15px',
                      cursor: 'pointer',
                      border: formData.genreAnniversaire === 'fille'
                        ? `3px solid ${colors.secondary}`
                        : '2px solid #eee',
                      backgroundColor:
                        formData.genreAnniversaire === 'fille'
                        ? `${colors.secondary}15`
                        : 'white',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setFormData({
                      ...formData,
                      genreAnniversaire: 'fille',
                      themeAnniversaire: ''
                    })}>
                    <div className="fs-1">👧</div>
                    <span className="fw-bold"
                          style={{color: colors.secondary}}>
                      Fille
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thèmes Garçon */}
            {formData.genreAnniversaire === 'garcon' && (
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  🦸 Choisissez un thème Super-Héros :
                </label>
                {errors.themeAnniversaire && (
                  <div className="text-danger small mb-2">
                    {errors.themeAnniversaire}
                  </div>
                )}
                <div className="row g-2">
                  {[
                    {
                      id: 'spiderman',
                      nom: 'Spider-Man',
                      emoji: '🕷️',
                      couleur: '#E53935'
                    },
                    {
                      id: 'batman',
                      nom: 'Batman',
                      emoji: '🦇',
                      couleur: '#212121'
                    },
                    {
                      id: 'superman',
                      nom: 'Superman',
                      emoji: '⚡',
                      couleur: '#1565C0'
                    },
                    {
                      id: 'ironman',
                      nom: 'Iron Man',
                      emoji: '🤖',
                      couleur: '#E53935'
                    },
                    {
                      id: 'captain_america',
                      nom: 'Captain America',
                      emoji: '🛡️',
                      couleur: '#1565C0'
                    },
                    {
                      id: 'thor',
                      nom: 'Thor',
                      emoji: '⚡',
                      couleur: '#7B1FA2'
                    },
                    {
                      id: 'hulk',
                      nom: 'Hulk',
                      emoji: '💪',
                      couleur: '#2E7D32'
                    },
                    {
                      id: 'black_panther',
                      nom: 'Black Panther',
                      emoji: '🐾',
                      couleur: '#212121'
                    }
                  ].map((theme) => (
                    <div className="col-6 col-md-3" key={theme.id}>
                      <div
                        className="card text-center p-2 h-100"
                        style={{
                          borderRadius: '12px',
                          cursor: 'pointer',
                          border: formData.themeAnniversaire === theme.id
                            ? `3px solid ${theme.couleur}`
                            : '2px solid #eee',
                          backgroundColor:
                            formData.themeAnniversaire === theme.id
                            ? `${theme.couleur}15`
                            : 'white',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => setFormData({
                          ...formData,
                          themeAnniversaire: theme.id
                        })}>
                        <div className="fs-2">{theme.emoji}</div>
                        <small className="fw-bold d-block"
                               style={{
                                 color: theme.couleur,
                                 fontSize: '0.7rem'
                               }}>
                          {theme.nom}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Thèmes Fille */}
            {formData.genreAnniversaire === 'fille' && (
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  👸 Choisissez un thème Princesse :
                </label>
                {errors.themeAnniversaire && (
                  <div className="text-danger small mb-2">
                    {errors.themeAnniversaire}
                  </div>
                )}
                <div className="row g-2">
                  {[
                    {
                      id: 'cinderella',
                      nom: 'Cendrillon',
                      emoji: '👠',
                      couleur: '#1565C0'
                    },
                    {
                      id: 'belle',
                      nom: 'Belle',
                      emoji: '🌹',
                      couleur: '#E91E63'
                    },
                    {
                      id: 'ariel',
                      nom: 'Ariel',
                      emoji: '🧜',
                      couleur: '#00ACC1'
                    },
                    {
                      id: 'rapunzel',
                      nom: 'Raiponce',
                      emoji: '🌸',
                      couleur: '#7B1FA2'
                    },
                    {
                      id: 'elsa',
                      nom: 'Elsa',
                      emoji: '❄️',
                      couleur: '#0288D1'
                    },
                    {
                      id: 'moana',
                      nom: 'Vaiana',
                      emoji: '🌊',
                      couleur: '#F57C00'
                    },
                    {
                      id: 'tiana',
                      nom: 'Tiana',
                      emoji: '🐸',
                      couleur: '#2E7D32'
                    },
                    {
                      id: 'jasmine',
                      nom: 'Jasmine',
                      emoji: '✨',
                      couleur: '#00897B'
                    }
                  ].map((theme) => (
                    <div className="col-6 col-md-3" key={theme.id}>
                      <div
                        className="card text-center p-2 h-100"
                        style={{
                          borderRadius: '12px',
                          cursor: 'pointer',
                          border: formData.themeAnniversaire === theme.id
                            ? `3px solid ${theme.couleur}`
                            : '2px solid #eee',
                          backgroundColor:
                            formData.themeAnniversaire === theme.id
                            ? `${theme.couleur}15`
                            : 'white',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => setFormData({
                          ...formData,
                          themeAnniversaire: theme.id
                        })}>
                        <div className="fs-2">{theme.emoji}</div>
                        <small className="fw-bold d-block"
                               style={{
                                 color: theme.couleur,
                                 fontSize: '0.7rem'
                               }}>
                          {theme.nom}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Besoins spécifiques */}
      <div className="mt-3">
        <label className="form-label fw-semibold">
          📝 Besoins spécifiques (optionnel)
        </label>
        <textarea
          name="notes"
          className="form-control"
          rows="3"
          placeholder="Allergies, besoins spéciaux, demandes particulières..."
          value={formData.notes}
          onChange={handleChange}
          style={{borderRadius: '10px'}}
        />
      </div>
    </div>

    <div className="d-flex gap-3">
      <button
        className="btn fw-bold py-3 flex-fill"
        onClick={etapePrecedente}
        style={{
          backgroundColor: '#eee',
          color: colors.dark,
          borderRadius: '15px'
        }}>
        ← Retour
      </button>
      <button
        className="btn fw-bold py-3 flex-fill"
        onClick={etapeSuivante}
        style={{
          backgroundColor: colors.primary,
          color: 'white',
          borderRadius: '15px'
        }}>
        Continuer →
      </button>
    </div>
  </div>
)}

            {/* ÉTAPE 3 : MODE DE PAIEMENT */}
            {etape === 3 && (
              <div>
                <h4 className="fw-bold mb-4 text-center"
                  style={{ color: colors.dark }}>
                  💳 Mode de paiement
                </h4>
                {/* RÉCAPITULATIF */}
<div className="card border-0 shadow-sm p-4 mb-4"
     style={{
       borderRadius: '15px',
       borderLeft: `5px solid ${colors.primary}`
     }}>
  <h6 className="fw-bold mb-3"
      style={{color: colors.dark}}>
    📋 Récapitulatif
  </h6>
  <div className="row">
    <div className="col-6">
      <p className="text-muted mb-1 small">Formule</p>
      <p className="fw-bold mb-0">
        {formData.formule?.emoji} {formData.formule?.nom}
      </p>
    </div>
    <div className="col-6">
      <p className="text-muted mb-1 small">Date</p>
      <p className="fw-bold mb-0">{formData.date}</p>
    </div>
    <div className="col-6 mt-2">
      <p className="text-muted mb-1 small">Créneau</p>
      <p className="fw-bold mb-0">{formData.creneau}</p>
    </div>
    <div className="col-6 mt-2">
      <p className="text-muted mb-1 small">Enfants</p>
      <p className="fw-bold mb-0">
        {formData.nombreEnfants} enfant(s)
      </p>
    </div>
    <div className="col-6 mt-2">
      <p className="text-muted mb-1 small">Accompagnateurs</p>
      <p className="fw-bold mb-0">
        {formData.nombreAccompagnateurs} personne(s)
      </p>
    </div>
    <div className="col-6 mt-2">
      <p className="text-muted mb-1 small">Boisson</p>
      <p className="fw-bold mb-0 text-success">
        ✅ Offerte pour tous
      </p>
    </div>
  </div>
  <hr/>

  {/* DÉTAIL MONTANT */}
  <div className="d-flex justify-content-between mb-1">
    <small className="text-muted">
      Formule × {formData.nombreEnfants} enfant(s)
    </small>
    <small className="fw-semibold">
      {formData.formule
        ? (formData.formule.prix * formData.nombreEnfants)
            .toLocaleString()
        : 0} F CFA
    </small>
  </div>
  {formData.nombreAccompagnateurs > 1 && (
    <div className="d-flex justify-content-between mb-1">
      <small className="text-muted">
        {formData.nombreAccompagnateurs - 1} accompagnateur(s)
        supplémentaire(s) × 2 000 F
      </small>
      <small className="fw-semibold">
        {((formData.nombreAccompagnateurs - 1) * 2000)
          .toLocaleString()} F CFA
      </small>
    </div>
  )}
  <small className="text-success d-block mb-2">
    ✅ 1er accompagnateur gratuit |
    Boisson offerte pour tous
  </small>
  <hr className="my-2"/>
  <div className="d-flex justify-content-between align-items-center">
    <span className="fw-bold fs-6">Total à payer</span>
    <span className="fw-bold fs-5"
          style={{color: colors.primary}}>
      {calculerMontant()} {formData.formule?.prix > 0 ? 'F CFA' : ''}
    </span>
  </div>
</div>

                {/* Options de paiement */}
                {errors.modePaiement && (
                  <div className="alert alert-danger">
                    {errors.modePaiement}
                  </div>
                )}

                <div className="row g-3 mb-4">

                  {/* Paiement en ligne */}
                  <div className="col-md-6">
                    <div
                      className="card h-100 text-center p-4"
                      style={{
                        borderRadius: '15px',
                        cursor: 'pointer',
                        border: formData.modePaiement === 'en_ligne'
                          ? `3px solid ${colors.green}`
                          : '2px solid #eee',
                        backgroundColor:
                          formData.modePaiement === 'en_ligne'
                            ? `${colors.green}15`
                            : 'white'
                      }}
                      onClick={() => setFormData({
                        ...formData,
                        modePaiement: 'en_ligne'
                      })}>
                      <div className="fs-1 mb-2">💳</div>
                      <h6 className="fw-bold"
                        style={{ color: colors.green }}>
                        Paiement en ligne
                      </h6>
                      <small className="text-muted">
                        Carte bancaire, Orange Money, Wave
                      </small>
                    </div>
                  </div>

                  {/* Paiement sur place */}
                  <div className="col-md-6">
                    <div
                      className="card h-100 text-center p-4"
                      style={{
                        borderRadius: '15px',
                        cursor: 'pointer',
                        border: formData.modePaiement === 'sur_place'
                          ? `3px solid ${colors.blue}`
                          : '2px solid #eee',
                        backgroundColor:
                          formData.modePaiement === 'sur_place'
                            ? `${colors.blue}15`
                            : 'white'
                      }}
                      onClick={() => setFormData({
                        ...formData,
                        modePaiement: 'sur_place'
                      })}>
                      <div className="fs-1 mb-2">🏢</div>
                      <h6 className="fw-bold"
                        style={{ color: colors.blue }}>
                        Paiement sur place
                      </h6>
                      <small className="text-muted">
                        Espèces ou mobile money à l'accueil
                      </small>
                    </div>
                  </div>

                </div>

                <div className="d-flex gap-3">
                  <button
                    className="btn fw-bold py-3 flex-fill"
                    onClick={etapePrecedente}
                    style={{
                      backgroundColor: '#eee',
                      color: colors.dark,
                      borderRadius: '15px'
                    }}>
                    ← Retour
                  </button>
                  <button
                    className="btn fw-bold py-3 flex-fill"
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                      backgroundColor: colors.green,
                      color: 'white',
                      borderRadius: '15px',
                      fontSize: '1.1rem'
                    }}>
                    {loading ? (
                      <>
                        <span className="spinner-border
                          spinner-border-sm me-2"/>
                        Traitement...
                      </>
                    ) : (
                      '✅ Confirmer la réservation'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ÉTAPE 5 : CONFIRMATION PAIEMENT SUR PLACE */}
            {etape === 5 && (
              <div className="text-center py-5">
                <div style={{ fontSize: '5rem' }}>🎉</div>
                <h3 className="fw-bold mb-3"
                  style={{ color: colors.green }}>
                  Réservation confirmée !
                </h3>
                <div className="card border-0 shadow-sm p-4 mb-4 text-start"
                  style={{ borderRadius: '15px' }}>
                  <h6 className="fw-bold mb-3">
                    📋 Détails de votre réservation
                  </h6>
                  <p><strong>Formule :</strong>{' '}
                    {formData.formule?.emoji} {formData.formule?.nom}
                  </p>
                  <p><strong>Date :</strong> {formData.date}</p>
                  <p><strong>Créneau :</strong> {formData.creneau}</p>
                  <p><strong>Nombre d'enfants :</strong>{' '}
                    {formData.nombreEnfants}
                  </p>
                  <p><strong>Accompagnateurs :</strong>{' '}
                    {formData.nombreAccompagnateurs} personne(s)
                    (boisson offerte pour tous ✅)
                  </p>
                  <p><strong>Mode de paiement :</strong>{' '}
                    Paiement sur place à l'accueil
                  </p>
                  {formData.nombreAccompagnateurs > 1 && (
                    <p className="text-muted small">
                      ℹ️ 1er accompagnateur gratuit,{' '}
                      {formData.nombreAccompagnateurs - 1} supplémentaire(s)
                      à 2 000 F CFA
                    </p>
                  )}
                  <p className="mb-0 fw-bold"
                    style={{ color: colors.primary }}>
                    <strong>Montant à régler :</strong>{' '}
                    {calculerMontant()} F CFA
                  </p>
                </div>
                <p className="text-muted mb-4">
                  Présentez-vous à l'accueil le jour J avec
                  votre référence de réservation.
                </p>
                <Link to="/"
                  className="btn fw-bold px-5 py-3"
                  style={{
                    backgroundColor: colors.primary,
                    color: 'white',
                    borderRadius: '15px'
                  }}>
                  🏠 Retour à l'accueil
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="py-3 text-white text-center"
        style={{ backgroundColor: colors.dark }}>
        <p className="mb-0 small text-muted">
          © 2025 Wonderpark - Place du Souvenir Africain, Dakar
        </p>
      </footer>

    </div>
  );
};

export default Reservation;