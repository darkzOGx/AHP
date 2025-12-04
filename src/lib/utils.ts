import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export const convertZipToCoordinates = async (zipCode: string): Promise<Coordinates | null> => {
  try {
    // Using OpenStreetMap's free Nominatim API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(zipCode)}&country=us&format=json`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error converting zip code to coordinates:', error);
    return null;
  }
};
