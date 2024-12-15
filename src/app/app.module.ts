import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComparateurComponent } from './comparateur/comparateur.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { MapComponent } from './map/map.component';
import { DetailOffreComponent } from './detail-offre/detail-offre.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { HotelSearchAgenceComponent } from './hotel-search-agence/hotel-search-agence.component';

@NgModule({
  declarations: [
    AppComponent,
    ComparateurComponent,
    HotelListComponent,
    MapComponent,
    DetailOffreComponent,
    HomePageComponent,
    LoginComponent,
    HotelSearchAgenceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
