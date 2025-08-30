export const dateBR = (date: string | null) => date?.split('-').reverse().join('/');

export const toDate = (date?: string | null) => (date ? new Date(`${date}T00:00:00`) : null);
