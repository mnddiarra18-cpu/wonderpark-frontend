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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/paiement" element={<Paiement />} />
        <Route path="/dashboard/admin" element={<Admin />} />
        <Route path="/dashboard/gestionnaire" element={<Gestionnaire />} />
        <Route path="/dashboard/caissier" element={<Caissier />} />
        <Route path="/dashboard/comptable" element={<Comptable />} />
      </Routes>
    </Router>
  );
}

export default App;