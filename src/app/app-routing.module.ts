import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailOffreComponent } from './detail-offre/detail-offre.component';
import { ComparateurComponent } from './comparateur/comparateur.component';
import { HomePageComponent } from './home-page/home-page.component'; // Importation de la page d'accueil
import { LoginComponent } from './login/login.component';
import { HotelSearchAgenceComponent } from './hotel-search-agence/hotel-search-agence.component';

const routes: Routes = [
  // Route par défaut redirigeant vers la page d'accueil
  { path: '', redirectTo: 'search-hotel', pathMatch: 'full' },


  { path: 'login/:name/:id', component: LoginComponent },


  // Route pour comparateur
  { path: 'search-hotel', component: ComparateurComponent },
  {  path: 'search-hotel-agence/:name/:id', component: HotelSearchAgenceComponent },

  // Route pour le détail d'une offre
  {
    path: 'detail-offre/:nomHotel/:numeroChambre/:nomAgence/:dateDebut/:dateFin',
    component: DetailOffreComponent
  },

  // Route pour toute URL non reconnue
  { path: '**', redirectTo: 'search-hotel' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
