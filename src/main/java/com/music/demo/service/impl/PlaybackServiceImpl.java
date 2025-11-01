package com.music.demo.service.impl;

import com.music.demo.entity.Playback;
import com.music.demo.entity.Song;
import com.music.demo.entity.User;
import com.music.demo.repository.PlaybackRepository;
import com.music.demo.service.PlaybackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlaybackServiceImpl implements PlaybackService {

    @Autowired
    private PlaybackRepository playbackRepository;

    @Override
    public Playback playSong(User user, Song song) {
        Playback playback = playbackRepository.findByUser(user).orElse(new Playback());
        playback.setUser(user);
        playback.setSong(song);
        playback.setStatus("PLAYING");
        return playbackRepository.save(playback);
    }

    @Override
    public Playback pauseSong(User user) {
        Playback playback = playbackRepository.findByUser(user).orElseThrow();
        playback.setStatus("PAUSED");
        return playbackRepository.save(playback);
    }

    @Override
    public Playback resumeSong(User user) {
        Playback playback = playbackRepository.findByUser(user).orElseThrow();
        playback.setStatus("PLAYING");
        return playbackRepository.save(playback);
    }

    @Override
    public Playback stopSong(User user) {
        Playback playback = playbackRepository.findByUser(user).orElseThrow();
        playback.setStatus("STOPPED");
        return playbackRepository.save(playback);
    }

    @Override
    public Playback getCurrentPlayback(User user) {
        return playbackRepository.findByUser(user).orElse(null);
    }
}
