/**
 * Estados válidos de un Tirito
 * - open: disponible para contactar
 * - in_progress: alguien lo está trabajando
 * - closed: finalizado
 */
export type TiritoStatus = 'open' | 'in_progress' | 'closed';

/**
 * Imagen adjunta al Tirito
 */
export interface TiritoImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
}

/**
 * Modelo principal de Tirito
 */
export interface Tirito {
  id: string;
  title: string;
  description: string;
  status: TiritoStatus;
  images: TiritoImage[];
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Datos para crear un nuevo Tirito
 * Máximo 5 imágenes, 5MB por imagen
 */
export interface CreateTiritoData {
  title: string;
  description: string;
  images?: File[];
  location?: string;
}

/**
 * Filtros para listar Tiritos
 */
export interface TiritoFilters {
  status?: TiritoStatus;
  search?: string;
  location?: string;
  page?: number;
  limit?: number;
}

/**
 * Respuesta paginada de Tiritos
 */
export interface TiritosResponse {
  data: Tirito[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
