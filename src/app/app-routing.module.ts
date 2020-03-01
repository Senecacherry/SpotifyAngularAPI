import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpotifySearchComponent } from './spotify-search/spotify-search.component';


const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' }
  , { path: 'search', component: SpotifySearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
