import axios from 'axios';

const API_URL = "https://wonderpark-backend.onrender.com/api/users";
// Configuration axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expiré, essayer de le rafraîchir
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_URL}/users/token/refresh/`,
            { refresh: refreshToken }
          );
          localStorage.setItem(
            'access_token',
            response.data.access
          );
          error.config.headers.Authorization =
            `Bearer ${response.data.access}`;
          return api(error.config);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ==================
// AUTHENTIFICATION
// ==================
export const authAPI = {
  register: (data) => api.post('/register/', data),
  login: (data) => api.post('/login/', data),
  profile: () => api.get('/profile/'),
  updateProfile: (data) => api.put('/profile/update/', data),
};

// ==================
// RÉSERVATIONS
// ==================
export const reservationAPI = {
  creer: (data) => api.post('/reservations/creer/', data),
  mesReservations: () => api.get('/reservations/mes-reservations/'),
  detail: (id) => api.get(`/reservations/${id}/`),
  annuler: (id) => api.put(`/reservations/${id}/annuler/`),
  toutes: () => api.get('/reservations/toutes/'),
  modifierStatut: (id, statut) =>
    api.put(`/reservations/${id}/statut/`, { statut }),
};

// ==================
// PAIEMENTS
// ==================
export const paiementAPI = {
  creer: (data) => api.post('/paiements/creer/', data),
  mesPaiements: () => api.get('/paiements/mes-paiements/'),
  tous: () => api.get('/paiements/tous/'),
  statistiques: () => api.get('/paiements/statistiques/'),
  rembourser: (id) => api.put(`/paiements/${id}/rembourser/`),
};

// ==================
// ADMIN
// ==================
export const adminAPI = {
  listeUtilisateurs: () => api.get('/users/liste/'),
  supprimerUtilisateur: (id) => api.delete(`/users/${id}/`),
  modifierUtilisateur: (id, data) => api.put(`/users/${id}/`, data),
};

// ==================
// GESTIONNAIRE
// ==================
export const gestionnaireAPI = {
  toutesReservations: () => api.get('/reservations/toutes/'),
  modifierStatut: (id, statut) =>
    api.put(`/reservations/${id}/statut/`, { statut }),
};

// ==================
// COMPTABLE
// ==================
export const comptableAPI = {
  tousPaiements: () => api.get('/paiements/tous/'),
  statistiques: () => api.get('/paiements/statistiques/'),
  rembourser: (id) => api.put(`/paiements/${id}/rembourser/`),
};

// ==================
// CAISSIER
// ==================
export const caissierAPI = {
  reservationsDuJour: () => api.get('/reservations/toutes/'),
  encaisser: (data) => api.post('/paiements/creer/', data),
};

export default api;