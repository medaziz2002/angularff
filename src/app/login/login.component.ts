import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  agencyId!: number;
  selectedAgency: string = '';
  credentialAlert: string = '';
  showModal: boolean = false; // Control for modal visibility


  name!: string;
  id!: number;

  destination!: string;
  dateArrivee!: string;
  dateDepart!: string;
  priceMin!: number;
  priceMax!: number;
  taille!: number;
  selectedRating!: number;
  agences!: string;



  newAccount = {
    name: '',
    firstName: '',
    phoneNumber: '',
    username: '',
    password: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Récupérer les paramètres de route
    this.route.params.subscribe(params => {
      if (params['id'] && params['name']) {
        this.agencyId = +params['id'];
        this.selectedAgency = params['name'];
      } else {
        console.error('Les paramètres "id" et "name" sont manquants dans la route.');
      }
    });
  
    // Récupérer les queryParams
    this.route.queryParams.subscribe(params => {
      if (params['destination']) {
        this.destination = params['destination'];
      } else {
        console.warn('Le paramètre "destination" est manquant dans les queryParams.');
      }
  
      if (params['dateArrivee']) {
        this.dateArrivee = params['dateArrivee'];
      } else {
        console.warn('Le paramètre "dateArrivee" est manquant dans les queryParams.');
      }
  
      if (params['dateDepart']) {
        this.dateDepart = params['dateDepart'];
      } else {
        console.warn('Le paramètre "dateDepart" est manquant dans les queryParams.');
      }
  
      if (params['prixMin']) {
        this.priceMin = +params['prixMin'];
      } else {
        console.warn('Le paramètre "prixMin" est manquant dans les queryParams.');
      }
  
      if (params['prixMax']) {
        this.priceMax = +params['prixMax'];
      } else {
        console.warn('Le paramètre "prixMax" est manquant dans les queryParams.');
      }
  
      if (params['taille']) {
        this.taille = +params['taille'];
      } else {
        console.warn('Le paramètre "taille" est manquant dans les queryParams.');
      }
  
      if (params['etoiles']) {
        this.selectedRating = +params['etoiles'];
      } else {
        console.warn('Le paramètre "etoiles" est manquant dans les queryParams.');
      }
    });
  }
  

  login(): void {
    if (this.username.trim() === '' || this.password.trim() === '') {
      Swal.fire({
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    // Définir les paramètres de la requête
    const params = {
      username: this.username,
      password: this.password,
      agence:this.selectedAgency,
      agenceId: this.agencyId.toString() // Convertir en chaîne
    };
  
    // Envoyer une requête GET avec les paramètres
    this.http.get<boolean>('http://localhost:8081/api/v1/request/authenticate-user', { params }).subscribe(
      (response) => {
        if (response) { // Si la réponse est true
          Swal.fire({
            title: 'Connexion réussie',
            text: `Bienvenue ${this.username} !`,
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate([
              `/search-hotel-agence/${this.selectedAgency}/${this.agencyId}`
            ], {
              queryParams: {
                destination: this.destination,
                dateArrivee: this.dateArrivee,
                dateDepart: this.dateDepart,
                prixMin: this.priceMin,
                prixMax: this.priceMax,
                taille: this.taille,
                etoiles: this.selectedRating
              }
            });
            
          });
        } else {
          // Si la réponse est false
          Swal.fire({
            title: 'Échec de connexion',
            text: 'Nom d\'utilisateur ou mot de passe incorrect.',
            icon: 'error',
            confirmButtonText: 'Réessayer'
          });
        }
      },
      (error) => {
        console.error('Erreur lors de la connexion :', error);
        Swal.fire({
          title: 'Échec de connexion',
          text: 'Nom d\'utilisateur ou mot de passe incorrect.',
          icon: 'error',
          confirmButtonText: 'Réessayer'
        });
      }
    );
  }
  

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.newAccount =  {
      name: '',
      firstName: '',
      phoneNumber: '',
      username: '',
      password: ''
    }; // Reset modal form
  }

  createAccount(): void {
    if (
      !this.newAccount.name.trim() ||
      !this.newAccount.firstName.trim() ||
      !this.newAccount.phoneNumber.trim() ||
      !this.newAccount.username.trim() ||
      !this.newAccount.password.trim()
    ) {
      Swal.fire({
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs pour créer un compte.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Préparez les données pour l'envoi
    const params = {
      username: this.newAccount.username,
      password: this.newAccount.password,
      name: this.newAccount.name,
      prenom: this.newAccount.firstName,
      phone: this.newAccount.phoneNumber,
      agence:this.selectedAgency,
      agenceId: this.agencyId.toString() // Convertir en string pour s'assurer qu'il est traité comme paramètre de requête
    };

    // Envoi de la requête HTTP POST avec les paramètres dans le corps de la requête
    this.http.post<boolean>('http://localhost:8081/api/v1/request/create-user', null, { params }).subscribe(
      (result: boolean) => {
        if (result) {
          Swal.fire({
            title: 'Compte créé',
            text: `Votre compte a été créé avec succès.\nNom : ${this.newAccount.name}`,
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.closeModal();

            // Redirection vers la page de connexion
            this.router.navigate(['/login', this.selectedAgency, this.agencyId]);

          });
        } else {
          Swal.fire({
            title: 'Erreur',
            text: 'Erreur lors de la création du compte. Veuillez réessayer.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      },
      (error) => {
        console.error('Erreur lors de la création du compte:', error);
        Swal.fire({
          title: 'Erreur serveur',
          text: 'Une erreur est survenue. Veuillez réessayer.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }
}
