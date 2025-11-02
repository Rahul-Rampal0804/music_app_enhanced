import React, { useState, useEffect } from 'react';
import { songsAPI } from '../services/api';
import { playbackAPI } from '../services/api';
import AddSongForm from './AddSongForm';
import YouTubePlayer from './YouTubePlayer';
import './SongList.css';

const SongList = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [currentPlayback, setCurrentPlayback] = useState(null);
  const [showAddSongForm, setShowAddSongForm] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);

  useEffect(() => {
    loadSongs();
    loadCurrentPlayback();
  }, []);

  const loadSongs = async () => {
    try {
      setLoading(true);
      const response = await songsAPI.getAll();
      setSongs(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load songs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentPlayback = async () => {
    try {
      const response = await playbackAPI.getCurrent();
      setCurrentPlayback(response.data);
    } catch (err) {
      // No current playback is fine
      setCurrentPlayback(null);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadSongs();
      return;
    }

    try {
      setLoading(true);
      const params = { [searchType]: searchTerm };
      const response = await songsAPI.search(params);
      setSongs(response.data);
      setError('');
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = async (song) => {
    try {
      await playbackAPI.play(song.id);
      await loadCurrentPlayback();
      // If song has YouTube video ID, play it
      if (song.youtubeVideoId) {
        setCurrentVideoId(song.youtubeVideoId);
      }
    } catch (err) {
      alert('Failed to play song. Please try again.');
    }
  };

  const handleAddSong = () => {
    loadSongs();
  };

  return (
    <div className="song-list-container">
      <div className="song-list-header">
        <div className="header-top">
          <h1>All Songs</h1>
          <button
            onClick={() => setShowAddSongForm(true)}
            className="add-song-button"
            title="Add song with YouTube link"
          >
            ➕ Add Song with YouTube Link
          </button>
        </div>
        <form onSubmit={handleSearch} className="search-form">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-select"
          >
            <option value="title">Title</option>
            <option value="artist">Artist</option>
            <option value="genre">Genre</option>
          </select>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search songs..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              loadSongs();
            }}
            className="clear-button"
          >
            Clear
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading songs...</div>
      ) : songs.length === 0 ? (
        <div className="no-songs">No songs found.</div>
      ) : (
        <div className="songs-grid">
          {songs.map((song) => (
            <div key={song.id} className="song-card">
              {song.thumbnailUrl && (
                <div className="song-thumbnail">
                  <img src={song.thumbnailUrl} alt={song.title} />
                </div>
              )}
              <div className="song-info">
                <h3>{song.title}</h3>
                <p className="song-artist">{song.artist}</p>
                <p className="song-genre">{song.genre}</p>
              </div>
              <button
                onClick={() => handlePlay(song)}
                className={`play-button ${
                  currentPlayback?.song?.id === song.id &&
                  currentPlayback?.status === 'PLAYING'
                    ? 'playing'
                    : ''
                }`}
              >
                {currentPlayback?.song?.id === song.id &&
                currentPlayback?.status === 'PLAYING'
                  ? '▶ Playing'
                  : '▶ Play'}
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddSongForm && (
        <AddSongForm
          onAddSong={handleAddSong}
          onClose={() => setShowAddSongForm(false)}
        />
      )}

      {currentVideoId && (
        <YouTubePlayer
          videoId={currentVideoId}
          onClose={() => setCurrentVideoId(null)}
        />
      )}
    </div>
  );
};

export default SongList;

