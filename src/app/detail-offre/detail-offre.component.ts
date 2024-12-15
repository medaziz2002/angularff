import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseDto } from '../models/ResponseDto';
import Swal from 'sweetalert2';

export interface ReservationRequest {
  nomHotel: string;
  roomNumber: number;
  dateDebut: string;
  dateFin: string;
  name: string;
  prenom: string;
  phone: string;
  agencyName: string;
}

@Component({
  selector: 'app-detail-offre',
  templateUrl: './detail-offre.component.html',
  styleUrls: ['./detail-offre.component.css']
})
export class DetailOffreComponent implements OnInit {

  nomHotel: string | null = null;
  numeroChambre: number | null = null;
  nomAgence: string | null = null;
  dateDebut: string | null = null;
  dateFin: string | null = null;
  chambreDetails: any = null; // Store room details
  isLoading: boolean = true; // To manage loading state
  showReservationForm: boolean = false; // Show/Hide reservation form
  showModal: boolean = false;
  // Data sent to the backend
  reservationData: ReservationRequest = {
    nomHotel: '',
    roomNumber: 0,
    dateDebut: '',
    dateFin: '',
    name: '',
    prenom: '',
    phone: '',
    agencyName: this.nomAgence || ''
  };

  // Local data for card information (not sent to the backend)
  cardInfo = {
    cardNumber: '',
    cardHolder: '',
    cvv: '',
    expiryDate: ''
  };

  constructor(private route: ActivatedRoute, private http: HttpClient,private router: Router) {}

  ngOnInit(): void {
    // Get URL parameters
    this.nomHotel = this.route.snapshot.paramMap.get('nomHotel');
    this.numeroChambre = Number(this.route.snapshot.paramMap.get('numeroChambre'));
    this.nomAgence = this.route.snapshot.paramMap.get('nomAgence');
    this.dateDebut = this.route.snapshot.paramMap.get('dateDebut');
    this.dateFin = this.route.snapshot.paramMap.get('dateFin');

    console.log('Parameters:', this.nomHotel, this.numeroChambre, this.nomAgence, this.dateDebut, this.dateFin);

    if (this.nomHotel && this.numeroChambre && this.nomAgence && this.dateDebut && this.dateFin) {
      this.fetchRoomDetails();
      // Pre-fill reservation data with URL parameters
      this.reservationData.nomHotel = this.nomHotel;
      this.reservationData.roomNumber = this.numeroChambre;
      this.reservationData.dateDebut = this.dateDebut;
      this.reservationData.dateFin = this.dateFin;
      this.reservationData.agencyName = this.nomAgence;
    } else {
      this.isLoading = false;
      console.error('Paramètres manquants dans l\'URL.');
    }
  }

  fetchRoomDetails(): void {
    const apiUrl = 'http://localhost:8081/api/v1/request/info';
  
    const params = {
      nomHotel: this.nomHotel || '',
      numeroChambre: this.numeroChambre?.toString() || '',
      dateDebut: this.dateDebut || '',
      dateFin: this.dateFin || '',
      agence:this.nomAgence|| '',
    };
  
    this.http.get<any>(apiUrl, { params }).subscribe(
      (data) => {
        console.log('Fetched room details:', data); // Log the response
        this.chambreDetails = data; // Assign API response to chambreDetails
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails de la chambre', error);
        this.isLoading = false;
      }
    );
  }
  

  openReservationForm(): void {
    this.showReservationForm = true;

  }

  closeReservationForm(): void {
    this.showReservationForm = false;
  
    // Rafraîchir la page
    window.location.reload();
  }
  





  validateCardInfo(): boolean {
    const { cardNumber, cardHolder, cvv, expiryDate } = this.cardInfo;

    // Card number must be 16 digits
    if (!/^\d{16}$/.test(cardNumber)) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le numéro de carte doit contenir 16 chiffres.',
      });
      return false;
    }

    // Cardholder name must not be empty
    if (!cardHolder || cardHolder.trim().length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le nom du titulaire de la carte est obligatoire.',
      });
      return false;
    }

    // CVV must be 3 digits
    if (!/^\d{3}$/.test(cvv)) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le CVV doit contenir 3 chiffres.',
      });
      return false;
    }

    // Expiry date must be in MM/YY format and valid
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'La date d\'expiration doit être au format MM/AA.',
      });
      return false;
    }

    const [month, year] = expiryDate.split('/');
    const expiryDateObj = new Date(Number(`20${year}`), Number(month) - 1);
    const currentDate = new Date();
    if (expiryDateObj < currentDate) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'La carte a expiré.',
      });
      return false;
    }

    return true; // All validations passed
  }

  submitReservation(): void {
    // Validate card information before proceeding
    if (!this.validateCardInfo()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation échouée',
        text: 'Veuillez entrer des informations de carte valides.',
      });
      return; // Stop the process if validation fails
    }
  

    const apiUrl = 'http://localhost:8081/api/v1/request/ajouter-reservation';
  
    console.log('Sending reservation data:', this.reservationData);
  
    // Use HttpClient to make the POST request
    this.http.post(apiUrl, this.reservationData, { responseType: 'blob' }).subscribe(
      (response) => {
        console.log('Réservation réussie. Téléchargement du PDF en cours...');
  
        // Create a link to download the PDF
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Reservation_${this.reservationData.roomNumber}.pdf`;
        link.click();
  
        Swal.fire({
          icon: 'success',
          title: 'Réservation réussie',
          text: 'Le PDF a été téléchargé avec succès.',
        });
  
        this.closeModal(); // Hide the form after success
    
      },
      (error) => {
        console.error('Erreur lors de la réservation :', error);
  
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la réservation. Veuillez réessayer.',
        });
      }
    );
  }
  

  closeModal(): void {
    this.showModal = false;

  }


  openModal(): void {
    this.showModal = true;

  }
  
  private downloadPDF(pdfUrl: string): void {
    this.http.get(pdfUrl, { responseType: 'blob' }).subscribe(
      (pdfResponse) => {
        console.log('Téléchargement du PDF en cours...');
        const blob = new Blob([pdfResponse], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Reservation_${this.reservationData.roomNumber}.pdf`;
        link.click();
      },
      (error) => {
        console.error('Erreur lors du téléchargement du PDF :', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur PDF',
          text: 'La réservation a réussi, mais le PDF n\'a pas pu être téléchargé.',
        });
      }
    );
  }
  


  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default-room.jpeg'; // Path to your fallback image
  }
  
}
