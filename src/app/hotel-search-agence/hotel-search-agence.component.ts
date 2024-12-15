import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResponseDto } from '../models/ResponseDto';
import { ApiResponse } from '../models/ApiResponse';
import { Chart, registerables } from 'chart.js';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
Chart.register(...registerables);

@Component({
  selector: 'app-hotel-search-agence',
  templateUrl: './hotel-search-agence.component.html',
  styleUrls: ['./hotel-search-agence.component.css']
})
export class HotelSearchAgenceComponent implements OnInit {
  destination: string = 'France'; // Default destination
  dateArrivee: string = ''; // For the arrival date
  dateDepart: string = ''; // For the departure date
  taille: number = 0; // Default room size
  test: boolean = false;
  agencyId!: number;
  selectedAgency: string = '';


  // Étoiles sélectionnées
  selectedRating: number = 0;

  // Prix Min et Max
  priceMin: number = 0;
  priceMax: number = 1000;

  // États pour les agences
  isAgenceBookingChecked: boolean = false;
  isAgenceNavigoChecked: boolean = true;
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

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Récupérer les paramètres de chemin (path params)
    this.route.params.subscribe(params => {
      this.selectedAgency = params['name'];
      this.agencyId = +params['id'];
    });
  
    // Récupérer les queryParams
    this.route.queryParams.subscribe(params => {
      this.destination = params['destination'] || 'France'; // Valeur par défaut
      this.dateArrivee = params['dateArrivee'] || '';
      this.dateDepart = params['dateDepart'] || '';
      this.priceMin = +params['prixMin'] || 0;
      this.priceMax = +params['prixMax'] || 1000;
      this.taille = +params['taille'] || 0;
      this.selectedRating = +params['etoiles'] || 0;
  
      console.log('Query params reçus :', params);
  
      // Appeler la recherche avec les paramètres
      this.fetchData();
    });
  }
  
  

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

  goToReservations(): void {}

  // Pagination


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
    const params = new HttpParams()
      .set('destination', this.destination)
      .set('dateArrivee', this.dateArrivee)
      .set('dateDepart', this.dateDepart)
      .set('prixMin', this.priceMin.toString())
      .set('prixMax', this.priceMax.toString())
      .set('taille', this.taille.toString())
      .set('etoiles', this.selectedRating.toString())
      .set('agences', this.selectedAgency);
  
    // Appel à l'API pour récupérer les hôtels
    this.http.get<ResponseDto[]>('http://localhost:8081/api/v1/request/rechercher_hotel_by_agence', { params }).subscribe(
      (data) => {
        // Vérifiez si les données sont valides avant de les assigner
        if (data && Array.isArray(data)) {
          this.test=true;
          this.hotels = data; // Remplir la liste des hôtels
          this.hotelsForMap = [...this.hotels];
          this.paginateHotels(); // Initialise les hôtels paginés
          this.calculateTotalPages(); // Calcule le nombre total de pages
        } else {
          console.error('Données reçues dans un format inattendu:', data);
        }
      },
      (error) => {
        console.error('Erreur lors de l\'appel à l\'API', error);
      }
    );
  }
  



  paginateHotels(): void {
    if (!this.hotels || this.hotels.length === 0) {
      this.paginatedHotels = [];
      return;
    }
  
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedHotels = this.hotels.slice(startIndex, endIndex);
  }
  
}
