/**
 * Roles disponibles en Tirito App
 * - user: persona que necesita resolver algo puntual
 * - worker: persona que ofrece servicios
 * - business: negocio / pyme / profesional
 */
export type Role = 'user' | 'worker' | 'business';

/**
 * Estado de verificación del usuario
 */
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

/**
 * Tipo de documento de identidad
 */
export type DocumentType = 'V' | 'E';

/**
 * Modelo de Usuario
 */
export interface User {
  id: string;
  email: string;
  /** Nombre completo (generado) */
  name: string;
  /** Nombres */
  firstName?: string;
  /** Apellidos */
  lastName?: string;
  /** Alias público del usuario (para privacidad) */
  username?: string;
  /** Tipo de documento (V o E) */
  documentType?: DocumentType;
  /** Número de cédula */
  documentNumber?: string;
  /** Fecha de nacimiento */
  birthDate?: string;
  /** Estado de Venezuela */
  estado?: string;
  /** Municipio */
  municipio?: string;
  /** Dirección completa */
  direccion?: string;
  /** Teléfono celular */
  phoneMobile?: string;
  /** Teléfono local (opcional) */
  phoneLocal?: string;
  role: Role;
  verificationStatus: VerificationStatus;
  avatar?: string;
  /** Biografía / Acerca de */
  bio?: string | null;
  /** Campo legacy */
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Datos para login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Datos para registro
 */
export interface RegisterData {
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentNumber: string;
  birthDate: string;
  estado: string;
  municipio: string;
  direccion: string;
  phoneMobile: string;
  phoneLocal?: string;
  bio?: string;
  email: string;
  password: string;
  role: Role;
}

/**
 * Respuesta de autenticación del backend
 */
export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}
