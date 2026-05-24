import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/logo.png';
import hero from '../assets/hero/hero.jpg';
import airedejeu1 from '../assets/airedejeu/airedejeu1.jpg';
import airedejeu2 from '../assets/airedejeu/airedejeu2.jpg';
import airedejeu3 from '../assets/airedejeu/airedejeu3.jpg';
import airedejeu4 from '../assets/airedejeu/airedejeu4.jpg';
import piscine1 from '../assets/piscine/piscine1.jpg';
import piscine2 from '../assets/piscine/piscine2.jpg';
import restaurant1 from '../assets/restaurant/restaurant1.jpg';
import restaurant2 from '../assets/restaurant/restaurant2.jpg';

const Accueil = () => {

  const colors = {
    primary: '#E8A020',
    secondary: '#E91E8C',
    green: '#4CAF50',
    blue: '#2196F3',
    purple: '#9C27B0',
    dark: '#3E2010',
    light: '#FFF9F0'
  };

  return (
    <div style={{ backgroundColor: colors.light }}>

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow"
        style={{ backgroundColor: colors.dark }}>
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Wonderpark" height="55" />
          </a>
          {localStorage.getItem('access_token') ? (
            <div className="d-flex align-items-center gap-2">
              <Link
                to="/mes-reservations"
                className="btn btn-sm fw-bold"
                style={{
                  backgroundColor: colors.primary,
                  color: 'white',
                  borderRadius: '10px'
                }}>
                📅 Mes réservations
              </Link>
              <button
                className="btn btn-sm fw-bold"
                style={{
                  backgroundColor: colors.secondary,
                  color: 'white',
                  borderRadius: '10px'
                }}
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = '/login';
                }}>
                🚪 Déconnexion
              </button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login"
                className="btn btn-sm fw-bold"
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid white',
                  borderRadius: '10px'
                }}>
                Connexion
              </Link>
              <Link to="/register"
                className="btn btn-sm fw-bold"
                style={{
                  backgroundColor: colors.primary,
                  color: 'white',
                  borderRadius: '10px'
                }}>
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="text-white text-center py-5 position-relative"
        style={{
          backgroundImage: `url(${hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center'
        }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(62,32,16,0.7)'
        }}></div>
        <div className="container position-relative">
          <img src={logo} alt="Wonderpark" height="150" className="mb-4" />
          <h1 className="display-3 fw-bold mb-3">
            Bienvenue à{' '}
            <span style={{ color: colors.primary }}>Wonderpark</span> 🎡
          </h1>
          <p className="lead fs-4 mb-2 fst-italic"
            style={{ color: colors.primary }}>
            "Le bonheur des tout-petits !!!"
          </p>
          <p className="mb-5 fs-5">
            Piscine, aire de jeu, restaurant familial à Dakar.
          </p>
          <Link to="/login"
            className="btn btn-lg fw-bold px-5 py-3 me-3"
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              borderRadius: '50px'
            }}>
            🎟️ Réserver maintenant
          </Link>
          <a href="#activites"
            className="btn btn-outline-light btn-lg px-5 py-3"
            style={{ borderRadius: '50px' }}>
            Découvrir nos activités
          </a>
        </div>
      </div>

      {/* SECTION ACTIVITÉS */}
      <section id="activites" className="py-5"
        style={{ backgroundColor: colors.light }}>
        <div className="container">
          <h2 className="text-center fw-bold mb-2"
            style={{ color: colors.dark }}>
            Nos Activités
          </h2>
          <div className="text-center mb-5">
            <span className="badge px-4 py-2 rounded-pill fs-6"
              style={{ backgroundColor: colors.primary }}>
              Des activités pour toute la famille
            </span>
          </div>
          <div className="row g-4">

            {/* Aire de jeu - Carrousel Bootstrap */}
            <div className="col-md-4">
              <div className="card h-100 shadow-lg border-0"
                style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div id="carouselAirejeu" className="carousel slide"
                  data-bs-ride="carousel">
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <img src={airedejeu1} className="d-block w-100"
                        alt="Aire de jeu 1"
                        style={{ height: '220px', objectFit: 'cover' }} />
                    </div>
                    <div className="carousel-item">
                      <img src={airedejeu2} className="d-block w-100"
                        alt="Aire de jeu 2"
                        style={{ height: '220px', objectFit: 'cover' }} />
                    </div>
                    <div className="carousel-item">
                      <img src={airedejeu3} className="d-block w-100"
                        alt="Aire de jeu 3"
                        style={{ height: '220px', objectFit: 'cover' }} />
                    </div>
                    <div className="carousel-item">
                      <img src={airedejeu4} className="d-block w-100"
                        alt="Aire de jeu 4"
                        style={{ height: '220px', objectFit: 'cover' }} />
                    </div>
                  </div>
                </div>
                <div className="card-body text-center p-4"
                  style={{ borderTop: `5px solid ${colors.green}` }}>
                  <div className="fs-1 mb-2">🎠</div>
                  <h4 className="fw-bold" style={{ color: colors.green }}>
                    Aire de Jeu
                  </h4>
                  <p className="text-muted">
                    Espace de jeu pour tout âge : Toboggans, structures gonflables, trampolines
                    et parcours d'obstacles.
                  </p>
                </div>
              </div>
            </div>

            {/* Piscine - Carrousel Bootstrap */}
            <div className="col-md-4">
              <div className="card h-100 shadow-lg border-0"
                style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div id="carouselPiscine" className="carousel slide"
                  data-bs-ride="carousel">
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <img src={piscine1} className="d-block w-100"
                        alt="Piscine 1"
                        style={{ height: '220px', objectFit: 'cover' }} />
                    </div>
                    <div className="carousel-item">
                      <img src={piscine2} className="d-block w-100"
                        alt="Piscine 2"
                        style={{ height: '220px', objectFit: 'cover' }} />
                    </div>
                  </div>
                </div>
                <div className="card-body text-center p-4"
                  style={{ borderTop: `5px solid ${colors.blue}` }}>
                  <div className="fs-1 mb-2">🏊</div>
                  <h4 className="fw-bold" style={{ color: colors.blue }}>
                    Piscine
                  </h4>
                  <p className="text-muted">
                    Piscine colorée et sécurisée avec jeux d'eau
                    et toboggans
                  </p>
                  <p className='text-muted'>
                    Age min: 3 ans
                  </p>
                </div>
              </div>
            </div>

            {/* Restaurant - Carrousel Bootstrap */}
            <div className="col-md-4">
              <div className="card h-100 shadow-lg border-0"
                style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div id="carouselRestaurant" className="carousel slide"
                  data-bs-ride="carousel">
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <img src={restaurant1} className="d-block w-100"
                        alt="Restaurant 1"
                        style={{ height: '220px', objectFit: 'cover' }} />
                    </div>
                    <div className="carousel-item">
                      <img src={restaurant2} className="d-block w-100"
                        alt="Restaurant 2"
                        style={{ height: '220px', objectFit: 'cover' }} />
                    </div>
                  </div>
                </div>
                <div className="card-body text-center p-4"
                  style={{ borderTop: `5px solid ${colors.secondary}` }}>
                  <div className="fs-1 mb-2">🍽️</div>
                  <h4 className="fw-bold" style={{ color: colors.secondary }}>
                    Restaurant Familial
                  </h4>
                  <p className="text-muted">
                    Savourez nos plats en famille avec vue directe
                    sur l'aire de jeu.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION FORMULES */}
      <section id="formules" className="py-5"
        style={{ backgroundColor: '#F5F5F5' }}>
        <div className="container">
          <h2 className="text-center fw-bold mb-2"
            style={{ color: colors.dark }}>
            Nos Formules & Tarifs
          </h2>
          <div className="text-center mb-5">
            <span className="badge px-4 py-2 rounded-pill fs-6"
              style={{ backgroundColor: colors.secondary }}>
              Choisissez la formule qui vous convient
            </span>
          </div>
          <div className="row g-4">

            {/* Demi-journée */}
            <div className="col-md-3">
              <div className="card h-100 shadow-lg border-0 text-center"
                style={{ borderRadius: '20px' }}>
                <div className="card-header py-3 text-white fw-bold"
                  style={{
                    backgroundColor: colors.blue,
                    borderRadius: '20px 20px 0 0'
                  }}>
                  ⏰ Demi-Journée
                </div>
                <div className="card-body p-4">
                  <h3 className="fw-bold my-3"
                    style={{ color: colors.blue }}>
                    5 000 F CFA
                  </h3>
                  <ul className="list-unstyled text-muted">
                    <li className="mb-2">✅ Accès Piscine</li>
                    <li className="mb-2">✅ Accès Aire de Jeu</li>
                    <li className="mb-2">❌ Goûter non inclus</li>
                  </ul>
                  <Link to="/login"
                    className="btn fw-bold mt-3 px-4 text-white w-100"
                    style={{
                      backgroundColor: colors.blue,
                      borderRadius: '20px'
                    }}>
                    Réserver
                  </Link>
                </div>
              </div>
            </div>

            {/* Journée entière */}
            <div className="col-md-3">
              <div className="card h-100 shadow-lg border-0 text-center"
                style={{
                  borderRadius: '20px',
                  border: `3px solid ${colors.primary}`
                }}>
                <div className="card-header py-3 text-white fw-bold"
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: '18px 18px 0 0'
                  }}>
                  ⭐ Journée Entière
                  <br />
                  <small>La plus populaire</small>
                </div>
                <div className="card-body p-4">
                  <h3 className="fw-bold my-3"
                    style={{ color: colors.primary }}>
                    10 000 F CFA
                  </h3>
                  <ul className="list-unstyled text-muted">
                    <li className="mb-2">✅ Accès Piscine</li>
                    <li className="mb-2">✅ Accès Aire de Jeu</li>
                    <li className="mb-2">✅ Goûter offert 🎁</li>
                  </ul>
                  <Link to="/login"
                    className="btn fw-bold mt-3 px-4 text-white w-100"
                    style={{
                      backgroundColor: colors.primary,
                      borderRadius: '20px'
                    }}>
                    Réserver
                  </Link>
                </div>
              </div>
            </div>

            {/* Aire de jeu 1h */}
            <div className="col-md-3">
              <div className="card h-100 shadow-lg border-0 text-center"
                style={{ borderRadius: '20px' }}>
                <div className="card-header py-3 text-white fw-bold"
                  style={{
                    backgroundColor: colors.green,
                    borderRadius: '20px 20px 0 0'
                  }}>
                  🎠 Aire de Jeu 1h
                </div>
                <div className="card-body p-4">
                  <h3 className="fw-bold my-3"
                    style={{ color: colors.green }}>
                    5 000 F CFA
                  </h3>
                  <ul className="list-unstyled text-muted">
                    <li className="mb-2">❌ Piscine non incluse</li>
                    <li className="mb-2">✅ Accès Aire de Jeu</li>
                    <li className="mb-2">⏱️ Durée : 1 heure</li>
                    <li className="mb-2">❌ Goûter non inclus</li>
                  </ul>
                  <Link to="/login"
                    className="btn fw-bold mt-3 px-4 text-white w-100"
                    style={{
                      backgroundColor: colors.green,
                      borderRadius: '20px'
                    }}>
                    Réserver
                  </Link>
                </div>
              </div>
            </div>

            {/* Aire de jeu 2h */}
            <div className="col-md-3">
              <div className="card h-100 shadow-lg border-0 text-center"
                style={{ borderRadius: '20px' }}>
                <div className="card-header py-3 text-white fw-bold"
                  style={{
                    backgroundColor: colors.purple,
                    borderRadius: '20px 20px 0 0'
                  }}>
                  🎠 Aire de Jeu 2h
                </div>
                <div className="card-body p-4">
                  <h3 className="fw-bold my-3"
                    style={{ color: colors.purple }}>
                    10 000 F CFA
                  </h3>
                  <ul className="list-unstyled text-muted">
                    <li className="mb-2">❌ Piscine non incluse</li>
                    <li className="mb-2">✅ Accès Aire de Jeu</li>
                    <li className="mb-2">⏱️ Durée : 2 heures</li>
                    <li className="mb-2">✅ Goûter inclus 🎁</li>
                  </ul>
                  <Link to="/login"
                    className="btn fw-bold mt-3 px-4 text-white w-100"
                    style={{
                      backgroundColor: colors.purple,
                      borderRadius: '20px'
                    }}>
                    Réserver
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION ÉVÉNEMENTS */}
      <section className="py-5 text-white text-center"
        style={{
          background: `linear-gradient(135deg,
                   ${colors.secondary},
                   ${colors.purple})`
        }}>
        <div className="container">
          <h2 className="fw-bold mb-3">🎉 Événements Spéciaux</h2>
          <p className="lead mb-4">
            Profiter de vos moments d'anniversaire à Wonderpark !!
          </p>
          <Link to="/login"
            className="btn btn-light btn-lg fw-bold px-5"
            style={{ borderRadius: '50px', color: colors.secondary }}>
            Organiser un anniversaire
          </Link>
        </div>
      </section>

      {/* SECTION CONTACT */}
      <section id="contact" className="py-5"
        style={{ backgroundColor: colors.light }}>
        <div className="container">
          <h2 className="text-center fw-bold mb-5"
            style={{ color: colors.dark }}>
            Contactez-nous
          </h2>
          <div className="row justify-content-center text-center">
            <div className="col-md-3">
              <div className="fs-1">📍</div>
              <h5 className="fw-bold" style={{ color: colors.dark }}>
                Adresse
              </h5>
              <p className="text-muted">
                Place du Souvenir Africain, Fann, Dakar
              </p>
            </div>
            <div className="col-md-3">
              <div className="fs-1">📞</div>
              <h5 className="fw-bold" style={{ color: colors.dark }}>
                Téléphone
              </h5>
              <p className="text-muted">78 301 52 52</p>
            </div>
            <div className="col-md-3">
              <div className="fs-1">🕐</div>
              <h5 className="fw-bold" style={{ color: colors.dark }}>
                Horaires
              </h5>
              <p className="text-muted">Lun - Dim : 8h - 20h</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-4 text-white text-center"
        style={{ backgroundColor: colors.dark }}>
        <div className="container">
          <img src={logo} alt="Wonderpark" height="50" className="mb-2" />
          <p className="mb-1 fst-italic" style={{ color: colors.primary }}>
            "Le bonheur des tout-petits !!!"
          </p>
          <p className="mb-0 text-muted small">
            © 2025 Wonderpark - Place du Souvenir Africain, Dakar |
            78 301 52 52
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Accueil;