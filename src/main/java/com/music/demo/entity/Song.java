package com.music.demo.entity;

import jakarta.persistence.*;

@Entity
public class Song {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String artist;
    private String genre;
    private Integer durationSeconds;
    private String youtubeVideoId;
    private String thumbnailUrl;

    public Song() {}
    public Song(String title, String artist, String genre, Integer durationSeconds){
        this.title = title; this.artist = artist; this.genre = genre; this.durationSeconds = durationSeconds;
    }
    public Song(String title, String artist, String genre, Integer durationSeconds, String youtubeVideoId, String thumbnailUrl){
        this.title = title; this.artist = artist; this.genre = genre; this.durationSeconds = durationSeconds;
        this.youtubeVideoId = youtubeVideoId; this.thumbnailUrl = thumbnailUrl;
    }

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getArtist() { return artist; }
    public void setArtist(String artist) { this.artist = artist; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }
    public String getYoutubeVideoId() { return youtubeVideoId; }
    public void setYoutubeVideoId(String youtubeVideoId) { this.youtubeVideoId = youtubeVideoId; }
    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
}
