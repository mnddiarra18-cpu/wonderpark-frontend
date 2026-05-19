import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../assets/logo.png';
import { gestionnaireAPI, reservationAPI } from '../../services/api';

const Gestionnaire = () => {
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

  const [activeMenu, setActiveMenu] = useState('accueil');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [activites, setActivites] = useState([]);
  const [formules, setFormules] = useState([]);
  const [evenements, setEvenements] = useState([]);

  useEffect(() => {
    const chargerReservations = async () => {
      try {
        const response = await gestionnaireAPI.toutesReservations();
        setReservations(response.data);
      } catch (error) {
        console.error('Erreur:', error.response?.data);
      }
    };
    chargerReservations();
  }, []);

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'confirmee':
        return <span className="badge bg-success">Confirmée</span>;
      case 'en_attente':
        return <span className="badge bg-warning text-dark">En attente</span>;
      case 'annulee':
        return <span className="badge bg-danger">Annulée</span>;
      default:
        return null;
    }
  };
  const handleModifierStatut = async (id, statut) => {
    try {
      await reservationAPI.modifierStatut(id, statut);
      alert('✅ Statut modifié avec succès !');
      const response = await gestionnaireAPI.toutesReservations();
      setReservations(response.data);
    } catch (error) {
      alert('❌ Erreur lors de la modification');
    }
  };

  const handleAnnuler = async (id) => {
    if (window.confirm('Voulez-vous vraiment annuler cette réservation ?')) {
      try {
        await reservationAPI.modifierStatut(id, 'annulee');
        alert('✅ Réservation annulée !');
        const response = await gestionnaireAPI.toutesReservations();
        setReservations(response.data);
      } catch (error) {
        alert('❌ Erreur lors de l\'annulation');
      }
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const menuItems = [
    { id: 'accueil', label: 'Tableau de bord', icon: '🏠' },
    { id: 'reservations', label: 'Réservations', icon: '📅' },
    { id: 'activites', label: 'Activités', icon: '🎠' },
    { id: 'formules', label: 'Formules & Tarifs', icon: '💰' },
    { id: 'creneaux', label: 'Créneaux', icon: '🕐' },
    { id: 'evenements', label: 'Événements', icon: '🎉' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5F5F5',
      display: 'flex',
      flexDirection: 'column'
    }}>

      <nav className="navbar navbar-dark shadow-sm"
        style={{ backgroundColor: colors.dark, zIndex: 1000 }}>
        <div className="container-fluid px-3">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-light btn-sm me-3"
              onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <img src={logo} alt="Wonderpark" height="40" className="me-2" />
            <span className="fw-bold text-white">Gestionnaire</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white small">👤 Gestionnaire</span>
            <button
              className="btn btn-sm fw-bold"
              style={{
                backgroundColor: colors.secondary,
                color: 'white',
                borderRadius: '10px'
              }}
              onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div className="d-flex flex-grow-1">

        {sidebarOpen && (
          <div style={{
            width: '250px',
            backgroundColor: colors.dark,
            minHeight: '100vh',
            paddingTop: '20px',
            flexShrink: 0
          }}>
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="px-3 py-2 mb-1 mx-2 rounded"
                style={{
                  cursor: 'pointer',
                  backgroundColor: activeMenu === item.id
                    ? `${colors.primary}30` : 'transparent',
                  borderLeft: activeMenu === item.id
                    ? `4px solid ${colors.primary}` : '4px solid transparent',
                  color: activeMenu === item.id ? colors.primary : '#ccc',
                  transition: 'all 0.2s'
                }}
                onClick={() => setActiveMenu(item.id)}>
                <span className="me-2">{item.icon}</span>
                <span className="fw-semibold">{item.label}</span>
              </div>
            ))}
            <hr style={{ borderColor: '#444', margin: '20px 10px' }} />
            <Link to="/"
              className="px-3 py-2 mb-1 mx-2 rounded d-block text-decoration-none"
              style={{ color: '#ccc' }}>
              <span className="me-2">🌐</span>
              <span className="fw-semibold">Voir le site</span>
            </Link>
          </div>
        )}

        <div className="flex-grow-1 p-4">

          {activeMenu === 'accueil' && (
            <div>
              <h4 className="fw-bold mb-4" style={{ color: colors.dark }}>
                🏠 Tableau de bord
              </h4>
              <div className="row g-3 mb-4">
                {[
                  {
                    titre: 'Total Réservations',
                    valeur: reservations.length,
                    icon: '📅',
                    couleur: colors.blue
                  },
                  {
                    titre: 'En attente',
                    valeur: reservations.filter(
                      r => r.statut === 'en_attente'
                    ).length,
                    icon: '⏳',
                    couleur: colors.primary
                  },
                  {
                    titre: 'Confirmées',
                    valeur: reservations.filter(
                      r => r.statut === 'confirmee'
                    ).length,
                    icon: '✅',
                    couleur: colors.green
                  },
                  {
                    titre: 'Annulées',
                    valeur: reservations.filter(
                      r => r.statut === 'annulee'
                    ).length,
                    icon: '❌',
                    couleur: colors.secondary
                  }
                ].map((stat, i) => (
                  <div className="col-md-3" key={i}>
                    <div className="card border-0 shadow-sm"
                      style={{ borderRadius: '15px' }}>
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between
                                        align-items-start">
                          <div>
                            <small className="text-muted">{stat.titre}</small>
                            <h4 className="fw-bold mb-0"
                              style={{ color: stat.couleur }}>
                              {stat.valeur}
                            </h4>
                          </div>
                          <div className="fs-2">{stat.icon}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card border-0 shadow-sm"
                style={{ borderRadius: '15px' }}>
                <div className="card-header bg-white py-3"
                  style={{ borderRadius: '15px 15px 0 0' }}>
                  <h6 className="fw-bold mb-0" style={{ color: colors.dark }}>
                    📅 Dernières réservations
                  </h6>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead style={{ backgroundColor: '#F8F9FA' }}>
                        <tr>
                          <th>#</th>
                          <th>Client</th>
                          <th>Formule</th>
                          <th>Date</th>
                          <th>Enfants</th>
                          <th>Accomp.</th>
                          <th>Montant</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.length === 0 ? (
                          <tr>
                            <td colSpan="9"
                              className="text-center text-muted py-3">
                              Aucune réservation
                            </td>
                          </tr>
                        ) : (
                          reservations.slice(0, 5).map((res) => (
                            <tr key={res.id}>
                              <td>#{res.id}</td>
                              <td className="fw-semibold">
                                {res.client_nom}
                              </td>
                              <td>{res.formule_nom}</td>
                              <td>{res.date_reservation
                                ? new Date(res.date_reservation)
                                  .toLocaleDateString('fr-FR')
                                : ''}
                              </td>
                              <td>{res.nombre_enfants}</td>
                              <td>{res.nombre_accompagnateurs}</td>
                              <td className="fw-bold"
                                style={{ color: colors.primary }}>
                                {parseFloat(res.montant_total || 0)
                                  .toLocaleString()} F
                              </td>
                              <td>{getStatutBadge(res.statut)}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-success me-1"
                                  style={{ borderRadius: '8px' }}
                                  onClick={() => handleModifierStatut(res.id, 'confirmee')}>
                                  ✅
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  style={{ borderRadius: '8px' }}
                                  onClick={() => handleAnnuler(res.id)}>
                                  ❌
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'reservations' && (
            <div>
              <h4 className="fw-bold mb-4" style={{ color: colors.dark }}>
                📅 Gestion des Réservations
              </h4>
              <div className="card border-0 shadow-sm p-3 mb-4"
                style={{ borderRadius: '15px' }}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <input type="text" className="form-control"
                      placeholder="🔍 Rechercher..."
                      style={{ borderRadius: '10px' }} />
                  </div>
                  <div className="col-md-3">
                    <select className="form-select"
                      style={{ borderRadius: '10px' }}>
                      <option>Tous les statuts</option>
                      <option>Confirmée</option>
                      <option>En attente</option>
                      <option>Annulée</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <input type="date" className="form-control"
                      style={{ borderRadius: '10px' }} />
                  </div>
                </div>
              </div>
              <div className="card border-0 shadow-sm"
                style={{ borderRadius: '15px' }}>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead style={{ backgroundColor: '#F8F9FA' }}>
                        <tr>
                          <th>#</th>
                          <th>Client</th>
                          <th>Formule</th>
                          <th>Date</th>
                          <th>Enfants</th>
                          <th>Accomp.</th>
                          <th>Montant</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.length === 0 ? (
                          <tr>
                            <td colSpan="9"
                              className="text-center text-muted py-3">
                              Aucune réservation
                            </td>
                          </tr>
                        ) : (
                          reservations.map((res) => (
                            <tr key={res.id}>
                              <td>#{res.id}</td>
                              <td className="fw-semibold">
                                {res.client_nom}
                              </td>
                              <td>{res.formule_nom}</td>
                              <td>{res.date_reservation
                                ? new Date(res.date_reservation)
                                  .toLocaleDateString('fr-FR')
                                : ''}
                              </td>
                              <td>{res.nombre_enfants}</td>
                              <td>{res.nombre_accompagnateurs}</td>
                              <td className="fw-bold"
                                style={{ color: colors.primary }}>
                                {parseFloat(res.montant_total || 0)
                                  .toLocaleString()} F
                              </td>
                              <td>{getStatutBadge(res.statut)}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-success me-1"
                                  style={{ borderRadius: '8px' }}>
                                  ✅
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-warning me-1"
                                  style={{ borderRadius: '8px' }}>
                                  ✏️
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  style={{ borderRadius: '8px' }}>
                                  ❌
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'activites' && (
            <div>
              <div className="d-flex justify-content-between
                              align-items-center mb-4">
                <h4 className="fw-bold mb-0" style={{ color: colors.dark }}>
                  🎠 Gestion des Activités
                </h4>
                <button className="btn fw-bold"
                  style={{
                    backgroundColor: colors.primary,
                    color: 'white',
                    borderRadius: '10px'
                  }}>
                  + Ajouter une activité
                </button>
              </div>
              {activites.length === 0 ? (
                <div className="text-center text-muted py-5">
                  Aucune activité disponible
                </div>
              ) : (
                <div className="row g-3">
                  {activites.map((activite) => (
                    <div className="col-md-6" key={activite.id}>
                      <div className="card border-0 shadow-sm p-4"
                        style={{ borderRadius: '15px' }}>
                        <h5 className="fw-bold">{activite.nom}</h5>
                        <div className="d-flex gap-2 mt-3">
                          <button className="btn btn-sm fw-bold flex-fill"
                            style={{
                              backgroundColor: colors.blue,
                              color: 'white',
                              borderRadius: '10px'
                            }}>
                            ✏️ Modifier
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeMenu === 'formules' && (
            <div>
              <div className="d-flex justify-content-between
                              align-items-center mb-4">
                <h4 className="fw-bold mb-0" style={{ color: colors.dark }}>
                  💰 Formules & Tarifs
                </h4>
                <button className="btn fw-bold"
                  style={{
                    backgroundColor: colors.primary,
                    color: 'white',
                    borderRadius: '10px'
                  }}>
                  + Ajouter une formule
                </button>
              </div>
              <div className="card border-0 shadow-sm"
                style={{ borderRadius: '15px' }}>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead style={{ backgroundColor: '#F8F9FA' }}>
                        <tr>
                          <th>#</th>
                          <th>Nom</th>
                          <th>Prix</th>
                          <th>Durée</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formules.length === 0 ? (
                          <tr>
                            <td colSpan="6"
                              className="text-center text-muted py-3">
                              Aucune formule
                            </td>
                          </tr>
                        ) : (
                          formules.map((formule) => (
                            <tr key={formule.id}>
                              <td>#{formule.id}</td>
                              <td className="fw-semibold">{formule.nom}</td>
                              <td className="fw-bold"
                                style={{ color: colors.primary }}>
                                {parseFloat(formule.prix) === 0
                                  ? 'Sur devis'
                                  : `${parseFloat(formule.prix)
                                    .toLocaleString()} F`}
                              </td>
                              <td>{formule.duree}</td>
                              <td>
                                <span className="badge bg-success">Actif</span>
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-primary me-1"
                                  style={{ borderRadius: '8px' }}>
                                  ✏️
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  style={{ borderRadius: '8px' }}>
                                  🗑️
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'creneaux' && (
            <div>
              <div className="d-flex justify-content-between
                              align-items-center mb-4">
                <h4 className="fw-bold mb-0" style={{ color: colors.dark }}>
                  🕐 Gestion des Créneaux
                </h4>
                <button className="btn fw-bold"
                  style={{
                    backgroundColor: colors.primary,
                    color: 'white',
                    borderRadius: '10px'
                  }}>
                  + Ajouter un créneau
                </button>
              </div>
              {creneaux.length === 0 ? (
                <div className="text-center text-muted py-5">
                  Aucun créneau disponible
                </div>
              ) : (
                <div className="row g-3">
                  {creneaux.map((creneau) => (
                    <div className="col-md-4" key={creneau.id}>
                      <div className="card border-0 shadow-sm p-4"
                        style={{ borderRadius: '15px' }}>
                        <h6 className="fw-bold mb-3">
                          🕐 {creneau.heure_debut} - {creneau.heure_fin}
                        </h6>
                        <div className="d-flex gap-2 mt-3">
                          <button className="btn btn-sm fw-bold flex-fill"
                            style={{
                              backgroundColor: colors.blue,
                              color: 'white',
                              borderRadius: '10px'
                            }}>
                            ✏️ Modifier
                          </button>
                          <button className="btn btn-sm fw-bold flex-fill"
                            style={{
                              backgroundColor: colors.secondary,
                              color: 'white',
                              borderRadius: '10px'
                            }}>
                            🗑️ Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeMenu === 'evenements' && (
            <div>
              <div className="d-flex justify-content-between
                              align-items-center mb-4">
                <h4 className="fw-bold mb-0" style={{ color: colors.dark }}>
                  🎉 Gestion des Événements
                </h4>
                <button className="btn fw-bold"
                  style={{
                    backgroundColor: colors.primary,
                    color: 'white',
                    borderRadius: '10px'
                  }}>
                  + Ajouter un événement
                </button>
              </div>
              {evenements.length === 0 ? (
                <div className="text-center text-muted py-5">
                  Aucun événement disponible
                </div>
              ) : (
                <div className="row g-3">
                  {evenements.map((evt) => (
                    <div className="col-md-6" key={evt.id}>
                      <div className="card border-0 shadow-sm p-4"
                        style={{
                          borderRadius: '15px',
                          borderLeft: `5px solid ${colors.primary}`
                        }}>
                        <h6 className="fw-bold mb-0">{evt.titre}</h6>
                        <div className="d-flex gap-2 mt-3">
                          <button className="btn btn-sm fw-bold flex-fill"
                            style={{
                              backgroundColor: colors.blue,
                              color: 'white',
                              borderRadius: '10px'
                            }}>
                            ✏️ Modifier
                          </button>
                          <button className="btn btn-sm fw-bold flex-fill"
                            style={{
                              backgroundColor: colors.secondary,
                              color: 'white',
                              borderRadius: '10px'
                            }}>
                            🗑️ Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Gestionnaire;