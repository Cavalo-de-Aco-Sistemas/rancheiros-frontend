/**
 * Extrai dados de um array ou objeto paginado de forma segura
 * @param data - Dados que podem ser array ou objeto paginado
 * @returns Array de dados
 */
export function extractData<T>(data: T[] | { data: T[] } | undefined): T[] {
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data;
  }

  if (typeof data === 'object' && 'data' in data) {
    return data.data || [];
  }

  return [];
}

/**
 * Verifica se os dados são paginados
 * @param data - Dados para verificar
 * @returns true se for objeto paginado
 */
export function isPaginated<T>(data: T[] | { data: T[] }): data is { data: T[] } {
  return !Array.isArray(data) && typeof data === 'object' && 'data' in data;
}
