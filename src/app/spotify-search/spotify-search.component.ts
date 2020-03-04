import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery'


@Component({
  selector: 'app-spotify-search',
  templateUrl: './spotify-search.component.html',
  styleUrls: ['./spotify-search.component.scss']
})
export class SpotifySearchComponent implements OnInit {
  private BaseURL = "https://accounts.spotify.com/";
  private Endpoint = "authorize?client_id=7564ded58d2d41d98b580eec03b6c426&response_type=code&redirect_uri=https%3A%2F%2Flocalhost%3A44331%2FAccount%2FCallback&scope=user-read-private%20user-read-email&state=34fFs29kd09";
  private EndpointAT = "authorize?client_id=7564ded58d2d41d98b580eec03b6c426&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fsearch&scope=user-read-private%20user-read-email&response_type=token&state=123";

  private Code: String = null;
  private RefreshToken: String = null;

  public Results: any;

  private accessToken: String;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    var _self = this;
    this.route.fragment.subscribe((fragment: string) => {
      _self.accessToken = fragment;
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

  public Search() {
    var _self = this;
    if (_self.accessToken) {
      $.ajax({
        url: 'https://api.spotify.com/v1/search?q=electronic&type=track',
        method: 'GET',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + _self.accessToken.split("=")[1]);
        }
      }).done(function (data) {
        _self.Results = [];
        for (var i = 0; i < data.tracks.items.length; i++) {
          _self.Results.push({ title: data.tracks.items[i].album.name, cover: data.tracks.items[i].album.images[0].url, subtitle: data.tracks.items[i].artists[0].name });
        }
        // $("#searchResult").html(JSON.stringify(data));
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
          // $("#searchResult").html(JSON.stringify(data));
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
