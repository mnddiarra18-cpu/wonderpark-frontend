import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../assets/logo.png';
import { comptableAPI } from '../../services/api';
import { useEffect } from 'react';

const Comptable = () => {
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
  const [periodeSelectionnee, setPeriodeSelectionnee] = useState('mois');
  const [transactions, setTransactions] = useState([]);
const [stats, setStats] = useState({});
const [statsFinancieres, setStatsFinancieres] = useState({
  totalJour: 0,
  totalSemaine: 0,
  totalMois: 0,
  totalAnnee: 0,
  paiementsEnLigne: 0,
  paiementsSurPlace: 0,
  remboursements: 0,
  nombreTransactions: 0
});
const [caParFormule, setCaParFormule] = useState([]);
const [caParMois, setCaParMois] = useState([]);

useEffect(() => {
  const chargerDonnees = async () => {
    try {
      const [paiementsData, statsData] = await Promise.all([
        comptableAPI.tousPaiements(),
        comptableAPI.statistiques()
      ]);
      setTransactions(paiementsData.data);
      setStats(statsData.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  chargerDonnees();
}, []);

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'effectue':
        return <span className="badge bg-success">Effectué</span>;
      case 'en_attente':
        return <span className="badge bg-warning text-dark">
          En attente
        </span>;
      case 'rembourse':
        return <span className="badge bg-danger">Remboursé</span>;
      default:
        return null;
    }
  };

  const getModeBadge = (mode) => {
    return mode === 'en_ligne'
      ? <span className="badge bg-info">En ligne</span>
      : <span className="badge bg-secondary">Sur place</span>;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { id: 'accueil', label: 'Tableau de bord', icon: '🏠' },
    { id: 'transactions', label: 'Transactions', icon: '💳' },
    { id: 'rapports', label: 'Rapports financiers', icon: '📊' },
    { id: 'remboursements', label: 'Remboursements', icon: '🔄' },
    { id: 'export', label: 'Export données', icon: '📥' },
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
           style={{backgroundColor: colors.dark, zIndex: 1000}}>
        <div className="container-fluid px-3">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-light btn-sm me-3"
              onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <img src={logo} alt="Wonderpark" height="40"
                 className="me-2"/>
            <span className="fw-bold text-white">
              Comptabilité
            </span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white small">
              👤 Comptable
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
            <hr style={{borderColor: '#444', margin: '20px 10px'}}/>
            <Link
              to="/"
              className="px-3 py-2 mb-1 mx-2 rounded d-block
                         text-decoration-none"
              style={{color: '#ccc'}}>
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
                  style={{color: colors.dark}}>
                🏠 Tableau de bord financier
              </h4>

              {/* PÉRIODE */}
              <div className="d-flex gap-2 mb-4">
                {['jour', 'semaine', 'mois', 'annee'].map((p) => (
                  <button
                    key={p}
                    className="btn btn-sm fw-bold"
                    style={{
                      backgroundColor: periodeSelectionnee === p
                        ? colors.primary
                        : '#eee',
                      color: periodeSelectionnee === p
                        ? 'white'
                        : colors.dark,
                      borderRadius: '10px'
                    }}
                    onClick={() => setPeriodeSelectionnee(p)}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>

              {/* CARTES STATS */}
              <div className="row g-3 mb-4">
                {[
                  {
                    titre: "CA du jour",
                    valeur: `${statsFinancieres.totalJour
                      .toLocaleString()} F`,
                    icon: '📅',
                    couleur: colors.blue
                  },
                  {
                    titre: "CA de la semaine",
                    valeur: `${statsFinancieres.totalSemaine
                      .toLocaleString()} F`,
                    icon: '📆',
                    couleur: colors.green
                  },
                  {
                    titre: "CA du mois",
                    valeur: `${statsFinancieres.totalMois
                      .toLocaleString()} F`,
                    icon: '💰',
                    couleur: colors.primary
                  },
                  {
                    titre: "Remboursements",
                    valeur: `${statsFinancieres.remboursements
                      .toLocaleString()} F`,
                    icon: '🔄',
                    couleur: colors.secondary
                  }
                ].map((stat, i) => (
                  <div className="col-md-3" key={i}>
                    <div className="card border-0 shadow-sm"
                         style={{borderRadius: '15px'}}>
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between
                                        align-items-start">
                          <div>
                            <small className="text-muted">
                              {stat.titre}
                            </small>
                            <h4 className="fw-bold mb-0"
                                style={{color: stat.couleur}}>
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

              <div className="row g-3">
                {/* CA PAR FORMULE */}
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm p-4"
                       style={{borderRadius: '15px'}}>
                    <h6 className="fw-bold mb-3"
                        style={{color: colors.dark}}>
                      💰 CA par formule
                    </h6>
                    {caParFormule.map((item, i) => (
                      <div key={i} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <small className="fw-semibold">
                            {item.formule}
                          </small>
                          <small className="fw-bold"
                                 style={{color: colors.primary}}>
                            {item.montant.toLocaleString()} F
                            <span className="text-muted ms-1">
                              ({item.nb})
                            </span>
                          </small>
                        </div>
                        <div className="progress"
                             style={{height: '8px'}}>
                          <div
                            className="progress-bar"
                            style={{
                              width: `${(item.montant / 280000) * 100}%`,
                              backgroundColor: colors.primary
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CA PAR MOIS */}
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm p-4"
                       style={{borderRadius: '15px'}}>
                    <h6 className="fw-bold mb-3"
                        style={{color: colors.dark}}>
                      📈 CA mensuel
                    </h6>
                    {caParMois.map((item, i) => (
                      <div key={i} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <small className="fw-semibold">
                            {item.mois}
                          </small>
                          <small className="fw-bold"
                                 style={{color: colors.green}}>
                            {item.montant.toLocaleString()} F
                          </small>
                        </div>
                        <div className="progress"
                             style={{height: '8px'}}>
                          <div
                            className="progress-bar"
                            style={{
                              width: `${(item.montant / 245000) * 100}%`,
                              backgroundColor: colors.green
                            }}
                          />
                        </div>
                      </div>
                    ))}

                    {/* MODES DE PAIEMENT */}
                    <hr/>
                    <h6 className="fw-bold mb-3"
                        style={{color: colors.dark}}>
                      💳 Modes de paiement
                    </h6>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="small">
                        <span className="badge bg-info me-1">
                          En ligne
                        </span>
                      </span>
                      <span className="fw-bold small">
                        {statsFinancieres.paiementsEnLigne
                          .toLocaleString()} F
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="small">
                        <span className="badge bg-secondary me-1">
                          Sur place
                        </span>
                      </span>
                      <span className="fw-bold small">
                        {statsFinancieres.paiementsSurPlace
                          .toLocaleString()} F
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TRANSACTIONS */}
          {activeMenu === 'transactions' && (
            <div>
              <h4 className="fw-bold mb-4"
                  style={{color: colors.dark}}>
                💳 Toutes les transactions
              </h4>

              {/* FILTRES */}
              <div className="card border-0 shadow-sm p-3 mb-4"
                   style={{borderRadius: '15px'}}>
                <div className="row g-3">
                  <div className="col-md-3">
                    <input
                      type="date"
                      className="form-control"
                      style={{borderRadius: '10px'}}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="date"
                      className="form-control"
                      style={{borderRadius: '10px'}}
                    />
                  </div>
                  <div className="col-md-3">
                    <select className="form-select"
                            style={{borderRadius: '10px'}}>
                      <option>Tous les statuts</option>
                      <option>Effectué</option>
                      <option>En attente</option>
                      <option>Remboursé</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select className="form-select"
                            style={{borderRadius: '10px'}}>
                      <option>Toutes les méthodes</option>
                      <option>Orange Money</option>
                      <option>Wave</option>
                      <option>Espèces</option>
                      <option>Carte bancaire</option>
                    </select>
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
                          <th>Référence</th>
                          <th>Client</th>
                          <th>Formule</th>
                          <th>Date</th>
                          <th>Montant</th>
                          <th>Méthode</th>
                          <th>Mode</th>
                          <th>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((t) => (
                          <tr key={t.id}>
                            <td className="fw-semibold text-muted">
                              {t.reference}
                            </td>
                            <td>{t.client}</td>
                            <td>{t.formule}</td>
                            <td>{t.date}</td>
                            <td className="fw-bold"
                                style={{
                                  color: t.statut === 'rembourse'
                                    ? colors.secondary
                                    : colors.green
                                }}>
                              {t.statut === 'rembourse' ? '-' : ''}
                              {t.montant.toLocaleString()} F
                            </td>
                            <td>{t.methode}</td>
                            <td>{getModeBadge(t.mode)}</td>
                            <td>{getStatutBadge(t.statut)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* TOTAL */}
              <div className="card border-0 shadow-sm p-3 mt-3"
                   style={{
                     borderRadius: '15px',
                     borderLeft: `5px solid ${colors.green}`
                   }}>
                <div className="d-flex justify-content-between
                                align-items-center">
                  <span className="fw-bold">
                    Total des transactions effectuées
                  </span>
                  <span className="fw-bold fs-5"
                        style={{color: colors.green}}>
                    {transactions
                      .filter(t => t.statut === 'effectue')
                      .reduce((acc, t) => acc + t.montant, 0)
                      .toLocaleString()} F CFA
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* RAPPORTS */}
          {activeMenu === 'rapports' && (
            <div>
              <h4 className="fw-bold mb-4"
                  style={{color: colors.dark}}>
                📊 Rapports financiers
              </h4>
              <div className="row g-3">
                {[
                  {
                    titre: 'Rapport journalier',
                    description: 'Toutes les transactions du jour',
                    icon: '📅',
                    couleur: colors.blue
                  },
                  {
                    titre: 'Rapport hebdomadaire',
                    description: 'Synthèse de la semaine en cours',
                    icon: '📆',
                    couleur: colors.green
                  },
                  {
                    titre: 'Rapport mensuel',
                    description: 'Bilan financier du mois',
                    icon: '📋',
                    couleur: colors.primary
                  },
                  {
                    titre: 'Rapport annuel',
                    description: "Bilan de l'année en cours",
                    icon: '📈',
                    couleur: colors.purple
                  }
                ].map((rapport, i) => (
                  <div className="col-md-6" key={i}>
                    <div className="card border-0 shadow-sm p-4"
                         style={{borderRadius: '15px'}}>
                      <div className="d-flex align-items-start mb-3">
                        <div className="fs-2 me-3">{rapport.icon}</div>
                        <div>
                          <h6 className="fw-bold mb-1"
                              style={{color: rapport.couleur}}>
                            {rapport.titre}
                          </h6>
                          <p className="text-muted small mb-0">
                            {rapport.description}
                          </p>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm fw-bold flex-fill"
                          style={{
                            backgroundColor: rapport.couleur,
                            color: 'white',
                            borderRadius: '10px'
                          }}>
                          👁️ Consulter
                        </button>
                        <button
                          className="btn btn-sm fw-bold flex-fill"
                          style={{
                            backgroundColor: '#eee',
                            color: colors.dark,
                            borderRadius: '10px'
                          }}>
                          📥 Télécharger
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REMBOURSEMENTS */}
          {activeMenu === 'remboursements' && (
            <div>
              <h4 className="fw-bold mb-4"
                  style={{color: colors.dark}}>
                🔄 Remboursements
              </h4>
              <div className="card border-0 shadow-sm"
                   style={{borderRadius: '15px'}}>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead style={{backgroundColor: '#F8F9FA'}}>
                        <tr>
                          <th>Référence</th>
                          <th>Client</th>
                          <th>Montant</th>
                          <th>Méthode</th>
                          <th>Date</th>
                          <th>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions
                          .filter(t => t.statut === 'rembourse')
                          .map((t) => (
                          <tr key={t.id}>
                            <td className="fw-semibold text-muted">
                              {t.reference}
                            </td>
                            <td>{t.client}</td>
                            <td className="fw-bold"
                                style={{color: colors.secondary}}>
                              -{t.montant.toLocaleString()} F
                            </td>
                            <td>{t.methode}</td>
                            <td>{t.date}</td>
                            <td>{getStatutBadge(t.statut)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EXPORT */}
          {activeMenu === 'export' && (
            <div>
              <h4 className="fw-bold mb-4"
                  style={{color: colors.dark}}>
                📥 Export des données
              </h4>
              <div className="row g-3">
                {[
                  {
                    titre: 'Export Excel',
                    description: 'Exporter toutes les transactions en Excel',
                    icon: '📊',
                    couleur: colors.green,
                    format: '.xlsx'
                  },
                  {
                    titre: 'Export PDF',
                    description: 'Générer un rapport PDF complet',
                    icon: '📄',
                    couleur: colors.secondary,
                    format: '.pdf'
                  },
                  {
                    titre: 'Export CSV',
                    description: 'Exporter les données en format CSV',
                    icon: '📋',
                    couleur: colors.blue,
                    format: '.csv'
                  }
                ].map((exp, i) => (
                  <div className="col-md-4" key={i}>
                    <div className="card border-0 shadow-sm p-4
                                    text-center"
                         style={{borderRadius: '15px'}}>
                      <div className="fs-1 mb-2">{exp.icon}</div>
                      <h6 className="fw-bold mb-1"
                          style={{color: exp.couleur}}>
                        {exp.titre}
                      </h6>
                      <p className="text-muted small mb-3">
                        {exp.description}
                      </p>
                      <div className="mb-3">
                        <select className="form-select form-select-sm"
                                style={{borderRadius: '10px'}}>
                          <option>Ce mois</option>
                          <option>Cette semaine</option>
                          <option>Aujourd'hui</option>
                          <option>Période personnalisée</option>
                        </select>
                      </div>
                      <button
                        className="btn fw-bold w-100"
                        style={{
                          backgroundColor: exp.couleur,
                          color: 'white',
                          borderRadius: '10px'
                        }}>
                        📥 Télécharger {exp.format}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Comptable;