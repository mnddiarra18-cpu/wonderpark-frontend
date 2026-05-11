import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Accueil from './pages/Accueil';
import Login from './pages/Login';
import Register from './pages/Register';
import Reservation from './pages/Reservation';
import Paiement from './pages/Paiement';
import Admin from './pages/Dashboard/Admin';
import Gestionnaire from './pages/Dashboard/Gestionnaire';
import Caissier from './pages/Dashboard/Caissier';
import Comptable from './pages/Dashboard/Comptable';
import MesReservations from './pages/MesReservations';

const isAuthenticated = () => {
  return localStorage.getItem('access_token') !== null;
};

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reservation"
               element={<PrivateRoute element={<Reservation />} />} />
        <Route path="/paiement"
               element={<PrivateRoute element={<Paiement />} />} />
        <Route path="/dashboard/admin"
               element={<PrivateRoute element={<Admin />} />} />
        <Route path="/dashboard/gestionnaire"
               element={<PrivateRoute element={<Gestionnaire />} />} />
        <Route path="/dashboard/caissier"
               element={<PrivateRoute element={<Caissier />} />} />
        <Route path="/dashboard/comptable"
               element={<PrivateRoute element={<Comptable />} />} />
        <Route path="/mes-reservations"
               element={<PrivateRoute element={<MesReservations />} />} />
      </Routes>
    </Router>
  );
}

export default App;