package com.music.demo.service.impl;

import com.music.demo.entity.Playlist;
import com.music.demo.entity.Song;
import com.music.demo.entity.User;
import com.music.demo.repository.PlaylistRepository;
import com.music.demo.repository.SongRepository;
import com.music.demo.service.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaylistServiceImpl implements PlaylistService {

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private SongRepository songRepository;

    @Override
    public Playlist createPlaylist(User user, String name) {
        Playlist playlist = new Playlist();
        playlist.setName(name);
        playlist.setOwner(user); // ✅ fixed
        return playlistRepository.save(playlist);
    }

    @Override
    public Playlist addSong(Long playlistId, Song song) {
        Playlist playlist = playlistRepository.findById(playlistId).orElseThrow();
        Song dbSong = songRepository.findById(song.getId()).orElseThrow();
        playlist.getSongs().add(dbSong);
        return playlistRepository.save(playlist);
    }

    @Override
    public Playlist removeSong(Long playlistId, Song song) {
        Playlist playlist = playlistRepository.findById(playlistId).orElseThrow();
        playlist.getSongs().removeIf(s -> s.getId().equals(song.getId()));
        return playlistRepository.save(playlist);
    }

    @Override
    public List<Playlist> getUserPlaylists(User user) {
        return playlistRepository.findByOwner(user); // ✅ fixed
    }
}
