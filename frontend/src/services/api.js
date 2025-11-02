import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (username, password, role = 'USER') => {
    return api.post('/auth/register', { username, password, role });
  },
  login: (username, password) => {
    return api.post('/auth/login', { username, password });
  },
};

// Songs API
export const songsAPI = {
  getAll: () => api.get('/songs/public'),
  search: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/songs/search?${queryString}`);
  },
  getById: (id) => api.get(`/songs/${id}`),
  addSong: (song) => api.post('/songs', song),
  addFromYouTube: (songData) => api.post('/songs/youtube/add', songData),
};

// Playlists API
export const playlistsAPI = {
  getMine: () => api.get('/playlists/mine'),
  create: (name) => api.post('/playlists', { name }),
  addSong: (playlistId, songId) => api.post(`/playlists/${playlistId}/add/${songId}`),
  removeSong: (playlistId, songId) => api.post(`/playlists/${playlistId}/remove/${songId}`),
};

// Playback API
export const playbackAPI = {
  play: (songId) => api.post(`/playback/play/${songId}`),
  pause: (positionSeconds) => api.post('/playback/pause', { pos: positionSeconds }),
  resume: () => api.post('/playback/resume'),
  stop: () => api.post('/playback/stop'),
  getCurrent: () => api.get('/playback/current'),
};

// User API
export const userAPI = {
  getMe: () => api.get('/users/me'),
};

export default api;

