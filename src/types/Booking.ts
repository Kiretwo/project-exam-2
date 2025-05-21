export interface Booking {
  id: string;
  venueId: string;
  userId: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  venue?: {
    id: string;
    name: string;
    media: { url: string; alt: string }[];
  };
}
