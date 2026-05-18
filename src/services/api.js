import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ||
  'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Timeout 15 secondes
});

// Intercepteur requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Nettoyer les données pour éviter les injections
    if (config.data && typeof config.data === 'object') {
      Object.keys(config.data).forEach(key => {
        if (typeof config.data[key] === 'string') {
          config.data[key] = config.data[key].trim();
        }
      });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur réponses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expiré - rafraîchir automatiquement
    if (error.response?.status === 401 &&
        !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_URL}/users/token/refresh/`,
            { refresh: refreshToken }
          );
          const newToken = response.data.access;
          localStorage.setItem('access_token', newToken);
          originalRequest.headers.Authorization =
            `Bearer ${newToken}`;
          return api(originalRequest);
        } catch {
          // Token refresh échoué : déconnexion
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = '/login';
        }
      } else {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      }
    }

    // Erreur 403 : accès interdit
    if (error.response?.status === 403) {
      console.error('Accès non autorisé');
    }

    // Erreur 429 : trop de requêtes
    if (error.response?.status === 429) {
      console.error('Trop de tentatives. Réessayez plus tard.');
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/users/register/', data),
  login: (data) => api.post('/users/login/', data),
  profile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.put('/users/profile/update/', data),
  logout: () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  }
};

export const reservationAPI = {
  creer: (data) => api.post('/reservations/creer/', data),
  mesReservations: () => api.get('/reservations/mes-reservations/'),
  detail: (id) => api.get(`/reservations/${id}/`),
  annuler: (id) => api.put(`/reservations/${id}/annuler/`),
  toutes: () => api.get('/reservations/toutes/'),
  modifierStatut: (id, statut) =>
    api.put(`/reservations/${id}/statut/`, { statut }),
};

export const paiementAPI = {
  creer: (data) => api.post('/paiements/creer/', data),
  mesPaiements: () => api.get('/paiements/mes-paiements/'),
  tous: () => api.get('/paiements/tous/'),
  statistiques: () => api.get('/paiements/statistiques/'),
  rembourser: (id) => api.put(`/paiements/${id}/rembourser/`),
  initierWave: (data) => api.post('/paiements/initier-wave/', data),
};

export const adminAPI = {
  listeUtilisateurs: () => api.get('/users/liste/'),
  supprimerUtilisateur: (id) => api.delete(`/users/${id}/`),
  modifierUtilisateur: (id, data) => api.put(`/users/${id}/`, data),
};

export const gestionnaireAPI = {
  toutesReservations: () => api.get('/reservations/toutes/'),
  modifierStatut: (id, statut) =>
    api.put(`/reservations/${id}/statut/`, { statut }),
};

export const comptableAPI = {
  tousPaiements: () => api.get('/paiements/tous/'),
  statistiques: () => api.get('/paiements/statistiques/'),
  rembourser: (id) => api.put(`/paiements/${id}/rembourser/`),
};

export const caissierAPI = {
  reservationsDuJour: () => api.get('/reservations/toutes/'),
  encaisser: (data) => api.post('/paiements/creer/', data),
};

export default api;