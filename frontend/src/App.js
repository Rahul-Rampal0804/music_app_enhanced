import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import SongList from './components/SongList';
import PlaylistManager from './components/PlaylistManager';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './services/auth';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated() ? <Navigate to="/songs" replace /> : <Login />
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated() ? (
                  <Navigate to="/songs" replace />
                ) : (
                  <Register />
                )
              }
            />
            <Route
              path="/songs"
              element={
                <ProtectedRoute>
                  <SongList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/playlists"
              element={
                <ProtectedRoute>
                  <PlaylistManager />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/songs" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

