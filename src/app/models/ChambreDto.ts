export interface ChambreDto {
  id: number; // Numéro de la chambre
  nbLits: number;        // Nombre de lits dans la chambre
  prix: number;          // Prix de la chambre4
  prixFinalChambre: number; 
  datesDisponibles?: string[]; // Liste des dates disponibles (optionnel)
}
