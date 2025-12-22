export const dateBR = (date: string | Date | null) => {
  if (!date) return null;

  // Handle Date objects (use local getters to preserve selected day)
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

  // Handle ISO strings (2000-08-17T00:00:00.000Z)
  if (typeof date === 'string' && date.includes('T')) {
    // Extract just the date part to avoid timezone issues
    const datePart = date.split('T')[0];
    return datePart.split('-').reverse().join('/');
  }

  // Handle YYYY-MM-DD format
  if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return date.split('-').reverse().join('/');
  }

  return null;
};

export const toDate = (date?: string | null) => {
  if (!date) return null;

  try {
    // Handle ISO strings (2000-08-17T00:00:00.000Z)
    if (typeof date === 'string' && date.includes('T')) {
      const dateObj = new Date(date);
      return isNaN(dateObj.getTime()) ? null : dateObj;
    }

    // Handle YYYY-MM-DD format
    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const dateObj = new Date(`${date}T00:00:00`);
      return isNaN(dateObj.getTime()) ? null : dateObj;
    }

    // Handle other string formats
    const dateObj = new Date(date);
    return isNaN(dateObj.getTime()) ? null : dateObj;
  } catch (error) {
    console.warn('Invalid date value:', date, error);
    return null;
  }
};

export const birthdayBR = (date: string | Date | null) => {
  if (!date) return null;

  // Handle Date objects (use local getters to preserve selected day)
  if (date instanceof Date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}`;
  }

  // Handle ISO strings (2000-08-17T00:00:00.000Z)
  if (typeof date === 'string' && date.includes('T')) {
    // Extract just the date part to avoid timezone issues
    const datePart = date.split('T')[0];
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}`;
  }

  // Handle YYYY-MM-DD format
  if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}`;
  }

  return null;
};
