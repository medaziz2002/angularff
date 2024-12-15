import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  agencyList: { id: number; name: string }[] = [];
  selectedAgencyId: number | null = null; // Ensure this is initialized correctly

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadAgencies();
  }

  loadAgencies(): void {
    // Adding static agencies
    this.agencyList = [
      { id: 1, name: 'Booking' },
      { id: 2, name: 'Agence Havas Voyages' }
    ];
  }
  goToLogin(): void {
    if (this.selectedAgencyId === null) {
      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez sélectionner une agence.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      console.log('Aucune agence sélectionnée.');
    } else {
      console.log(`Selected Agency ID: ${this.selectedAgencyId}`);
  
      // Find the selected agency by ID
      const selectedAgency = this.agencyList.find(agency => agency.id === this.selectedAgencyId);
  
      if (selectedAgency) {
        console.log(`Selected Agency Name: ${selectedAgency.name}`);
        console.log('Navigation is about to happen with the following parameters:');
        console.log(`ID: ${this.selectedAgencyId}, Name: ${selectedAgency.name}`);
  
        // Confirm navigation using SweetAlert
        Swal.fire({
          title: 'Confirmer',
          text: `Vous allez vous connecter à l'agence : ${selectedAgency.name}. Continuer ?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Oui',
          cancelButtonText: 'Non'
        }).then((result) => {
          if (result.isConfirmed) {
            // Navigate to the login page with parameters
            this.router.navigate(['/login', selectedAgency.name, this.selectedAgencyId]);
          } else {
            Swal.fire({
              title: 'Annulé',
              text: 'Vous avez annulé la navigation.',
              icon: 'info',
              confirmButtonText: 'OK'
            });
          }
        });
      } else {
        Swal.fire({
          title: 'Erreur',
          text: 'Agence sélectionnée non trouvée.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.log('Selected agency not found in the agencyList.');
      }
    }
  }
  
  
}
