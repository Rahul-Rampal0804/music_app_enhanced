package com.music.demo.service;

import com.music.demo.entity.Playback;
import com.music.demo.entity.Song;
import com.music.demo.entity.User;

public interface PlaybackService {
    Playback playSong(User user, Song song);
    Playback pauseSong(User user);
    Playback resumeSong(User user);
    Playback stopSong(User user);
    Playback getCurrentPlayback(User user);
}
