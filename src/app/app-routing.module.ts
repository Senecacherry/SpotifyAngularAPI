import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { SpotifySearchComponent } from './spotify-search/spotify-search.component';
import { NgbdCarouselBasic } from './carousel/carousel.component';


// const routes: Routes = [
//   { path: '', redirectTo: '/search', pathMatch: 'full' }
//   , { path: 'search', component: SpotifySearchComponent }
// ];

const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' }
  , { path: 'search', component: NgbdCarouselBasic }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
