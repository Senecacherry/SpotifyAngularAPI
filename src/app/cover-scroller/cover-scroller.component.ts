import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-cover-scroller',
  templateUrl: './cover-scroller.component.html',
  styleUrls: ['./cover-scroller.component.scss']
})

export class CoverScrollerComponent implements OnInit {
  private _cover: String = "";
  private _title: String = "";
  private _subtitle: String = "";
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

  ngOnInit(): void {
  }

}
