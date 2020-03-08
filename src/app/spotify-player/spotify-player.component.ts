import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-spotify-player',
  templateUrl: './spotify-player.component.html',
  styleUrls: ['./spotify-player.component.scss']
})
export class SpotifyPlayerComponent implements OnInit {
  private _accessToken: String = "";

  @Input()
  set accessToken(accessToken: String) {
    this._accessToken = accessToken;
  }

  get accessToken(): String { return this._accessToken; }
  constructor() { }

  ngOnInit(): void {
  }
}
