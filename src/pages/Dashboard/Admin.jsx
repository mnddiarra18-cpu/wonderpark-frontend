import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../assets/logo.png';
import { adminAPI, reservationAPI } from '../../services/api';

const Admin = () => {
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
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [stats, setStats] = useState([
    {
      titre: 'Total Réservations',
      valeur: '0',
      icon: '📅',
      couleur: '#2196F3',
      evolution: ''
    },
    {
      titre: 'Total Utilisateurs',
      valeur: '0',
      icon: '👥',
      couleur: '#4CAF50',
      evolution: ''
    },
    {
      titre: "Chiffre d'Affaires",
      valeur: '0 F',
      icon: '💰',
      couleur: '#E8A020',
      evolution: ''
    },
    {
      titre: 'Réservations du Jour',
      valeur: '0',
      icon: '🎟️',
      couleur: '#E91E8C',
      evolution: ''
    }
  ]);

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        const [resData, usersData] = await Promise.all([
          reservationAPI.toutes(),
          adminAPI.listeUtilisateurs()
        ]);
        setReservations(resData.data);
        setUtilisateurs(usersData.data);
        setStats([
          {
            titre: 'Total Réservations',
            valeur: resData.data.length.toString(),
            icon: '📅',
            couleur: '#2196F3',
            evolution: 'Total'
          },
          {
            titre: 'Total Utilisateurs',
            valeur: usersData.data.length.toString(),
            icon: '👥',
            couleur: '#4CAF50',
            evolution: 'Total'
          },
          {
            titre: "Chiffre d'Affaires",
            valeur: resData.data
              .reduce((acc, r) => acc + parseFloat(r.montant_total || 0), 0)
              .toLocaleString() + ' F',
            icon: '💰',
            couleur: '#E8A020',
            evolution: 'Total'
          },
          {
            titre: 'Réservations du Jour',
            valeur: resData.data
              .filter(r => r.date_reservation?.startsWith(
                new Date().toISOString().split('T')[0]
              )).length.toString(),
            icon: '🎟️',
            couleur: '#E91E8C',
            evolution: "Aujourd'hui"
          }
        ]);
      } catch (error) {
        console.error('Erreur admin:', error.response?.data);
      } finally {
        setLoadingData(false);
      }
    };
    chargerDonnees();
  }, []);
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

  const getRoleBadge = (role) => {
    const roleColors = {
      client: 'primary',
      gestionnaire: 'info',
      caissier: 'warning',
      comptable: 'secondary',
      admin: 'danger'
    };
    const reservationsFiltrees = reservations.filter((res) => {
  const matchSearch = searchTerm === '' ||
    res.client_nom?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchStatut = filterStatut === '' ||
    res.statut === filterStatut;

  const matchDate = filterDate === '' ||
    (res.date_reservation &&
     res.date_reservation.slice(0, 10) === filterDate);

  return matchSearch && matchStatut && matchDate;
});
    return (
      <span className={`badge bg-${roleColors[role] || 'primary'}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
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
    { id: 'utilisateurs', label: 'Utilisateurs', icon: '👥' },
    { id: 'statistiques', label: 'Statistiques', icon: '📊' },
    { id: 'base_donnees', label: 'Base de données', icon: '🗄️' },
    { id: 'parametres', label: 'Paramètres', icon: '⚙️' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5F5F5',
      display: 'flex',
      flexDirection: 'column'
    }}>

      <nav className="navbar navbar-dark shadow-sm"
           style={{backgroundColor: colors.dark, zIndex: 1000}}>
        <div className="container-fluid px-3">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-light btn-sm me-3"
              onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <img src={logo} alt="Wonderpark" height="40" className="me-2"/>
            <span className="fw-bold text-white">Administration</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white small">👤 Administrateur</span>
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
            <hr style={{borderColor: '#444', margin: '20px 10px'}}/>
            <Link to="/"
              className="px-3 py-2 mb-1 mx-2 rounded d-block text-decoration-none"
              style={{color: '#ccc'}}>
              <span className="me-2">🌐</span>
              <span className="fw-semibold">Voir le site</span>
            </Link>
          </div>
        )}

        <div className="flex-grow-1 p-4">

          {activeMenu === 'accueil' && (
            <div>
              <h4 className="fw-bold mb-4" style={{color: colors.dark}}>
                🏠 Tableau de bord
              </h4>
              <div className="row g-3 mb-4">
                {stats.map((stat, i) => (
                  <div className="col-md-3" key={i}>
                    <div className="card border-0 shadow-sm h-100"
                         style={{borderRadius: '15px'}}>
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between
                                        align-items-start mb-2">
                          <div>
                            <small className="text-muted">{stat.titre}</small>
                            <h4 className="fw-bold mb-0"
                                style={{color: stat.couleur}}>
                              {stat.valeur}
                            </h4>
                          </div>
                          <div className="fs-2">{stat.icon}</div>
                        </div>
                        <small className="text-success">
                          📈 {stat.evolution}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card border-0 shadow-sm"
                   style={{borderRadius: '15px'}}>
                <div className="card-header bg-white py-3 d-flex
                                justify-content-between align-items-center"
                     style={{borderRadius: '15px 15px 0 0'}}>
                  <h6 className="fw-bold mb-0" style={{color: colors.dark}}>
                    📅 Dernières Réservations
                  </h6>
                  <button
                    className="btn btn-sm fw-bold"
                    style={{
                      backgroundColor: colors.primary,
                      color: 'white',
                      borderRadius: '10px'
                    }}
                    onClick={() => setActiveMenu('reservations')}>
                    Voir tout
                  </button>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead style={{backgroundColor: '#F8F9FA'}}>
                        <tr>
                          <th>#</th>
                          <th>Client</th>
                          <th>Formule</th>
                          <th>Date</th>
                          <th>Enfants</th>
                          <th>Montant</th>
                          <th>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.slice(0, 5).map((res) => (
                          <tr key={res.id}>
                            <td>#{res.id}</td>
                            <td className="fw-semibold">{res.client_nom}</td>
                            <td>{res.formule_nom}</td>
                            <td>{res.date_reservation
                              ? new Date(res.date_reservation)
                                  .toLocaleDateString('fr-FR')
                              : ''}
                            </td>
                            <td>{res.nombre_enfants}</td>
                            <td className="fw-bold"
                                style={{color: colors.primary}}>
                              {parseFloat(res.montant_total || 0)
                                .toLocaleString()} F
                            </td>
                            <td>{getStatutBadge(res.statut)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'reservations' && (
  <div>
    <h4 className="fw-bold mb-4" style={{color: colors.dark}}>
      📅 Gestion des Réservations
    </h4>
    <div className="card border-0 shadow-sm p-3 mb-4"
         style={{borderRadius: '15px'}}>
      <div className="row g-3">
        <div className="col-md-4">
          <input type="text" className="form-control"
                 placeholder="🔍 Rechercher un client..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 style={{borderRadius: '10px'}}/>
        </div>
        <div className="col-md-3">
          <select className="form-select"
                  value={filterStatut}
                  onChange={(e) => setFilterStatut(e.target.value)}
                  style={{borderRadius: '10px'}}>
            <option value="">Tous les statuts</option>
            <option value="confirmee">Confirmée</option>
            <option value="en_attente">En attente</option>
            <option value="annulee">Annulée</option>
          </select>
        </div>
        <div className="col-md-3">
          <input type="date" className="form-control"
                 value={filterDate}
                 onChange={(e) => setFilterDate(e.target.value)}
                 style={{borderRadius: '10px'}}/>
        </div>
      </div>
    </div>
    <div className="card border-0 shadow-sm"
         style={{borderRadius: '15px'}}>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead style={{backgroundColor: '#F8F9FA'}}>
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
              {reservationsFiltrees.length === 0 ? (
                <tr>
                  <td colSpan="9"
                      className="text-center text-muted py-3">
                    Aucune réservation
                  </td>
                </tr>
              ) : (
                reservationsFiltrees.map((res) => (
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
                        style={{color: colors.primary}}>
                      {parseFloat(res.montant_total || 0)
                        .toLocaleString()} F
                    </td>
                    <td>{getStatutBadge(res.statut)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        style={{borderRadius: '8px'}}>
                        👁️
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        style={{borderRadius: '8px'}}>
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

          {activeMenu === 'utilisateurs' && (
            <div>
              <div className="d-flex justify-content-between
                              align-items-center mb-4">
                <h4 className="fw-bold mb-0" style={{color: colors.dark}}>
                  👥 Gestion des Utilisateurs
                </h4>
                <button className="btn fw-bold"
                        style={{
                          backgroundColor: colors.primary,
                          color: 'white',
                          borderRadius: '10px'
                        }}>
                  + Ajouter un utilisateur
                </button>
              </div>
              <div className="card border-0 shadow-sm"
                   style={{borderRadius: '15px'}}>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead style={{backgroundColor: '#F8F9FA'}}>
                        <tr>
                          <th>#</th>
                          <th>Nom</th>
                          <th>Email</th>
                          <th>Rôle</th>
                          <th>Statut</th>
                          <th>Date création</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {utilisateurs.length === 0 ? (
                          <tr>
                            <td colSpan="7"
                                className="text-center text-muted py-3">
                              Aucun utilisateur
                            </td>
                          </tr>
                        ) : (
                          utilisateurs.map((user) => (
                            <tr key={user.id}>
                              <td>#{user.id}</td>
                              <td className="fw-semibold">
                                {user.first_name} {user.last_name}
                              </td>
                              <td className="text-muted">{user.email}</td>
                              <td>{getRoleBadge(user.role)}</td>
                              <td>
                                {user.statut ? (
                                  <span className="badge bg-success">
                                    Actif
                                  </span>
                                ) : (
                                  <span className="badge bg-danger">
                                    Inactif
                                  </span>
                                )}
                              </td>
                              <td>{user.date_creation
                                ? new Date(user.date_creation)
                                    .toLocaleDateString('fr-FR')
                                : ''}
                              </td>
                              <td>
  <button
    className="btn btn-sm btn-outline-success me-1"
    style={{borderRadius: '8px'}}
    onClick={() => handleModifierStatut(res.id, 'confirmee')}>
    ✅
  </button>
  <button
    className="btn btn-sm btn-outline-danger"
    style={{borderRadius: '8px'}}
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

          {activeMenu === 'statistiques' && (
            <div>
              <h4 className="fw-bold mb-4" style={{color: colors.dark}}>
                📊 Statistiques
              </h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm p-4"
                       style={{borderRadius: '15px'}}>
                    <h6 className="fw-bold mb-3">
                      📅 Réservations par formule
                    </h6>
                    {[
                      {nom: 'Journée Entière', nb: 45, couleur: colors.primary},
                      {nom: 'Demi-Journée', nb: 32, couleur: colors.blue},
                      {nom: 'Aire de Jeu 1h', nb: 28, couleur: colors.green},
                      {nom: 'Aire de Jeu 2h', nb: 15, couleur: colors.purple},
                      {nom: 'Anniversaire', nb: 4, couleur: colors.secondary}
                    ].map((item, i) => (
                      <div key={i} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <small className="fw-semibold">{item.nom}</small>
                          <small className="fw-bold">{item.nb}</small>
                        </div>
                        <div className="progress" style={{height: '8px'}}>
                          <div className="progress-bar"
                               style={{
                                 width: `${(item.nb / 45) * 100}%`,
                                 backgroundColor: item.couleur
                               }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm p-4"
                       style={{borderRadius: '15px'}}>
                    <h6 className="fw-bold mb-3">
                      💰 Chiffre d'affaires mensuel
                    </h6>
                    {[
                      {mois: 'Janvier', montant: 180000},
                      {mois: 'Février', montant: 220000},
                      {mois: 'Mars', montant: 195000},
                      {mois: 'Avril', montant: 240000}
                    ].map((item, i) => (
                      <div key={i} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <small className="fw-semibold">{item.mois}</small>
                          <small className="fw-bold">
                            {item.montant.toLocaleString()} F
                          </small>
                        </div>
                        <div className="progress" style={{height: '8px'}}>
                          <div className="progress-bar"
                               style={{
                                 width: `${(item.montant / 240000) * 100}%`,
                                 backgroundColor: colors.primary
                               }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'base_donnees' && (
            <div>
              <h4 className="fw-bold mb-4" style={{color: colors.dark}}>
                🗄️ Gestion de la Base de Données
              </h4>
              <div className="row g-3">
                {[
                  {
                    icon: '💾', titre: 'Sauvegarde',
                    desc: "Dernière sauvegarde : aujourd'hui à 03h00",
                    btnText: 'Sauvegarder maintenant',
                    couleur: colors.green
                  },
                  {
                    icon: '📥', titre: 'Restauration',
                    desc: 'Restaurer depuis une sauvegarde',
                    btnText: 'Restaurer',
                    couleur: colors.blue
                  },
                  {
                    icon: '📋', titre: 'Logs système',
                    desc: "Consulter les journaux d'activité",
                    btnText: 'Voir les logs',
                    couleur: colors.purple
                  }
                ].map((item, i) => (
                  <div className="col-md-4" key={i}>
                    <div className="card border-0 shadow-sm p-4 text-center"
                         style={{borderRadius: '15px'}}>
                      <div className="fs-1 mb-2">{item.icon}</div>
                      <h6 className="fw-bold">{item.titre}</h6>
                      <p className="text-muted small">{item.desc}</p>
                      <button className="btn fw-bold w-100"
                              style={{
                                backgroundColor: item.couleur,
                                color: 'white',
                                borderRadius: '10px'
                              }}>
                        {item.btnText}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeMenu === 'parametres' && (
            <div>
              <h4 className="fw-bold mb-4" style={{color: colors.dark}}>
                ⚙️ Paramètres
              </h4>
              <div className="card border-0 shadow-sm p-4"
                   style={{borderRadius: '15px'}}>
                <h6 className="fw-bold mb-3">Informations du site</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Nom du site
                    </label>
                    <input type="text" className="form-control"
                           defaultValue="Wonderpark"
                           style={{borderRadius: '10px'}}/>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Email de contact
                    </label>
                    <input type="email" className="form-control"
                           defaultValue="contact@wonderpark.com"
                           style={{borderRadius: '10px'}}/>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Téléphone
                    </label>
                    <input type="text" className="form-control"
                           defaultValue="78 301 52 52"
                           style={{borderRadius: '10px'}}/>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Adresse
                    </label>
                    <input type="text" className="form-control"
                           defaultValue="Place du Souvenir Africain, Dakar"
                           style={{borderRadius: '10px'}}/>
                  </div>
                  <div className="col-12">
                    <button className="btn fw-bold px-4"
                            style={{
                              backgroundColor: colors.primary,
                              color: 'white',
                              borderRadius: '10px'
                            }}>
                      💾 Sauvegarder les paramètres
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Admin;