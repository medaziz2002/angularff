import { ChambreDto } from "./ChambreDto";

export interface ResponseDto {
  id?: number;                 // Identifiant unique de l'hôtel (optionnel)
  nomAgence: string;       // Nom de l'agence
  nomHotel: string;            // Nom de l'hôtel
  nbetoile: number;            // Nombre d'étoiles de l'hôtel
  pays: string;                // Pays où se situe l'hôtel
  ville: string;               // Ville où se situe l'hôtel
  rue: string;                 // Adresse (rue) de l'hôtel
  codePostal: number;          // Code postal de l'hôtel
  positionGps: [number, number]; // Position GPS [latitude, longitude]
  lieu_dit: string;            // Lieu-dit ou description de l'emplacement
  chambres: ChambreDto[];      // Liste des chambres disponibles
}
