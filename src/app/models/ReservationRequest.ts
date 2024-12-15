export interface ReservationRequest {
  nomHotel: string;
  roomNumber: number;
  dateDebut: string;
  dateFin: string;
  name: string;
  prenom: string;
  phone: string;
  agencyName: string;
  cardNumber?: string; // Champs facultatifs (utilisation de ?)
  cardHolder?: string;
  cvv?: string;
  expiryDate?: string;
}
