// Input validation and sanitization utilities

export function sanitizeString(input: string): string {
  // Remove HTML tags and encode special characters
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>&"'/]/g, (char) => {
      const entities: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
      };
      return entities[char] || char;
    })
    .trim();
}

export function validateWeight(weight: string): { isValid: boolean; error?: string } {
  if (!weight || weight.trim() === '') {
    return { isValid: false, error: 'Weight is required' };
  }

  const weightValue = parseFloat(weight);
  
  if (isNaN(weightValue)) {
    return { isValid: false, error: 'Weight must be a valid number' };
  }

  if (weightValue <= 0) {
    return { isValid: false, error: 'Weight must be greater than 0' };
  }

  if (weightValue > 999.99) {
    return { isValid: false, error: 'Weight cannot exceed 999.99' };
  }

  // Check for reasonable decimal places (max 2)
  if (!/^\d*\.?\d{0,2}$/.test(weight)) {
    return { isValid: false, error: 'Weight can have at most 2 decimal places' };
  }

  return { isValid: true };
}

export function validateWireTypeName(name: string): { isValid: boolean; error?: string } {
  const sanitized = sanitizeString(name);
  
  if (!sanitized || sanitized.length === 0) {
    return { isValid: false, error: 'Wire type name is required' };
  }

  if (sanitized.length > 100) {
    return { isValid: false, error: 'Wire type name cannot exceed 100 characters' };
  }

  // Only allow alphanumeric, spaces, hyphens, slashes, and parentheses
  if (!/^[a-zA-Z0-9\s\-/()]+$/.test(sanitized)) {
    return { isValid: false, error: 'Wire type name contains invalid characters' };
  }

  return { isValid: true };
}

export function validateWireTypeRatio(ratio: string): { isValid: boolean; error?: string } {
  if (!ratio || ratio.trim() === '') {
    return { isValid: false, error: 'Weight ratio is required' };
  }

  const ratioValue = parseFloat(ratio);
  
  if (isNaN(ratioValue)) {
    return { isValid: false, error: 'Ratio must be a valid number' };
  }

  if (ratioValue <= 0) {
    return { isValid: false, error: 'Ratio must be greater than 0' };
  }

  if (ratioValue > 1000) {
    return { isValid: false, error: 'Ratio cannot exceed 1000 lbs/250ft' };
  }

  return { isValid: true };
}

export function validateSpoolLength(length: string): { isValid: boolean; error?: string } {
  if (!length || length.trim() === '') {
    return { isValid: false, error: 'Spool length is required' };
  }

  const lengthValue = parseFloat(length);
  
  if (isNaN(lengthValue)) {
    return { isValid: false, error: 'Spool length must be a valid number' };
  }

  if (lengthValue <= 0) {
    return { isValid: false, error: 'Spool length must be greater than 0' };
  }

  if (lengthValue > 10000) {
    return { isValid: false, error: 'Spool length cannot exceed 10,000 ft' };
  }

  return { isValid: true };
}

export function validateSpoolWeight(weight: string): { isValid: boolean; error?: string } {
  if (!weight || weight.trim() === '') {
    return { isValid: false, error: 'Spool weight is required' };
  }

  const weightValue = parseFloat(weight);
  
  if (isNaN(weightValue)) {
    return { isValid: false, error: 'Spool weight must be a valid number' };
  }

  if (weightValue < 0) {
    return { isValid: false, error: 'Spool weight cannot be negative' };
  }

  if (weightValue > 100) {
    return { isValid: false, error: 'Spool weight cannot exceed 100 lbs' };
  }

  return { isValid: true };
}

export function validateTotalWeight(weight: string): { isValid: boolean; error?: string } {
  if (!weight || weight.trim() === '') {
    return { isValid: false, error: 'Total weight is required' };
  }

  const weightValue = parseFloat(weight);
  
  if (isNaN(weightValue)) {
    return { isValid: false, error: 'Total weight must be a valid number' };
  }

  if (weightValue <= 0) {
    return { isValid: false, error: 'Total weight must be greater than 0' };
  }

  if (weightValue > 9999) {
    return { isValid: false, error: 'Total weight cannot exceed 9,999 lbs' };
  }

  return { isValid: true };
}