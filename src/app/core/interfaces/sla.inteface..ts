export interface ISla {
  id: number;
  firstResponseTime: number;
  staffAvailability: string ;
  ticketTypeParameterId: number;
  ticketTypeParameter: string ;
  ticketPriorityParameterId: number;
  ticketPriorityParameter: string;
  enterpriseId: number;
  enterprise: string;
}

export interface ISlaSend {
  firstResponseTime: number;
  staffAvailability: string ;
  ticketTypeParameterId: number;
  ticketPriorityParameterId: number;
  enterpriseId: number;
}