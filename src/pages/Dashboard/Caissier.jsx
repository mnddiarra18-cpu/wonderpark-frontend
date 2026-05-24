import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../assets/logo.png';
import { caissierAPI } from '../../services/api';

const Caissier = () => {
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
  const [reservationsDuJour, setReservationsDuJour] = useState([]);
  const [paiementsEffectues, setPaiementsEffectues] = useState([]);
  const [encaissementData, setEncaissementData] = useState({
    reservation_id: '',
    methode_paiement: 'especes',
    mode_paiement: 'sur_place',
    montant: ''
  });
  const [encaissementSuccess, setEncaissementSuccess] = useState(false);
  const [encaissementError, setEncaissementError] = useState('');

  const handleEncaisser = async (reservationId, montant) => {
    const methode = window.prompt(
      'Méthode de paiement ?\n1. especes\n2. orange_money\n3. wave',
      'especes'
    );
    if (!methode) return;

    try {
      await caissierAPI.encaisser({
        reservation_id: reservationId,
        methode_paiement: methode,
        mode_paiement: 'sur_place'
      });
      alert('✅ Paiement encaissé avec succès !');
      const [resResponse, paiResponse] = await Promise.all([
        caissierAPI.reservationsDuJour(),
        caissierAPI.tousPaiements()
      ]);
      setReservationsDuJour(resResponse.data);
      setPaiementsEffectues(paiResponse.data);
    } catch (error) {
      alert('❌ Erreur: ' + (error.response?.data?.error || 'Erreur encaissement'));
    }
  };
  useEffect(() => {
    const chargerReservations = async () => {
      try {
        const response = await caissierAPI.reservationsDuJour();
        const paiResponse = await caissierAPI.tousPaiements();
        setPaiementsEffectues(paiResponse.data);
        setReservationsDuJour(response.data);
      } catch (error) {
        console.error('Erreur:', error.response?.data);
      }
    };
    chargerReservations();
  }, []);
  const getModePaiementBadge = (mode) => {
    if (!mode) return (
      <span className="badge bg-secondary">Non défini</span>
    );
    return mode === 'en_ligne'
      ? <span className="badge bg-info">💻 En ligne</span>
      : <span className="badge bg-warning text-dark">
        🏢 Sur place
      </span>;
  };

  const getMethodePaiementBadge = (methode) => {
    if (!methode) return null;
    const config = {
      orange_money: { label: 'Orange Money', color: '#FF6600' },
      wave: { label: 'Wave', color: '#1DC8FF' },
      carte: { label: 'Carte', color: '#2196F3' },
      especes: { label: 'Espèces', color: '#4CAF50' }
    };
    const m = config[methode] || { label: methode, color: '#999' };
    return (
      <span className="badge"
        style={{
          backgroundColor: `${m.color}20`,
          color: m.color,
          border: `1px solid ${m.color}50`
        }}>
        {m.label}
      </span>
    );
  };
  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'confirmee':
        return <span className="badge bg-success">Confirmée</span>;
      case 'en_attente':
        return <span className="badge bg-warning text-dark">
          En attente
        </span>;
      case 'annulee':
        return <span className="badge bg-danger">Annulée</span>;
      case 'effectue':
        return <span className="badge bg-success">Effectué</span>;
      default:
        return null;
    }
  };

  const getModePaiementBadge = (mode) => {
    return mode === 'en_ligne'
      ? <span className="badge bg-info">En ligne</span>
      : <span className="badge bg-secondary">Sur place</span>;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const menuItems = [
    { id: 'accueil', label: 'Tableau de bord', icon: '🏠' },
    { id: 'reservations', label: 'Réservations du jour', icon: '📅' },
    { id: 'encaissement', label: 'Encaissement', icon: '💵' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5F5F5',
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* NAVBAR */}
      <nav className="navbar navbar-dark shadow-sm"
        style={{ backgroundColor: colors.dark, zIndex: 1000 }}>
        <div className="container-fluid px-3">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-light btn-sm me-3"
              onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <img src={logo} alt="Wonderpark" height="40"
              className="me-2" />
            <span className="fw-bold text-white">
              Caisse
            </span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white small">
              👤 Caissier
            </span>
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

        {/* SIDEBAR */}
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
                    ? `${colors.primary}30`
                    : 'transparent',
                  borderLeft: activeMenu === item.id
                    ? `4px solid ${colors.primary}`
                    : '4px solid transparent',
                  color: activeMenu === item.id
                    ? colors.primary
                    : '#ccc',
                  transition: 'all 0.2s'
                }}
                onClick={() => setActiveMenu(item.id)}>
                <span className="me-2">{item.icon}</span>
                <span className="fw-semibold">{item.label}</span>
              </div>
            ))}
            <hr style={{ borderColor: '#444', margin: '20px 10px' }} />
            <Link
              to="/"
              className="px-3 py-2 mb-1 mx-2 rounded d-block
                         text-decoration-none"
              style={{ color: '#ccc' }}>
              <span className="me-2">🌐</span>
              <span className="fw-semibold">Voir le site</span>
            </Link>
          </div>
        )}

        {/* CONTENU PRINCIPAL */}
        <div className="flex-grow-1 p-4">

          {/* TABLEAU DE BORD */}
          {activeMenu === 'accueil' && (
            <div>
              <h4 className="fw-bold mb-4"
                style={{ color: colors.dark }}>
                🏠 Tableau de bord
              </h4>

              {/* CARTES STATS */}
              <div className="row g-3 mb-4">
                {[
                  {
                    titre: 'Réservations du jour',
                    valeur: reservationsDuJour.length,
                    icon: '📅',
                    couleur: colors.blue
                  },
                  {
                    titre: 'Paiements sur place',
                    valeur: `${paiementsEffectues
                      .filter(p => p.statut === 'effectue' && p.mode_paiement === 'sur_place')

                      .reduce((acc, p) => acc + parseFloat(p.montant || 0), 0)
                      .toLocaleString()} F`,
                    icon: '💵',
                    couleur: colors.green
                  },
                  {
                    titre: 'En attente de paiement',
                    valeur: reservationsDuJour.filter(
                      r => r.statut === 'en_attente'
                    ).length,
                    icon: '⏳',
                    couleur: colors.primary
                  },
                  {
                    titre: 'Total encaissé',
                    valeur: `${paiementsEffectues
                      .filter(p => p.statut === 'effectue')
                      .reduce((acc, p) => acc + parseFloat(p.montant || 0), 0)
                      .toLocaleString()} F`,
                    icon: '💰',
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
                            <small className="text-muted">
                              {stat.titre}
                            </small>
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

              {/* RÉSERVATIONS EN ATTENTE */}
              <div className="card border-0 shadow-sm mb-4"
                style={{ borderRadius: '15px' }}>
                <div className="card-header bg-white py-3"
                  style={{ borderRadius: '15px 15px 0 0' }}>
                  <h6 className="fw-bold mb-0"
                    style={{ color: colors.dark }}>
                    ⏳ Réservations en attente de paiement
                  </h6>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead style={{ backgroundColor: '#F8F9FA' }}>
                        <tr>
                          <th>Client</th>
                          <th>Formule</th>
                          <th>Enfants</th>
                          <th>Accomp.</th>
                          <th>Montant</th>
                          <th>Actions</th>
                          <th>Mode</th>
                          <th>Methode</th>

                        </tr>
                      </thead>
                      <tbody>

                        {reservationsDuJour
                          .filter(r => r.statut === 'en_attente')
                          .map((res) => (
                            <tr key={res.id}>
                              <td className="fw-semibold">
                                {res.client_nom}
                              </td>
                              <tr key={res.id}>
                                <td>#{res.id}</td>
                                <td className="fw-semibold">{res.client_nom}</td>
                                <td>{res.formule_nom}</td>
                                <td>{res.nombre_enfants}</td>
                                <td>
                                  {res.nombre_accompagnateurs}
                                  <small className="text-success d-block">
                                    🥤 Boisson offerte
                                  </small>
                                </td>
                                <td className="fw-bold"
                                  style={{ color: colors.primary }}>
                                  {parseFloat(res.montant_total || 0)
                                    .toLocaleString()} F
                                </td>
                                <td>{getModePaiementBadge(res.mode_paiement)}</td>
                                <td>{getMethodePaiementBadge(res.methode_paiement)}</td>
                                <td>
                                  {res.statut === 'en_attente' &&
                                    res.mode_paiement !== 'en_ligne' && (
                                      <button
                                        className="btn btn-sm fw-bold me-1"
                                        style={{
                                          backgroundColor: colors.green,
                                          color: 'white',
                                          borderRadius: '8px'
                                        }}
                                        onClick={() => handleEncaisser(res.id)}>
                                        💵 Encaisser
                                      </button>
                                    )}
                                  {res.statut === 'en_attente' && (
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      style={{ borderRadius: '8px' }}
                                      onClick={() => handleAnnuler(res.id)}>
                                      ❌
                                    </button>
                                  )}
                                  {res.statut === 'confirmee' && (
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      style={{ borderRadius: '8px' }}
                                      onClick={() => window.print()}>
                                      🖨️ Reçu
                                    </button>
                                  )}
                                </td>
                              </tr>
                              <td>{res.formule_nom}</td>
                              <td>{res.nombre_enfants}</td>
                              <td>
                                {res.nombre_accompagnateurs}
                                <small className="text-success d-block">
                                  🥤 Boisson offerte
                                </small>
                              </td>
                              <td className="fw-bold"
                                style={{ color: colors.primary }}>
                                {parseFloat(res.montant_total || 0)
                                  .toLocaleString()} F
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm fw-bold me-1"
                                  style={{
                                    backgroundColor: colors.green,
                                    color: 'white',
                                    borderRadius: '8px'
                                  }}
                                  onClick={() => handleEncaisser(res.id, res.montant_total)}>
                                  💵 Encaisser
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  style={{ borderRadius: '8px' }}>
                                  ❌
                                </button>
                              </td>
                            </tr>

                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RÉSERVATIONS DU JOUR */}
          {activeMenu === 'reservations' && (
            <div>
              <h4 className="fw-bold mb-4" style={{ color: colors.dark }}>
                📅 Réservations du jour
              </h4>
              <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead style={{ backgroundColor: '#F8F9FA' }}>
                        <tr>
                          <th>#</th>
                          <th>Client</th>
                          <th>Formule</th>
                          <th>Enfants</th>
                          <th>Accomp.</th>
                          <th>Montant</th>
                          <th>Statut</th>
                          <th>Paiement</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservationsDuJour.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="text-center text-muted py-3">
                              Aucune réservation
                            </td>
                          </tr>
                        ) : (
                          reservationsDuJour.map((res) => (
                            <tr key={res.id}>
                              <td>#{res.id}</td>
                              <td className="fw-semibold">{res.client_nom}</td>
                              <td>{res.formule_nom}</td>
                              <td>{res.nombre_enfants}</td>
                              <td>
                                {res.nombre_accompagnateurs}
                                <small className="text-success d-block">
                                  🥤 Boisson offerte
                                </small>
                              </td>
                              <td className="fw-bold" style={{ color: colors.primary }}>
                                {parseFloat(res.montant_total || 0).toLocaleString()} F
                              </td>
                              <td>{getStatutBadge(res.statut)}</td>
                              <td>
                                {res.statut === 'confirmee' ? (
                                  <span>
                                    <span className={`badge me-1 ${res.mode_paiement === 'sur_place' ? 'bg-secondary' : 'bg-info'}`}>
                                      {res.mode_paiement === 'sur_place' ? '🏢 Sur place' : '💳 En ligne'}
                                    </span>
                                    <small className="d-block text-muted mt-1">
                                      {res.methode_paiement === 'especes'
                                        ? '💵 Espèces'
                                        : res.methode_paiement === 'orange_money'
                                          ? ' Orange Money'
                                          : res.methode_paiement === 'wave'
                                            ? ' Wave'
                                            : res.methode_paiement === 'carte'
                                              ? ' Carte Bancaire'
                                              : '—'}
                                    </small>
                                  </span>
                                ) : (
                                  <span className="badge bg-warning text-dark">
                                    ⏳ En attente
                                  </span>
                                )}
                              </td>
                              <td>
                                {res.statut === 'en_attente' && (
                                  <button
                                    className="btn btn-sm fw-bold"
                                    style={{
                                      backgroundColor: colors.green,
                                      color: 'white',
                                      borderRadius: '8px'
                                    }}
                                    onClick={() => handleEncaisser(res.id, res.montant_total)}>
                                    💵 Encaisser
                                  </button>
                                )}
                                {res.statut === 'confirmee' && (
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    style={{ borderRadius: '8px' }}
                                    onClick={() => window.print()}>
                                    🖨️ Reçu
                                  </button>
                                )}
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
          {/* ENCAISSEMENT */}
          {activeMenu === 'encaissement' && (
  <div>
    <h4 className="fw-bold mb-4" style={{color: colors.dark}}>
      💵 Encaissement sur place
    </h4>

    {encaissementSuccess && (
      <div className="alert alert-success alert-dismissible">
        ✅ Paiement enregistré avec succès !
        <button type="button" className="btn-close"
                onClick={() => setEncaissementSuccess(false)}/>
      </div>
    )}
    {encaissementError && (
      <div className="alert alert-danger alert-dismissible">
        ❌ {encaissementError}
        <button type="button" className="btn-close"
                onClick={() => setEncaissementError('')}/>
      </div>
    )}

    <div className="row justify-content-center">
      <div className="col-md-7">
        <div className="card border-0 shadow-sm p-4"
             style={{borderRadius: '15px'}}>
          <h6 className="fw-bold mb-4"
              style={{color: colors.dark}}>
            Enregistrer un paiement sur place
          </h6>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Numéro de réservation
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Ex: 1"
              value={encaissementData.reservation_id}
              onChange={(e) => setEncaissementData({
                ...encaissementData,
                reservation_id: e.target.value
              })}
              style={{borderRadius: '10px'}}
            />
          </div>

          {/* MÉTHODE DE PAIEMENT DU CLIENT */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Méthode de paiement du client
            </label>
            <div className="row g-2">
              {[
                {
                  id: 'especes',
                  label: 'Espèces',
                  emoji: '💵',
                  color: '#4CAF50'
                },
                {
                  id: 'orange_money',
                  label: 'Orange Money',
                  emoji: '📱',
                  color: '#FF6600'
                },
                {
                  id: 'wave',
                  label: 'Wave',
                  emoji: '🌊',
                  color: '#1DC8FF'
                },
                {
                  id: 'carte',
                  label: 'Carte',
                  emoji: '💳',
                  color: '#2196F3'
                }
              ].map((m) => (
                <div className="col-6" key={m.id}>
                  <div
                    className="card text-center p-2"
                    style={{
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: encaissementData.methode_paiement === m.id
                        ? `2px solid ${m.color}`
                        : '2px solid #eee',
                      backgroundColor:
                        encaissementData.methode_paiement === m.id
                        ? `${m.color}15`
                        : 'white'
                    }}
                    onClick={() => setEncaissementData({
                      ...encaissementData,
                      methode_paiement: m.id
                    })}>
                    <div>{m.emoji}</div>
                    <small className="fw-bold"
                           style={{color: m.color}}>
                      {m.label}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="btn w-100 fw-bold py-3"
            style={{
              backgroundColor: colors.green,
              color: 'white',
              borderRadius: '15px',
              fontSize: '1.1rem'
            }}
            onClick={handleValiderEncaissement}>
            💵 Valider le paiement
          </button>
        </div>
      </div>
    </div>
  </div>
)}

          {/* PAIEMENTS EFFECTUÉS */}
          {activeMenu === 'paiements' && (
            <div>
              <h4 className="fw-bold mb-4"
                style={{ color: colors.dark }}>
                ✅ Paiements effectués
              </h4>
              <div className="card border-0 shadow-sm"
                style={{ borderRadius: '15px' }}>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead style={{ backgroundColor: '#F8F9FA' }}>
                        <tr>
                          <th>Référence</th>
                          <th>Client</th>
                          <th>Montant</th>
                          <th>Méthode</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paiementsEffectues.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center
                                                        text-muted py-3">
                              Aucun paiement
                            </td>
                          </tr>
                        ) : (
                          paiementsEffectues.map((paiement) => (
                            <tr key={paiement.id}>
                              <td className="fw-semibold text-muted">
                                {paiement.reference}
                              </td>
                              <td>{paiement.client_nom}</td>
                              <td className="fw-bold"
                                style={{ color: colors.green }}>
                                {parseFloat(paiement.montant || 0)
                                  .toLocaleString()} F
                              </td>
                              <td>{paiement.methode_paiement}</td>
                              <td>{getStatutBadge(paiement.statut)}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-primary me-1"
                                  style={{ borderRadius: '8px' }}
                                  onClick={() => window.print()}>
                                  🖨️ Reçu
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
              <div className="card border-0 shadow-sm p-3 mt-3"
                style={{
                  borderRadius: '15px',
                  borderLeft: `5px solid ${colors.green}`
                }}>
                <div className="d-flex justify-content-between
                                align-items-center">
                  <span className="fw-bold fs-6">
                    Total encaissé
                  </span>
                  <span className="fw-bold fs-4"
                    style={{ color: colors.green }}>
                    {paiementsEffectues
                      .reduce((acc, p) =>
                        acc + parseFloat(p.montant || 0), 0)
                      .toLocaleString()} F CFA
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Caissier;