import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
declare let Spotify: any;
declare global {
  interface Window { onSpotifyWebPlaybackSDKReady: any; }
}
window.onSpotifyWebPlaybackSDKReady = window.onSpotifyWebPlaybackSDKReady || {};


@Component({
  selector: 'app-spotify-search',
  templateUrl: './spotify-search.component.html',
  styleUrls: ['./spotify-search.component.scss']
})
export class SpotifySearchComponent implements OnInit {
  private BaseURL = "https://accounts.spotify.com/";
  private Endpoint = "authorize?client_id=7564ded58d2d41d98b580eec03b6c426&response_type=code&redirect_uri=https%3A%2F%2Flocalhost%3A44331%2FAccount%2FCallback&scope=user-read-private%20user-read-email&state=34fFs29kd09";
  private EndpointAT = "authorize?client_id=7564ded58d2d41d98b580eec03b6c426&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fsearch&scope=user-read-private%20user-read-email%20user-modify-playback-state%20user-read-playback-state%20streaming&response_type=token&state=123";

  private Code: String = null;
  private RefreshToken: String = null;

  public Results: any;

  public DeviceID: String;

  public accessToken: String;

  constructor(private route: ActivatedRoute) {
    window.onSpotifyWebPlaybackSDKReady = () => {};
  }

  ngOnInit(): void {
    var _self = this;
    this.route.fragment.subscribe((fragment: string) => {
      _self.accessToken = fragment.split("=")[1];
    });
    this.Auth();
    this.Results = [{ title: "Here For Wobbles", subtitle: "wobble wobble", cover: "https://st3.depositphotos.com/5266903/18432/v/450/depositphotos_184324426-stock-illustration-music-notes-fountain-stream.jpg" }];
  }
  private getToken(): any {
    return $.ajax({
      url: "https://accounts.spotify.com/api/token",
      method: "POST",
      data: {
        client_id: "7564ded58d2d41d98b580eec03b6c426",
        client_secret: "4c58ba03c83b4cf68aad4f525db1f1f3",
        grant_type: "authorization_code",
        code: this.accessToken.split("=")[1],
        redirect_uri: "http://localhost:4200/search"
      }
    });
  }

  private getRefreshToken(): any {
    return $.ajax({
      url: "https://accounts.spotify.com/api/token",
      method: "POST",
      data: {
        client_id: "7564ded58d2d41d98b580eec03b6c426",
        client_secret: "4c58ba03c83b4cf68aad4f525db1f1f3",
        grant_type: "refresh_token",
        refresh_token: this.RefreshToken
      }
    });
  }

  public Auth() {
    if (!this.accessToken) {
      window.location.href = this.BaseURL + this.EndpointAT;
    }
  }

  public InitPlayer() {
    var _self = this;
      const token = _self.accessToken;
      const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); }
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error(message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      player.addListener('player_state_changed', state => { console.log(state); });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        _self.DeviceID = device_id;
        console.log('Ready with Device ID', device_id);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player!
      player.connect();
  }

  public Search() {
    var _self = this;
    if (_self.accessToken) {
      _self.InitPlayer();
      $.ajax({
        url: 'https://api.spotify.com/v1/search?q=electronic&type=track',
        method: 'GET',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + _self.accessToken);
        }
      }).done(function (data) {
        _self.Results = [];
        for (var i = 0; i < data.tracks.items.length; i++) {
          _self.Results.push({ title: data.tracks.items[i].album.name, cover: data.tracks.items[i].album.images[0].url, subtitle: data.tracks.items[i].artists[0].name, uri: data.tracks.items[i].album.uri });
        }
      });
    }
    else if (!_self.RefreshToken) {
      _self.getToken().done(function (token) {
        _self.RefreshToken = token.refresh_token;
        $.ajax({
          url: 'https://api.spotify.com/v1/search?q=electronic&type=track',
          method: 'GET',
          beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token.access_token);
          }
        }).done(function (data) {
        });
      });
    }
    else {
      _self.getRefreshToken().done(function (token) {
        if (token.refresh_token)
          _self.RefreshToken = token.refresh_token;
        $.ajax({
          url: 'https://api.spotify.com/v1/search?q=electronic&type=track',
          method: 'GET',
          beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token.access_token);
          }
        }).done(function (data) {
          $("#searchResult").html(JSON.stringify(data));
        });
      });
    }
  }
}
