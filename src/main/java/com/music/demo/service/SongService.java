package com.music.demo.service;

import com.music.demo.entity.Song;
import java.util.List;

public interface SongService {
    Song addSong(Song song);
    List<Song> listSongs();
    List<Song> searchSongs(String title, String artist, String genre);
}
