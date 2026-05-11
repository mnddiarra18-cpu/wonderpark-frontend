import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/logo.png';
import { reservationAPI } from '../services/api';

const MesReservations = () => {
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

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const chargerReservations = async () => {
    try {
      const response = await reservationAPI.mesReservations();
      setReservations(response.data);
    } catch (error) {
      setError('Erreur lors du chargement des réservations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerReservations();
  }, []);

  const handleAnnuler = async (id) => {
    if (window.confirm(
      'Voulez-vous vraiment annuler cette réservation ?'
    )) {
      try {
        await reservationAPI.annuler(id);
        alert('✅ Réservation annulée avec succès !');
        chargerReservations();
      } catch (error) {
        alert('❌ ' + (
          error.response?.data?.error ||
          'Erreur lors de l\'annulation'
        ));
      }
    }
  };

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'confirmee':
        return (
          <span className="badge px-3 py-2"
                style={{
                  backgroundColor: `${colors.green}20`,
                  color: colors.green,
                  borderRadius: '20px',
                  border: `1px solid ${colors.green}`
                }}>
            ✅ Confirmée
          </span>
        );
      case 'en_attente':
        return (
          <span className="badge px-3 py-2"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary,
                  borderRadius: '20px',
                  border: `1px solid ${colors.primary}`
                }}>
            ⏳ En attente
          </span>
        );
      case 'annulee':
        return (
          <span className="badge px-3 py-2"
                style={{
                  backgroundColor: `${colors.secondary}20`,
                  color: colors.secondary,
                  borderRadius: '20px',
                  border: `1px solid ${colors.secondary}`
                }}>
            ❌ Annulée
          </span>
        );
      default:
        return null;
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
          <div className="d-flex align-items-center gap-3">
            <span className="text-white small fw-semibold">
              👤 {user.first_name} {user.last_name}
            </span>
            <Link to="/reservation"
                  className="btn btn-sm fw-bold"
                  style={{
                    backgroundColor: colors.primary,
                    color: 'white',
                    borderRadius: '10px'
                  }}>
              + Nouvelle réservation
            </Link>
          </div>
        </div>
      </nav>

      <div className="container py-4 flex-grow-1">

        <h4 className="fw-bold mb-4" style={{color: colors.dark}}>
          📅 Mes Réservations
        </h4>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border"
                 style={{color: colors.primary}}/>
            <p className="mt-3 text-muted">
              Chargement de vos réservations...
            </p>
          </div>
        )}

        {/* ERREUR */}
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {/* AUCUNE RÉSERVATION */}
        {!loading && reservations.length === 0 && (
          <div className="text-center py-5">
            <div style={{fontSize: '4rem'}}>🎟️</div>
            <h5 className="fw-bold mt-3 mb-2"
                style={{color: colors.dark}}>
              Aucune réservation
            </h5>
            <p className="text-muted mb-4">
              Vous n'avez pas encore effectué de réservation.
            </p>
            <Link to="/reservation"
                  className="btn fw-bold px-4 py-2"
                  style={{
                    backgroundColor: colors.primary,
                    color: 'white',
                    borderRadius: '15px'
                  }}>
              🎯 Faire une réservation
            </Link>
          </div>
        )}

        {/* LISTE DES RÉSERVATIONS */}
        {!loading && reservations.length > 0 && (
          <div className="row g-4">
            {reservations.map((res) => (
              <div className="col-12" key={res.id}>
                <div className="card border-0 shadow-sm"
                     style={{
                       borderRadius: '15px',
                       borderLeft: `5px solid ${
                         res.statut === 'confirmee'
                           ? colors.green
                           : res.statut === 'en_attente'
                           ? colors.primary
                           : colors.secondary
                       }`
                     }}>
                  <div className="card-body p-4">
                    <div className="row align-items-center">

                      {/* INFO PRINCIPALE */}
                      <div className="col-md-4">
                        <h6 className="fw-bold mb-1"
                            style={{color: colors.dark}}>
                          {res.formule_nom}
                        </h6>
                        <p className="text-muted small mb-0">
                          📅 {res.date_reservation
                            ? new Date(res.date_reservation)
                                .toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric'
                                })
                            : ''}
                        </p>
                        <p className="text-muted small mb-0">
                          🎟️ Réservation #{res.id}
                        </p>
                      </div>

                      {/* DÉTAILS */}
                      <div className="col-md-4">
                        <div className="d-flex gap-3">
                          <div>
                            <small className="text-muted d-block">
                              Enfants
                            </small>
                            <span className="fw-bold">
                              {res.nombre_enfants}
                            </span>
                          </div>
                          <div>
                            <small className="text-muted d-block">
                              Accompagnateurs
                            </small>
                            <span className="fw-bold">
                              {res.nombre_accompagnateurs}
                            </span>
                          </div>
                          <div>
                            <small className="text-muted d-block">
                              Montant
                            </small>
                            <span className="fw-bold"
                                  style={{color: colors.primary}}>
                              {parseFloat(res.montant_total || 0)
                                .toLocaleString()} F
                            </span>
                          </div>
                        </div>
                        {res.notes && (
                          <p className="text-muted small mt-2 mb-0">
                            📝 {res.notes}
                          </p>
                        )}
                      </div>

                      {/* STATUT ET ACTIONS */}
                      <div className="col-md-4 text-md-end mt-3 mt-md-0">
                        <div className="mb-3">
                          {getStatutBadge(res.statut)}
                        </div>
                        <div className="d-flex gap-2
                                        justify-content-md-end">
                          {res.statut === 'en_attente' && (
                            <>
                              <Link
                                to="/paiement"
                                state={{
                                  reservationId: res.id,
                                  formule: res.formule_nom,
                                  emoji: '🎟️',
                                  date: res.date_reservation
                                    ? new Date(res.date_reservation)
                                        .toLocaleDateString('fr-FR')
                                    : '',
                                  creneau: '',
                                  nombreEnfants: res.nombre_enfants,
                                  nombreAccompagnateurs:
                                    res.nombre_accompagnateurs,
                                  accompagnateursPay: Math.max(
                                    0, res.nombre_accompagnateurs - 1
                                  ),
                                  montantFormule: parseFloat(
                                    res.montant_total || 0
                                  ),
                                  montantAccompagnateurs: 0,
                                  montantTotal: parseFloat(
                                    res.montant_total || 0
                                  )
                                }}
                                className="btn btn-sm fw-bold"
                                style={{
                                  backgroundColor: colors.green,
                                  color: 'white',
                                  borderRadius: '10px'
                                }}>
                                💳 Payer
                              </Link>
                              <button
                                className="btn btn-sm fw-bold"
                                style={{
                                  backgroundColor: `${colors.secondary}15`,
                                  color: colors.secondary,
                                  border: `1px solid ${colors.secondary}`,
                                  borderRadius: '10px'
                                }}
                                onClick={() => handleAnnuler(res.id)}>
                                ❌ Annuler
                              </button>
                            </>
                          )}
                          {res.statut === 'confirmee' && (
                            <button
                              className="btn btn-sm fw-bold"
                              style={{
                                backgroundColor: `${colors.blue}15`,
                                color: colors.blue,
                                border: `1px solid ${colors.blue}`,
                                borderRadius: '10px'
                              }}
                              onClick={() => window.print()}>
                              🖨️ Imprimer
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer className="py-3 text-center"
              style={{backgroundColor: colors.dark}}>
        <p className="mb-0 small text-muted">
          © 2025 Wonderpark - Place du Souvenir Africain, Dakar
        </p>
      </footer>

    </div>
  );
};

export default MesReservations;