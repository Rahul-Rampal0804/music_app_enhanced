package com.music.demo.entity;

import jakarta.persistence.*;

@Entity
public class Playback {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private User user;

    @ManyToOne
    private Song song;

    private String status; // PLAYING, PAUSED, STOPPED
    private Integer positionSeconds = 0;

    public Playback() {}
    public Playback(User user, Song song, String status){ this.user = user; this.song = song; this.status = status; }

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Song getSong() { return song; }
    public void setSong(Song song) { this.song = song; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getPositionSeconds() { return positionSeconds; }
    public void setPositionSeconds(Integer positionSeconds) { this.positionSeconds = positionSeconds; }
}
