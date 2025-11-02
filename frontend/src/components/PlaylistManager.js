import React, { useState, useEffect } from 'react';
import { playlistsAPI } from '../services/api';
import { songsAPI } from '../services/api';
import './PlaylistManager.css';

const PlaylistManager = () => {
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    loadPlaylists();
    loadSongs();
  }, []);

  // Update selected playlist when playlists change
  useEffect(() => {
    if (selectedPlaylist && playlists.length > 0) {
      const updated = playlists.find(p => p.id === selectedPlaylist.id);
      if (updated) {
        setSelectedPlaylist(updated);
      }
    }
  }, [playlists]);

  const loadPlaylists = async () => {
    try {
      const response = await playlistsAPI.getMine();
      setPlaylists(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load playlists.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSongs = async () => {
    try {
      const response = await songsAPI.getAll();
      setSongs(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      await playlistsAPI.create(newPlaylistName);
      setNewPlaylistName('');
      await loadPlaylists();
    } catch (err) {
      alert('Failed to create playlist.');
    }
  };

  const handleAddSong = async (playlistId, songId) => {
    try {
      await playlistsAPI.addSong(playlistId, songId);
      await loadPlaylists();
      if (selectedPlaylist?.id === playlistId) {
        const updated = playlists.find(p => p.id === playlistId);
        setSelectedPlaylist(updated);
      }
    } catch (err) {
      alert('Failed to add song to playlist.');
    }
  };

  const handleRemoveSong = async (playlistId, songId) => {
    try {
      await playlistsAPI.removeSong(playlistId, songId);
      await loadPlaylists();
      if (selectedPlaylist?.id === playlistId) {
        const updatedPlaylist = playlists.find(p => p.id === playlistId);
        if (updatedPlaylist) {
          updatedPlaylist.songs = updatedPlaylist.songs.filter(s => s.id !== songId);
          setSelectedPlaylist({ ...updatedPlaylist });
        }
      }
    } catch (err) {
      alert('Failed to remove song from playlist.');
    }
  };

  const handleSelectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  const isSongInPlaylist = (songId) => {
    return selectedPlaylist?.songs?.some(s => s.id === songId);
  };

  return (
    <div className="playlist-manager-container">
      <div className="playlist-manager-header">
        <h1>My Playlists</h1>
        <form onSubmit={handleCreatePlaylist} className="create-playlist-form">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="New playlist name..."
            className="playlist-input"
            required
          />
          <button type="submit" className="create-button">
            Create Playlist
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading playlists...</div>
      ) : (
        <div className="playlist-layout">
          <div className="playlist-list">
            <h2>Your Playlists</h2>
            {playlists.length === 0 ? (
              <p className="no-playlists">No playlists yet. Create one above!</p>
            ) : (
              <div className="playlists-grid">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className={`playlist-card ${
                      selectedPlaylist?.id === playlist.id ? 'selected' : ''
                    }`}
                    onClick={() => handleSelectPlaylist(playlist)}
                  >
                    <h3>{playlist.name}</h3>
                    <p className="playlist-count">
                      {playlist.songs?.length || 0} songs
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="playlist-details">
            {selectedPlaylist ? (
              <>
                <h2>{selectedPlaylist.name}</h2>
                <div className="playlist-songs">
                  <h3>Songs in Playlist</h3>
                  {selectedPlaylist.songs?.length === 0 ? (
                    <p className="no-songs">No songs in this playlist yet.</p>
                  ) : (
                    <ul className="songs-list">
                      {selectedPlaylist.songs?.map((song) => (
                        <li key={song.id} className="playlist-song-item">
                          <div className="song-details">
                            <strong>{song.title}</strong> - {song.artist}
                            <span className="song-genre">{song.genre}</span>
                          </div>
                          <button
                            onClick={() =>
                              handleRemoveSong(selectedPlaylist.id, song.id)
                            }
                            className="remove-button"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="add-songs-section">
                  <h3>Add Songs</h3>
                  <div className="available-songs">
                    {songs
                      .filter((song) => !isSongInPlaylist(song.id))
                      .map((song) => (
                        <div key={song.id} className="available-song">
                          <span>
                            {song.title} - {song.artist}
                          </span>
                          <button
                            onClick={() =>
                              handleAddSong(selectedPlaylist.id, song.id)
                            }
                            className="add-button"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="no-selection">
                <p>Select a playlist to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistManager;

