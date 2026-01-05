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
 * Modelo de Usuario
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  verificationStatus: VerificationStatus;
  avatar?: string;
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
  email: string;
  password: string;
  name: string;
  role: Role;
  phone?: string;
}

/**
 * Respuesta de autenticación del backend
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
