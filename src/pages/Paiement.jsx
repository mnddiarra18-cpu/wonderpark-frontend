import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/logo.png';
import wavelogo from '../assets/paiement/wave.webp';
import orangeMoneyLogo from '../assets/paiement/orangemoney.webp';
import { paiementAPI } from '../services/api';
import { QRCodeSVG } from 'qrcode.react';

const Paiement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const colors = {
    primary: '#E8A020',
    secondary: '#E91E8C',
    green: '#4CAF50',
    blue: '#2196F3',
    purple: '#9C27B0',
    dark: '#3E2010',
    light: '#FFF9F0'
  };

  const donnees = location.state || {};
  const formule = `${donnees.emoji || '🎟️'} ${donnees.formule || 'Formule'}`;
  const date = donnees.date || '';
  const creneau = donnees.creneau || '';
  const nombreEnfants = donnees.nombreEnfants || 0;
  const nombreAccompagnateurs = donnees.nombreAccompagnateurs || 0;
  const accompagnateursPay = donnees.accompagnateursPay || 0;
  const montantFormule = donnees.montantFormule || 0;
  const montantAccompagnateurs = donnees.montantAccompagnateurs || 0;
  const montantTotal = donnees.montantTotal || 0;

  const methodesPaiement = [
    {
      id: 'orange_money',
      nom: 'Orange Money',
      logo: orangeMoneyLogo,
      couleur: '#FF6600'
    },
    {
      id: 'wave',
      nom: 'Wave',
      logo: wavelogo,
      couleur: '#1DC8FF'
    },
    {
      id: 'carte',
      nom: 'Carte Bancaire',
      logo: null,
      emoji: '💳',
      couleur: colors.blue
    }
  ];

  const [methodePaiement, setMethodePaiement] = useState('');
  const [montantPaye, setMontantPaye] = useState(montantTotal);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [waveModal, setWaveModal] = useState(false);
  const [formData, setFormData] = useState({
    numeroCarte: '',
    nomCarte: '',
    expiration: '',
    cvv: '',
    numeroMobile: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!methodePaiement) {
      newErrors.methode = 'Choisissez une méthode de paiement';
    }
    if (methodePaiement === 'carte') {
      if (!formData.numeroCarte) newErrors.numeroCarte = 'Numéro requis';
      if (!formData.nomCarte) newErrors.nomCarte = 'Nom requis';
      if (!formData.expiration) newErrors.expiration = 'Date requise';
      if (!formData.cvv) newErrors.cvv = 'CVV requis';
    }
    if (methodePaiement === 'orange_money') {
      if (!formData.numeroMobile) newErrors.numeroMobile = 'Numéro requis';
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
    if (!montantPaye || montantPaye <= 0) {
      setErrors({ methode: 'Entrez un montant valide' });
      return;
    }

    setLoading(true);

    try {
      if (methodePaiement === 'wave') {
        try {
          await paiementAPI.initierWave({
            reservation_id: donnees.reservationId,
            montant: Number(montantPaye)
          });
          setLoading(false);
          setWaveModal(true);
        } catch (error) {
          setLoading(false);
          setErrors({
            methode: error.response?.data?.error ||
              'Erreur lors de l\'initiation Wave'
          });
        }
        return;
      }

      await paiementAPI.creer({
        reservation_id: donnees.reservationId,
        methode_paiement: methodePaiement,
        mode_paiement: 'en_ligne',
        montant: Number(montantPaye),
        is_acompte: Number(montantPaye) < montantTotal,
        numero_mobile: formData.numeroMobile || ''
      });

      setLoading(false);
      setSuccess(true);

    } catch (error) {
      setLoading(false);
      setErrors({
        methode: error.response?.data?.error ||
          'Erreur lors du paiement'
      });
    }
  };

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const waveUrl = isMobile
    ? `wave://send?to=783015252&amount=${Number(montantPaye)}`
    : `https://www.wave.com/`;
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
            💳 Paiement sécurisé
          </span>
        </div>
      </nav>

      <div className="container py-4 flex-grow-1">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">

            {success ? (
              <div className="text-center py-5">
                <div style={{ fontSize: '5rem' }}>✅</div>
                <h3 className="fw-bold mt-3 mb-2"
                  style={{ color: colors.green }}>
                  Paiement effectué !
                </h3>
                <p className="text-muted mb-4">
                  Votre paiement a bien été enregistré.
                </p>
                <div className="card border-0 shadow-sm p-4 mb-4 text-start"
                  style={{ borderRadius: '15px' }}>
                  <h6 className="fw-bold mb-3">🎫 Reçu de paiement</h6>
                  <p>
                    <strong>N° Réservation :</strong>{' '}
                    <span style={{ color: colors.primary }}>
                      #{donnees.reservationId}
                    </span>
                  </p>
                  <p><strong>Formule :</strong> {formule}</p>
                  <p><strong>Date :</strong> {date}</p>
                  <p><strong>Créneau :</strong> {creneau}</p>
                  <p><strong>Enfants :</strong> {nombreEnfants}</p>
                  <p>
                    <strong>Accompagnateurs :</strong>{' '}
                    {nombreAccompagnateurs}
                    {' '}(boisson offerte pour tous ✅)
                  </p>
                  <hr />
                  <p>
                    <strong>Montant total :</strong>{' '}
                    {montantTotal.toLocaleString()} F CFA
                  </p>
                  <p>
                    <strong>Montant payé :</strong>{' '}
                    <span style={{ color: colors.green }}>
                      {Number(montantPaye).toLocaleString()} F CFA
                    </span>
                  </p>
                  {Number(montantPaye) < montantTotal && (
                    <div className="p-3 mt-2"
                      style={{
                        backgroundColor: `${colors.primary}15`,
                        border: `1px solid ${colors.primary}30`,
                        borderRadius: '10px'
                      }}>
                      <p className="mb-0 fw-bold"
                        style={{ color: colors.primary }}>
                        ⚠️ Reste à payer sur place :{' '}
                        {(montantTotal - Number(montantPaye))
                          .toLocaleString()} F CFA
                      </p>
                      <small className="text-muted">
                        À régler à l'accueil le jour de votre visite
                      </small>
                    </div>
                  )}
                  {Number(montantPaye) >= montantTotal && (
                    <p className="fw-bold mb-0"
                      style={{ color: colors.green }}>
                      ✅ Paiement intégral effectué
                    </p>
                  )}
                </div>
                <div className="d-flex gap-3 justify-content-center">
                  <Link to="/"
                    className="btn fw-bold px-4 py-2"
                    style={{
                      backgroundColor: colors.primary,
                      color: 'white',
                      borderRadius: '15px'
                    }}>
                    🏠 Accueil
                  </Link>
                  <button
                    className="btn fw-bold px-4 py-2"
                    style={{
                      backgroundColor: colors.green,
                      color: 'white',
                      borderRadius: '15px'
                    }}
                    onClick={() => window.print()}>
                    🖨️ Imprimer le reçu
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="fw-bold mb-4 text-center"
                  style={{ color: colors.dark }}>
                  💳 Finaliser le paiement
                </h4>

                {/* RÉCAPITULATIF */}
                <div className="card border-0 shadow-sm p-3 mb-4"
                  style={{
                    borderRadius: '15px',
                    borderLeft: `5px solid ${colors.primary}`
                  }}>
                  <h6 className="fw-bold mb-3"
                    style={{ color: colors.dark }}>
                    📋 Récapitulatif
                  </h6>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <small className="text-muted">Formule</small>
                      <p className="fw-bold mb-0">{formule}</p>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Date</small>
                      <p className="fw-bold mb-0">{date}</p>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Créneau</small>
                      <p className="fw-bold mb-0">{creneau}</p>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Enfants</small>
                      <p className="fw-bold mb-0">
                        {nombreEnfants} enfant(s)
                      </p>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">
                        Accompagnateurs
                      </small>
                      <p className="fw-bold mb-0">
                        {nombreAccompagnateurs} personne(s)
                      </p>
                    </div>
                  </div>
                  <hr className="my-2" />
                  <div className="mb-1 d-flex justify-content-between">
                    <small className="text-muted">
                      Formule x {nombreEnfants} enfant(s)
                    </small>
                    <small className="fw-semibold">
                      {montantFormule.toLocaleString()} F CFA
                    </small>
                  </div>
                  {accompagnateursPay > 0 && (
                    <div className="mb-1 d-flex justify-content-between">
                      <small className="text-muted">
                        {accompagnateursPay} accompagnateur(s)
                        suppl. x 2 000 F
                      </small>
                      <small className="fw-semibold">
                        {montantAccompagnateurs.toLocaleString()} F CFA
                      </small>
                    </div>
                  )}
                  {nombreAccompagnateurs > 0 && (
                    <div className="mb-2">
                      <small className="text-success">
                        ✅ Boisson offerte pour tous les accompagnateurs
                      </small>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between
                                  align-items-center">
                    <span className="fw-bold fs-6">Total à payer</span>
                    <span className="fw-bold fs-5"
                      style={{ color: colors.primary }}>
                      {montantTotal.toLocaleString()} F CFA
                    </span>
                  </div>
                </div>

                {/* MONTANT À PAYER */}
                <div className="card border-0 shadow-sm p-3 mb-4"
                  style={{ borderRadius: '15px' }}>
                  <h6 className="fw-bold mb-3"
                    style={{ color: colors.dark }}>
                    💰 Montant à payer
                  </h6>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Saisissez le montant (F CFA)
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      placeholder={`Montant total : ${montantTotal.toLocaleString()} F CFA`}
                      max={montantTotal}
                      min={1}
                      value={montantPaye}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setMontantPaye(val > montantTotal ? montantTotal : val);
                      }}
                      style={{ borderRadius: '10px' }}
                    />
                    <small className="text-muted mt-1 d-block">
                      Vous pouvez payer en totalité ou un montant partiel
                    </small>
                  </div>
                  {montantPaye > 0 && (
                    <div className="p-3 rounded"
                      style={{
                        backgroundColor: montantPaye >= montantTotal
                          ? `${colors.green}15`
                          : `${colors.primary}15`,
                        borderRadius: '10px',
                        border: `1px solid ${montantPaye >= montantTotal
                            ? colors.green
                            : colors.primary
                          }30`
                      }}>
                      <div className="d-flex justify-content-between mb-1">
                        <small className="fw-semibold">Montant total</small>
                        <small className="fw-bold">
                          {montantTotal.toLocaleString()} F CFA
                        </small>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <small className="fw-semibold">Vous payez</small>
                        <small className="fw-bold"
                          style={{ color: colors.green }}>
                          {Number(montantPaye).toLocaleString()} F CFA
                        </small>
                      </div>
                      {Number(montantPaye) < montantTotal && (
                        <div className="d-flex justify-content-between">
                          <small className="fw-semibold">
                            Reste à payer sur place
                          </small>
                          <small className="fw-bold"
                            style={{ color: colors.secondary }}>
                            {(montantTotal - Number(montantPaye))
                              .toLocaleString()} F CFA
                          </small>
                        </div>
                      )}
                      {Number(montantPaye) >= montantTotal && (
                        <div className="text-center mt-1">
                          <small className="fw-bold"
                            style={{ color: colors.green }}>
                            ✅ Paiement intégral
                          </small>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit}>
                  <h6 className="fw-bold mb-3"
                    style={{ color: colors.dark }}>
                    Choisissez votre méthode de paiement
                  </h6>

                  {errors.methode && (
                    <div className="alert alert-danger py-2">
                      {errors.methode}
                    </div>
                  )}

                  {/* MÉTHODES DE PAIEMENT */}
                  <div className="row g-3 mb-4">
                    {methodesPaiement.map((methode) => (
                      <div className="col-4" key={methode.id}>
                        <div
                          className="card text-center p-3 h-100"
                          style={{
                            borderRadius: '15px',
                            cursor: 'pointer',
                            border: methodePaiement === methode.id
                              ? `3px solid ${methode.couleur}`
                              : '2px solid #eee',
                            backgroundColor:
                              methodePaiement === methode.id
                                ? `${methode.couleur}15`
                                : 'white',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => {
                            setMethodePaiement(methode.id);
                            setErrors({ ...errors, methode: '' });
                          }}>
                          {methode.logo ? (
                            <img
                              src={methode.logo}
                              alt={methode.nom}
                              style={{
                                height: '50px',
                                width: '100%',
                                objectFit: 'contain',
                                marginBottom: '8px'
                              }}
                            />
                          ) : (
                            <div className="fs-2 mb-2">
                              {methode.emoji}
                            </div>
                          )}
                          <small className="fw-bold d-block"
                            style={{ color: methode.couleur }}>
                            {methode.nom}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* FORMULAIRE ORANGE MONEY */}
                  {methodePaiement === 'orange_money' && (
                    <div className="card border-0 shadow-sm p-4 mb-4"
                      style={{ borderRadius: '15px' }}>
                      <h6 className="fw-bold mb-3">
                        📱 Numéro de téléphone
                      </h6>
                      <div className="input-group">
                        <span className="input-group-text"
                          style={{ borderRadius: '10px 0 0 10px' }}>
                          +221
                        </span>
                        <input
                          type="tel"
                          name="numeroMobile"
                          className={`form-control ${errors.numeroMobile ? 'is-invalid' : ''}`}
                          placeholder="77 000 00 00"
                          value={formData.numeroMobile}
                          onChange={handleChange}
                          style={{ borderRadius: '0 10px 10px 0' }}
                        />
                        {errors.numeroMobile && (
                          <div className="invalid-feedback">
                            {errors.numeroMobile}
                          </div>
                        )}
                      </div>
                      <small className="text-muted mt-2 d-block">
                        ℹ️ Vous recevrez une notification pour
                        confirmer le paiement
                      </small>
                    </div>
                  )}

                  {/* FORMULAIRE CARTE BANCAIRE */}
                  {methodePaiement === 'carte' && (
                    <div className="card border-0 shadow-sm p-4 mb-4"
                      style={{ borderRadius: '15px' }}>
                      <h6 className="fw-bold mb-3">
                        💳 Informations de la carte
                      </h6>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Numéro de carte
                        </label>
                        <input
                          type="text"
                          name="numeroCarte"
                          className={`form-control ${errors.numeroCarte ? 'is-invalid' : ''}`}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          value={formData.numeroCarte}
                          onChange={handleChange}
                          style={{ borderRadius: '10px' }}
                        />
                        {errors.numeroCarte && (
                          <div className="invalid-feedback">
                            {errors.numeroCarte}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Nom sur la carte
                        </label>
                        <input
                          type="text"
                          name="nomCarte"
                          className={`form-control ${errors.nomCarte ? 'is-invalid' : ''}`}
                          placeholder="PRENOM NOM"
                          value={formData.nomCarte}
                          onChange={handleChange}
                          style={{ borderRadius: '10px' }}
                        />
                        {errors.nomCarte && (
                          <div className="invalid-feedback">
                            {errors.nomCarte}
                          </div>
                        )}
                      </div>
                      <div className="row g-3">
                        <div className="col-7">
                          <label className="form-label fw-semibold">
                            Date d'expiration
                          </label>
                          <input
                            type="text"
                            name="expiration"
                            className={`form-control ${errors.expiration ? 'is-invalid' : ''}`}
                            placeholder="MM/AA"
                            maxLength="5"
                            value={formData.expiration}
                            onChange={handleChange}
                            style={{ borderRadius: '10px' }}
                          />
                          {errors.expiration && (
                            <div className="invalid-feedback">
                              {errors.expiration}
                            </div>
                          )}
                        </div>
                        <div className="col-5">
                          <label className="form-label fw-semibold">
                            CVV
                          </label>
                          <input
                            type="password"
                            name="cvv"
                            className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                            placeholder="***"
                            maxLength="3"
                            value={formData.cvv}
                            onChange={handleChange}
                            style={{ borderRadius: '10px' }}
                          />
                          {errors.cvv && (
                            <div className="invalid-feedback">
                              {errors.cvv}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BOUTON PAYER */}
                  <button
                    type="submit"
                    className="btn w-100 fw-bold py-3"
                    disabled={loading || !methodePaiement || !montantPaye}
                    style={{
                      background: methodePaiement && montantPaye
                        ? `linear-gradient(135deg,
                            ${colors.green},
                            ${colors.blue})`
                        : '#ccc',
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
                      `🔐 Payer ${Number(montantPaye || 0)
                        .toLocaleString()} F CFA`
                    )}
                  </button>

                  <div className="text-center mt-3">
                    <small className="text-muted">
                      🔒 Paiement 100% sécurisé |
                      Vos données sont protégées
                    </small>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL WAVE */}
{waveModal && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  }}>
    <div className="card border-0 shadow-lg p-4 text-center"
         style={{
           borderRadius: '20px',
           maxWidth: '400px',
           width: '100%',
           backgroundColor: 'white'
         }}>

      {/* LOGO WAVE */}
      <div className="d-flex justify-content-center mb-3">
        <img
          src={wavelogo}
          alt="Wave"
          style={{
            height: '60px',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* DESCRIPTION */}
      <p className="text-muted small mb-1">
        Le paiement est en cours de traitement.
        Vous allez recevoir un SMS pour confirmation.
      </p>
      <p className="mb-3 small">
        ou{' '}
        <a href={waveUrl}
          className="fw-bold"
          style={{
            color: '#1DC8FF',
            textDecoration: 'underline'
          }}>
          Cliquer sur ce lien
        </a>
        {' '}ou scanner le QR Code pour valider le paiement
      </p>

      {/* QR CODE */}
      <div className="d-flex justify-content-center mb-3">
        <div style={{
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <QRCodeSVG
            value={waveUrl}
            size={200}
            fgColor="#1DC8FF"
            bgColor="white"
            level="H"
            includeMargin={true}
          />
        </div>
      </div>

      {/* NUMÉRO WAVE */}
      <div className="p-2 mb-3 rounded"
           style={{
             backgroundColor: '#1DC8FF10',
             border: '1px solid #1DC8FF30'
           }}>
        <small className="text-muted d-block">
          Numéro Wave Wonderpark
        </small>
        <span className="fw-bold fs-6"
              style={{color: '#1DC8FF'}}>
          78 301 52 52
        </span>
      </div>

      {/* MONTANT */}
      <div className="p-2 mb-4 rounded"
           style={{
             backgroundColor: '#1DC8FF15',
             border: '1px solid #1DC8FF30'
           }}>
        <small className="text-muted d-block">
          Montant à payer
        </small>
        <span className="fw-bold fs-5"
              style={{color: '#1DC8FF'}}>
          {Number(montantPaye).toLocaleString()} F CFA
        </span>
      </div>

      {/* BOUTON J'AI PAYÉ */}
      <div className="d-flex gap-2 mb-2">
        <button
          className="btn fw-bold flex-fill py-2"
          style={{
            backgroundColor: colors.green,
            color: 'white',
            borderRadius: '10px',
            border: 'none'
          }}
          onClick={() => {
            setWaveModal(false);
            setSuccess(true);
          }}>
          ✅ J'ai payé
        </button>
      </div>

      <button
        className="btn btn-link text-muted small"
        onClick={() => setWaveModal(false)}>
        Annuler
      </button>

    </div>
  </div>
)}

      {/* FOOTER */}
      <footer className="py-3 text-white text-center"
        style={{ backgroundColor: colors.dark }}>
        <p className="mb-0 small text-muted">
          © 2025 Wonderpark - Paiement sécurisé
        </p>
      </footer>

    </div>
  );
};

export default Paiement;