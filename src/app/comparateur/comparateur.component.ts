import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResponseDto } from '../models/ResponseDto';
import { ApiResponse } from '../models/ApiResponse';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
Chart.register(...registerables);

@Component({
  selector: 'app-comparateur',
  templateUrl: './comparateur.component.html',
  styleUrls: ['./comparateur.component.css']
})
export class ComparateurComponent implements OnInit {
  destination: string = 'France'; // Default destination
  dateArrivee: string = ''; // For the arrival date
  dateDepart: string = ''; // For the departure date
  taille: number = 0; // Default room size
  test:boolean=false;
  // Étoiles sélectionnées
  selectedRating: number = 0;

  // Prix Min et Max
  priceMin: number = 0;
  priceMax: number = 1000;

  // États pour les agences
  isAgenceBookingChecked: boolean = false;
  isAgenceNavigoChecked: boolean = false;
  isSearchDisabled: boolean = true;

  // Résultats des hôtels
  hotels: ResponseDto[] = [];
  hotelsForMap: ResponseDto[] = [];
  paginatedHotels: ResponseDto[] = [];
  hotelMeilleurPrix: string = '';
  hotelMeilleureNote: string = '';
  listeHotelsBooking: ResponseDto[] = [];
  sortedHotels: ResponseDto[] = []; // For sorted hotels

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number[] = [];

  constructor(private http: HttpClient,private router: Router) {}

  ngOnInit(): void {}

  // Met à jour la note sélectionnée
  setRating(stars: number): void {
    this.selectedRating = stars;
  }

  // Met à jour les prix affichés
  updatePriceLabel(type: string, value: number): void {
    if (type === 'min') {
      this.priceMin = value;
    } else if (type === 'max') {
      this.priceMax = value;
    }
  }

  logout(): void {
    Swal.fire({
      title: 'Déconnexion',
      text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Déconnecté',
          text: 'Vous avez été déconnecté avec succès.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Annulé',
          text: 'Vous êtes toujours connecté.',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      }
    });
  }
  



  goToReservations(): void {
  
  }

  // Pagination
  paginateHotels(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedHotels = this.hotels.slice(startIndex, endIndex);
  }

  calculateTotalPages(): void {
    const total = Math.ceil(this.hotels.length / this.itemsPerPage);
    this.totalPages = Array.from({ length: total }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.paginateHotels();
  }

  updateSearchState(): void {
    this.isSearchDisabled = !(this.isAgenceBookingChecked || this.isAgenceNavigoChecked);
  }

  fetchData(): void {
    this.test=true
    const agences: string[] = [];
    if (this.isAgenceBookingChecked) agences.push('Booking');
    if (this.isAgenceNavigoChecked) agences.push('Agence_Navigo');

    // Vérifiez si les dates sont valides
    if (!this.dateArrivee || !this.dateDepart) {
      alert('Veuillez sélectionner des dates d\'arrivée et de départ.');
      return;
    }

    const params = new HttpParams()
      .set('destination', this.destination)
      .set('dateArrivee', this.dateArrivee)
      .set('dateDepart', this.dateDepart)
      .set('prixMin', this.priceMin.toString())
      .set('prixMax', this.priceMax.toString())
      .set('taille', this.taille.toString())
      .set('etoiles', this.selectedRating.toString())
      .set('agences', agences.join(','));

    this.http.get<ApiResponse>('http://localhost:8081/api/v1/request/comparer', { params }).subscribe(
      (data) => {
        this.hotels = data.listeHotels;
        this.hotelsForMap = [...this.hotels];
        this.listeHotelsBooking = this.hotels.filter(hotel => hotel.nomAgence === 'Booking');
        this.hotelMeilleurPrix = data.hotelMeilleurPrix;
        this.hotelMeilleureNote = data.hotelMeilleureNote;

        // Pagination
        this.currentPage = 1;
        this.paginateHotels();
        this.calculateTotalPages();
        this.sortedHotels = this.groupAndSortHotelsByName();
        // Initialiser le graphique circulaire
     
      },
      (error) => {
        console.error('Erreur lors de l\'appel à l\'API', error);
      }
    );
  }




  groupAndSortHotelsByName(): ResponseDto[] {
    return this.hotels.sort((a, b) => a.nomHotel.localeCompare(b.nomHotel));
  }

  getColorForAgency(hotel: ResponseDto, groupedHotels: Map<string, ResponseDto[]>): string {
    const hotelsForName = groupedHotels.get(hotel.nomHotel);
    if (hotelsForName && hotelsForName.length > 0) {
      const minPriceHotel = hotelsForName.reduce<ResponseDto | null>(
        (min, h) => {
          if (
            h.chambres?.[0]?.prixFinalChambre !== undefined &&
            (min === null || h.chambres[0].prixFinalChambre < min.chambres?.[0]?.prixFinalChambre!)
          ) {
            return h;
          }
          return min;
        },
        null
      );

      return minPriceHotel === hotel ? 'green' : 'red';
    }
    return 'black'; // Default color
  }
  agencyList: { id: number; name: string }[] = [];
  
  getAgencyIdByName(nomAgence: string): number {
    this.loadAgencies();
    const agency = this.agencyList.find(agency => agency.name === nomAgence);
    return agency ? agency.id : 0; // Retourne 0 si aucune correspondance trouvée
  }

  // Naviguer vers la page de connexion en fonction du nom de l'agence
  getRouterLink(nomAgence: string): void {
    const agencyId = this.getAgencyIdByName(nomAgence);
    console.log("le nom de l'agence est "+nomAgence)
    if (agencyId) {
      // Construire les paramètres de recherche
      const queryParams = {
        destination: this.destination,
        dateArrivee: this.dateArrivee,
        dateDepart: this.dateDepart,
        prixMin: this.priceMin.toString(),
        prixMax: this.priceMax.toString(),
        taille: this.taille.toString(),
        etoiles: this.selectedRating.toString(),
      };
  
      // Naviguer vers la route avec les paramètres et queryParams
      this.router.navigate(['/login', nomAgence, agencyId], { queryParams });
    } else {
      console.error('Agence non trouvée :', nomAgence);
    }
  }
  
loadAgencies(): void {
  // Adding static agencies
  this.agencyList = [
    { id: 1, name: 'Booking' },
    { id: 2, name: 'Agence_Navigo' }
  ];
}



}
