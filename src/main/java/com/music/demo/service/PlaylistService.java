package com.music.demo.service;

import com.music.demo.entity.Playlist;
import com.music.demo.entity.User;
import com.music.demo.entity.Song;
import java.util.List;

public interface PlaylistService {
    Playlist createPlaylist(User user, String name);
    Playlist addSong(Long playlistId, Song song);
    Playlist removeSong(Long playlistId, Song song);
    List<Playlist> getUserPlaylists(User user);
}
