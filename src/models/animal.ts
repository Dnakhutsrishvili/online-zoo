export type Pet = {
  id: string;
  name: string;
  commonName?: string;
  description?: string;
  image?: string;
};
export interface IconPosition {
  top: number;
  left: number;
}
export interface Feedback {
  name: string;
  city: string;
  month: string;
  year: string;
  text: string;
}

export type PetDetail = {
  id: string;
  name: string;
  commonName?: string;
  scientificName?: string;
  type?: string;
  diet?: string;
  habitat?: string;
  range?: string;
  description?: string;
  didYouKnow?: string;
  image?: string;
  images?: string[];
};
