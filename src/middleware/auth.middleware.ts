import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Asegúrate de que JWT_SECRET se carga correctamente desde tus variables de entorno
// Se recomienda usar un archivo .env y dotenv para gestionar esto
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretdefaultkey';

// Extender la interfaz Request de Express para añadir la propiedad 'user'
// Esto asegura que TypeScript conozca 'req.user'
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string; // El ID de tu usuario desde el token JWT
    email: string;
    role: string;
    id_terrace?: string | null; // Añadido para consistencia si lo incluyes en el payload del token
    restaurantId?: string | null; // Añadido para consistencia si lo incluyes en el payload del token
    // Agrega cualquier otra propiedad que almacenes en el payload del token
  };
}

/**
 * Middleware para verificar la validez de un token JWT.
 * Adjunta la información del usuario decodificada a `req.user`.
 */
// ✅ Aquí usamos AuthenticatedRequest en lugar de Request
export const isTokenValid = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // console.log('--- isTokenValid middleware ---'); // Quitado para simplificar
  // console.log('Authorization Header:', authHeader); // Quitado para simplificar

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // console.log('Error: Token no proporcionado o formato incorrecto.'); // Quitado para simplificar
    return res.status(401).json({ error: 'Falta o el encabezado de autorización es inválido.' }); // Mensaje unificado
  }

  const token = authHeader.split(' ')[1];
  // console.log('Extracted Token:', token); // Quitado para simplificar

  try {
    if (!process.env.JWT_SECRET) {
        console.error('Error: JWT_SECRET no está definido en las variables de entorno.');
        return res.status(500).json({ error: 'Error interno del servidor: clave secreta no configurada.' });
    }

    // Verifica y decodifica el token usando el secreto JWT
    // ✅ Casteamos el resultado de jwt.verify a AuthenticatedRequest['user']
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedRequest['user']; 
    
    // Adjunta la información decodificada del usuario al objeto request
    req.user = decoded; 
    // console.log('req.user después de decodificar en isTokenValid:', req.user); // Quitado para simplificar
    
    next(); // Continúa al siguiente middleware o controlador
  } catch (err: any) { // Tipado de error para acceder a propiedades como 'name'
    console.error('❌ Token inválido o expirado:', err);
    // Manejo de errores específico para JWT
    if (err instanceof jwt.JsonWebTokenError) { // jwt.JsonWebTokenError es la clase base para errores de JWT
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado. Por favor, inicie sesión de nuevo.' });
      }
      return res.status(401).json({ error: 'Token inválido. Acceso denegado.' });
    }
    return res.status(500).json({ error: 'Error del servidor al validar el token.' });
  }
};
