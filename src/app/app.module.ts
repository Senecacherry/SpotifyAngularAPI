import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoverScrollerComponent } from './cover-scroller/cover-scroller.component';
import { SpotifySearchComponent } from './spotify-search/spotify-search.component';
import { GridListComponent } from './grid-list/grid-list.component';
import { MaterialModule } from './material-module';

@NgModule({
  declarations: [
    AppComponent,
    CoverScrollerComponent,
    SpotifySearchComponent,
    GridListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
