// src/types/eventTypes.ts (o cualquier ruta que prefieras)
export interface EventData {
    id: string;
    title: string;
    imageUrl: string;
    description: string;
    date: string;
    soldTickets: number;
    organizerUsername: string;
    localizacion: string;
    categories: { name: string }[];  // Lista de categorías
  }
  