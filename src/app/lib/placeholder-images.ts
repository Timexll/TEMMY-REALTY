
import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Defensive check to ensure PlaceHolderImages is always an array
export const PlaceHolderImages: ImagePlaceholder[] = 
  (data && Array.isArray(data.placeholderImages)) ? data.placeholderImages : [];
