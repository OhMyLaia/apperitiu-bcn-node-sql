// import { Request, Response } from 'express';
// import User from '../../models/user-model/user.model.js';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import {isTokenValid} from '../../middleware/auth.middleware.js'

// const JWT_SECRET_STRING = process.env.JWT_SECRET || 'supersecretdefaultkey';
// const JWT_SECRET = Buffer.from(JWT_SECRET_STRING, 'utf8');
// const JWT_EXPIRES_IN = '1d';

// export const loginUser = async (req: Request, res: Response) => {
//   try {
//     const { email, password_hash } = req.body;

    
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(400).json({ error: 'Invalid email' });
//     }

//     const isPasswordValid = await bcrypt.compare(password_hash, user.password_hash);
//     if (!isPasswordValid) {
//       return res.status(400).json({ error: 'Invalid password' });
//     }

    
//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role }, 
//       JWT_SECRET, 
//       { expiresIn: JWT_EXPIRES_IN } 
//     );

    
//     res.status(200).json({
//       message: 'Successfully signed in',
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });

//   } catch (error) {
//     console.error(`❌ Error logging in user:`, error);
//     return res.status(500).json({ error: 'Error signing in.' });
//   }
// };
    import { Request, Response } from 'express';
import User from '../../models/user-model/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'supersecretdefaultkey';
const JWT_SECRET = Buffer.from(JWT_SECRET_STRING, 'utf8');
const JWT_EXPIRES_IN = '1d';

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password_hash: plainPassword } = req.body; // ✅ Renombrar para claridad

    // Buscar el usuario por email
    const user = await User.findOne({ 
      where: { email },
      // ✅ FIX CLAVE: Asegúrate de NO EXCLUIR 'password_hash' aquí.
      // Excluye solo las columnas que no existen en tu DB y no necesitas en el objeto 'user' para el login.
      // Si 'id_terrace' y 'restaurantId' ya están en tu DB, puedes quitar el 'exclude' completamente.
      attributes: { exclude: ['id_terrace', 'restaurantId'] } // Excluye solo si NO existen en tu DB
      // Si todo existe en tu DB, puedes incluso no usar 'attributes' para seleccionar todo.
    });

    if (!user) {
      return res.status(400).json({ error: 'Email o contrasenya invàlids' });
    }

    // --- DEBUGGING (quitar en producción) ---
    //console.log('DEBUG: Contraseña en texto plano (desde req.body):', plainPassword);
    //console.log('DEBUG: Hash de contraseña (desde DB):', user.password_hash);
    // --- FIN DEBUGGING ---

    // Comparar la contraseña
    // ✅ Usar plainPassword del req.body y user.password_hash del usuario encontrado
    const isPasswordValid = await bcrypt.compare(plainPassword, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Email o contrasenya invàlids' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        // Si id_terrace o restaurantId son campos opcionales en tu modelo y pueden ser null,
        // o si los excluyes de la selección, manéjalos con un fallback.
        id_terrace: (user as any).id_terrace || null, 
        restaurantId: (user as any).restaurantId || null 
      }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN } 
    );

    // Enviar respuesta exitosa
    res.status(200).json({
      message: 'Inici de sessió amb èxit',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        id_terrace: (user as any).id_terrace || null, 
        restaurantId: (user as any).restaurantId || null
      },
    });

  } catch (error: unknown) {
    console.error(`❌ Error a l'iniciar sessió:`, error);
    return res.status(500).json({ error: "Error intern del servidor a l'iniciar sessió." });
  }
};
