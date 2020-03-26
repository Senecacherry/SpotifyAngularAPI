import { Component, OnInit, Input } from '@angular/core';
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
      _self.accessToken = fragment.split("&")[0].split("=")[1];
    });
    this.Auth();
    this.Results = [];
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

  public Search(options) {
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
          let item = data.tracks.items[i];
          if(options && options.keyMin !== 'undefined' && options.keyMax !== 'undefined'){

            var id = item.id;
            var context_uri = item.album.uri;

            _self.trackBreakdown(context_uri , id).done(function(features) {
              if(features.key < options.keyMin || features.key > options.keyMax) {
                return;
              }
              _self.Results.push({ title: item.album.name, cover: item.album.images[0].url, 
                subtitle: item.artists[0].name, uri: item.album.uri, track_number: item.track_number, track_features: features });
            });

          } else {

          _self.Results.push({ title: item.album.name, cover: item.album.images[0].url, 
            subtitle: item.artists[0].name, uri: item.album.uri, track_number: item.track_number, track_features: {} });
          }
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
          _self.Results = data;
        });
      });
    }
  }

  public hasResults() {
    return this.Results.length !== 0 && this.Results !== undefined;
  }

  public trackBreakdown(contextUri: string, id: string): any {
 return $.ajax({
      url: 'https://api.spotify.com/v1/audio-features/' + id,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.accessToken,
        'Accept': "application/json",
        'Content-Type': "application/json;charset=UTF-8"
      }
    });
  }
}
