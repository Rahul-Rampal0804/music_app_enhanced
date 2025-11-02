import React, { useState } from 'react';
import { songsAPI } from '../services/api';
import './AddSongForm.css';

const AddSongForm = ({ onAddSong, onClose }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [durationSeconds, setDurationSeconds] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!youtubeLink.trim()) {
      setError('YouTube link is required');
      return;
    }

    if (!title.trim() || !artist.trim()) {
      setError('Title and Artist are required');
      return;
    }

    // Convert duration to seconds
    let totalSeconds = 0;
    try {
      const mins = durationMinutes ? parseInt(durationMinutes) : 0;
      const secs = durationSeconds ? parseInt(durationSeconds) : 0;
      totalSeconds = mins * 60 + secs;
    } catch (err) {
      setError('Invalid duration format');
      return;
    }

    setLoading(true);

    try {
      await songsAPI.addFromYouTube({
        title: title.trim(),
        artist: artist.trim(),
        genre: genre.trim() || 'Unknown',
        youtubeLink: youtubeLink.trim(),
        durationSeconds: totalSeconds,
      });
      
      // Reset form
      setTitle('');
      setArtist('');
      setGenre('');
      setYoutubeLink('');
      setDurationMinutes('');
      setDurationSeconds('');
      
      if (onAddSong) onAddSong();
      if (onClose) onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add song. Make sure you are logged in as ADMIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-song-overlay" onClick={onClose}>
      <div className="add-song-modal" onClick={(e) => e.stopPropagation()}>
        <div className="add-song-header">
          <h2>Add Song with YouTube Link</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="add-song-form">
          <div className="form-group">
            <label htmlFor="youtubeLink">YouTube Link or Video ID *</label>
            <input
              type="text"
              id="youtubeLink"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... or Video ID"
              required
            />
            <small className="help-text">
              Paste a YouTube URL (e.g., https://youtube.com/watch?v=VIDEO_ID) or just the video ID
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="title">Song Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Song Title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="artist">Artist *</label>
            <input
              type="text"
              id="artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Artist Name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <input
              type="text"
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Pop, Rock, Hip-Hop, etc."
            />
          </div>

          <div className="form-group duration-group">
            <label>Duration (Optional)</label>
            <div className="duration-inputs">
              <input
                type="number"
                min="0"
                max="59"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="Min"
                className="duration-input"
              />
              <span>:</span>
              <input
                type="number"
                min="0"
                max="59"
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(e.target.value)}
                placeholder="Sec"
                className="duration-input"
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Adding...' : 'Add Song'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSongForm;

