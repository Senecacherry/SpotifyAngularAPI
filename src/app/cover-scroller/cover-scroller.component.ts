import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery'

@Component({
  selector: 'app-cover-scroller',
  templateUrl: './cover-scroller.component.html',
  styleUrls: ['./cover-scroller.component.scss']
})
export class CoverScrollerComponent implements OnInit {
  private _cover: String = "";
  private _title: String = "";
  private _subtitle: String = "";
  private _accessToken: String = "";
  private _contextUri: String = "";
  private _deviceID: String = "";

  @Input()
  set title(title: String) {
    this._title = title;
  }
  get title(): String { return this._title; }

  @Input()
  set subtitle(subtitle: String) {
    this._subtitle = subtitle;
  }
  get subtitle(): String { return this._subtitle; }
  constructor() { }

  @Input()
  set cover(cover: String) {
    this._cover = cover;
  }
  get cover(): String { return this._cover; }

  @Input()
  set accessToken(accessToken: String) {
    this._accessToken = accessToken;
  }
  get accessToken(): String { return this._accessToken; }

  @Input()
  set contextUri(contextUri: String) {
    this._contextUri = contextUri;
  }
  get contextUri(): String { return this._contextUri; }

  @Input()
  set deviceID(deviceID: String) {
    this._deviceID = deviceID;
  }
  get deviceID(): String { return this._deviceID; }

  ngOnInit(): void {
  }

  public playTrack(): any {
    var json = JSON.stringify({
      context_uri: this.contextUri,
      offset: {
        position: 0
      },
      position_ms: 0
    });
    $.ajax({
      url: "https://api.spotify.com/v1/me/player/play?device_id=" + this.deviceID,
      method: "PUT",
      headers: {
        'Authorization': 'Bearer ' + this.accessToken,
        'Accept': "application/json",
        'Content-Type': "application/json;charset=UTF-8"
      },
      data: json
    });
  }

  public pauseTrack(): any {
    var json = JSON.stringify({
      context_uri: this.contextUri,
      offset: {
        position: 0
      },
      position_ms: 0
    });
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/pause',
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + this.accessToken,
        'Accept': "application/json",
        'Content-Type': "application/json;charset=UTF-8"
      },
      data: json
    });
  }

  public nextTrack(): any {
    var json = JSON.stringify({
      context_uri: this.contextUri,
      offset: {
        position: 0
      },
      position_ms: 0
    });
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/next',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.accessToken,
        'Accept': "application/json",
        'Content-Type': "application/json;charset=UTF-8"
      },
      data: json
    });
  }

  public previousTrack(): any {
    var json = JSON.stringify({
      context_uri: this.contextUri,
      offset: {
        position: 0
      },
      position_ms: 0
    });
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/previous',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.accessToken,
        'Accept': "application/json",
        'Content-Type': "application/json;charset=UTF-8"
      },
      data: json
    });
  }
}
