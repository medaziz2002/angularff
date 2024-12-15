import { ResponseDto } from "./ResponseDto";

export interface ApiResponse {
  hotelMeilleurPrix: string;    // Nom de l'hôtel avec le meilleur prix
  hotelMeilleureNote: string;   // Nom de l'hôtel avec la meilleure note
  listeHotels: ResponseDto[];   // Liste des hôtels retournés
}
