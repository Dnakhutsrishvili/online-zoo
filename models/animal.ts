export type Pet = {
  id: string;
  name: string;
  commonName?: string;
  description?: string;
  image?: string;
};
 
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