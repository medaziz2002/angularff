import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnChanges {
  @Input() hotels: any[] = []; // Les hôtels à afficher

  private map: L.Map | undefined;

  constructor() {
    // Correction pour les icônes Leaflet
    const iconDefault = L.icon({
      iconUrl: 'assets/images/icons8-marqueur-48.png',
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hotels'] && this.map) {
      this.addMarkers();
    }
  }

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([46.603354, 1.888334], 5); // Centrer sur la France

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private addMarkers(): void {
    if (!this.map || this.hotels.length === 0) {
      console.log('Carte non initialisée ou aucun hôtel disponible');
      return;
    }

    console.log('Hôtels reçus pour la carte:', this.hotels);

    // Supprimer les anciens marqueurs (si nécessaire)
    (this.map as any)._layers = {};

    // Ajouter les nouveaux marqueurs
    this.hotels.forEach(hotel => {
      let positionGps = hotel.positionGps;

      // Conversion de positionGps en tableau [latitude, longitude]
      if (typeof positionGps === 'string') {
        positionGps = positionGps.split(',').map(coord => parseFloat(coord.trim()));
      }

      const [latitude, longitude] = positionGps;

      if (latitude && longitude) {
        L.marker([latitude, longitude])
          .addTo(this.map!)
          .bindPopup(
            `<b>${hotel.nomHotel}</b><br>Étoiles: ${hotel.nbetoile}<br>Prix: ${hotel.chambres?.[0]?.prix || 'Non spécifié'} €`
          );
      } else {
        console.warn(`Coordonnées GPS invalides pour l'hôtel:`, hotel);
      }
    });
  }
}
