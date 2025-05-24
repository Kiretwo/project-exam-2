export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidImageUrl = (url: string): boolean => {
  if (!isValidUrl(url)) return false;
  
  // Check if URL ends with common image extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const urlLower = url.toLowerCase();
  
  return imageExtensions.some(ext => 
    urlLower.includes(ext) || 
    urlLower.includes('image') || 
    urlLower.includes('photo') ||
    urlLower.includes('picture')
  );
};

export const validateVenueForm = (data: {
  name: string;
  description: string;
  price: number;
  maxGuests: number;
}) => {
  const errors: string[] = [];

  if (!data.name.trim()) {
    errors.push("Venue name is required");
  }

  if (!data.description.trim()) {
    errors.push("Venue description is required");
  }

  if (data.price <= 0) {
    errors.push("Price must be greater than 0");
  }

  if (data.maxGuests <= 0 || data.maxGuests > 50) {
    errors.push("Max guests must be between 1 and 50");
  }

  return errors;
};
