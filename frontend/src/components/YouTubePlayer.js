import React, { useEffect, useRef } from 'react';
import './YouTubePlayer.css';

const YouTubePlayer = ({ videoId, onClose, autoplay = true }) => {
  const playerRef = useRef(null);
  const playerInstanceRef = useRef(null);

  useEffect(() => {
    // Load YouTube iframe API script
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    const onYouTubeIframeAPIReady = () => {
      if (!playerInstanceRef.current && videoId) {
        playerInstanceRef.current = new window.YT.Player(playerRef.current, {
          videoId: videoId,
          playerVars: {
            autoplay: autoplay ? 1 : 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
          },
          events: {
            onReady: (event) => {
              if (autoplay) {
                event.target.playVideo();
              }
            },
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }

    // Cleanup
    return () => {
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.destroy();
        } catch (e) {
          console.error('Error destroying player:', e);
        }
        playerInstanceRef.current = null;
      }
    };
  }, [videoId, autoplay]);

  return (
    <div className="youtube-player-overlay" onClick={onClose}>
      <div className="youtube-player-container" onClick={(e) => e.stopPropagation()}>
        <div className="youtube-player-header">
          <h3>Now Playing</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="youtube-player-wrapper">
          <div ref={playerRef} className="youtube-player"></div>
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayer;

