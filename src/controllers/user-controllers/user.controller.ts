import { Request, Response } from "express";
import User from "../../models/user-model/user.model.js";
import { userSchema } from "../../models/user-model/zod/user.schema.js";
import bcrypt from "bcrypt";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import Terrace from "../../models/terrace-model/db/terrace-model-sequelize.js";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error: unknown) {
    console.error(`❌ Error fetching users:`, error);

    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      error.name === "ZodError"
    ) {
      return res
        .status(400)
        .json({
          error: "❌ Error de validació a l'obtenir usuaris",
          details: (error as any).errors,
        });
    }

    return res.status(500).json({ error: "Error a l'obtenir usuaris" });
  }
};

export const getUserByEmailOrId = async (req: Request, res: Response) => {
  const identifier = req.params.id;

  const uuidV4Regex =
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

  try {
    let user;

    if (uuidV4Regex.test(identifier)) {
      user = await User.findByPk(identifier, {
        attributes: { exclude: ["password_hash"] },
      });
    } else {
      user = await User.findOne({
        where: { email: identifier },
        attributes: { exclude: ["password_hash"] },
      });
    }
    if (!user) {
      return res.status(404).json({ error: "Usuari no trobat" });
    }
    res.status(200).json(user);
  } catch (error: unknown) {
    console.error(`❌ Error a l'obtenir usuari ${identifier}:`, error);

    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      error.name === "ZodError"
    ) {
      return res
        .status(400)
        .json({
          error: "❌ Error de validació a l'obtenir usuari",
          details: (error as any).errors,
        });
    }

    return res.status(500).json({ error: "Error a l'obtenir usuari" });
  }
};

export const getLoggedInUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    console.log("--- getLoggedInUserProfile ---");

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({
          message: "No autoritzat: Informació d'usuario no disponible.",
        });
    }

    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password_hash"] },
    });

    if (!user) {
      console.log(
        "Debug: Perfil de usuari no trobat a la base de dades per ID:",
        userId
      );
      return res.status(404).json({ message: "Perfil de usuari no trobat." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error a l'obtenir perfil del usuario logueado:", error);
    res
      .status(500)
      .json({ message: "Error del servidor a l'obtenir el perfil." });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = userSchema.parse(req.body);
    const { name, email, password_hash, birth_date, role } = userData;

    const hashedPassword = await bcrypt.hash(password_hash, 10);

    const newUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      birth_date,
      role: role || "client",
    });

    res.status(201).json(newUser);
  } catch (error: unknown) {
    console.error("❌ Error al crear usuari:", error);

    if (typeof error === "object" && error !== null && "name" in error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ error: "Aquest email ja existeix." });
      }
      if (error.name === "ZodError") {
        return res
          .status(400)
          .json({
            error: "Dades d'usuari invàlides",
            details: (error as any).errors,
          });
      }
    }
    return res
      .status(500)
      .json({ error: "Error intern del servidor al crear usuari." });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const authenticatedUserId = req.user?.id;
  const userIdToUpdate = req.params.id;
  const { name, currentPassword, newPassword } = req.body;

  try {
    if (!authenticatedUserId || authenticatedUserId !== userIdToUpdate) {
      return res
        .status(403)
        .json({ error: "No tens permisos per modificar aquest perfil." });
    }

    const user = await User.findByPk(userIdToUpdate);
    if (!user) {
      return res.status(404).json({ error: "Usuari no trobat." });
    }

    if (!currentPassword) {
      return res
        .status(400)
        .json({
          error:
            "Has d'introduir la contrasenya actual per actualitzar el perfil.",
        });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "La contrasenya actual és incorrecta." });
    }

    if (name) {
      user.name = name;
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        return res
          .status(400)
          .json({
            error:
              "La nueva contrasenya ha de contenir com a mínim 8 caràcters.",
          });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password_hash = hashedPassword;
    }

    await user.save();

    res.status(200).json({
      message: "Perfil actualitzat correctament.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birth_date: user.birth_date,
        role: user.role,
        id_terrace: user.id_terrace,
      },
    });
  } catch (error) {
    console.error("❌ Error actualitzant perfil:", error);
    res
      .status(500)
      .json({ error: "Error intern del servidor a l'actualitzar el perfil." });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  const authenticatedUserId = req.user?.id;
  const userIdToDelete = req.params.id;
  const { password_hash } = req.body;

  try {
    if (!authenticatedUserId || authenticatedUserId !== userIdToDelete) {
      return res
        .status(403)
        .json({ error: "No tens permisos per eliminar aquest compte." });
    }

    const user = await User.findByPk(userIdToDelete);
    if (!user) {
      return res.status(404).json({ error: "Usuari no trobat." });
    }

    if (!password_hash) {
      return res
        .status(400)
        .json({
          error: "Es requereix la contrasenya per confirmar l'eliminació.",
        });
    }

    const isPasswordValid = await bcrypt.compare(
      password_hash,
      user.password_hash
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Contrasenya invàlida." });
    }

    // 🧼 Si el usuario es owner y tiene una terraza reclamada, libérala
    if (user.role === "owner" && user.id_terrace) {
      const terrace = await Terrace.findByPk(user.id_terrace);
      if (terrace) {
        terrace.is_claimed = false;
        await terrace.save();
      }
    }

    await user.destroy();

    return res.status(200).json({ message: "Perfil eliminat exitosament" });
  } catch (error: unknown) {
    console.error(`❌ Error eliminant usuari ${userIdToDelete}:`, error);

    if (typeof error === "object" && error !== null && "name" in error) {
      if ((error as any).name === "SequelizeForeignKeyConstraintError") {
        return res
          .status(400)
          .json({
            error:
              "No s'ha pogut eliminar aquest usuari. Hi hi associacions actives.",
            details: (error as any).message,
          });
      }
    }
    return res
      .status(500)
      .json({ error: "Error intern del servidor a l'eliminar l'usuari." });
  }
};

export const claimTerraceOwnership = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { terraceId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuari no trobat." });
    }

    // ✅ CAMBIO CLAVE: Usar { raw: true } para obtener un objeto plano
    const rawTerrace = await Terrace.findByPk(terraceId, { raw: true });

    // ✅ Ahora 'rawTerrace' es un objeto plano, no una instancia de modelo.
    // Esto significa que las propiedades serán accesibles directamente, sin las interferencias del 'public'.
    if (!rawTerrace) {
      return res
        .status(404)
        .json({ message: "La terrassa especificada no existeix." });
    }
    // Convertir rawTerrace a un tipo conocido o usar aserciones si es necesario
    const terrace = rawTerrace as {
      id: string;
      business_name: string;
      is_claimed: boolean;
    };

    console.log(`[CLAIM] OBJETO TERRACE COMPLETO (RAW):`, terrace); // Imprime el objeto plano
    console.log(
      `[CLAIM] ¿Es terrace una instancia del modelo Terrace?:`,
      terrace instanceof Terrace
    ); // Esto debería ser FALSE ahora

    console.log(
      `[CLAIM] Terrassa encontrada: ${terrace.business_name}, is_claimed: ${terrace.is_claimed}`
    );

    const existingOwner = await User.findOne({
      where: {
        id_terrace: terrace.id, // ✅ Usar terrace.id del objeto plano
        role: "owner",
      },
    });

    if (existingOwner) {
      if (existingOwner.id === userId) {
        console.log(
          `[CLAIM] Usuario ${userId} ya es propietario de esta terrassa.`
        );
        return res
          .status(200)
          .json({ message: "Ja ets el propietari d'aquesta terrassa." });
      }
      console.log(
        `[CLAIM] Terrassa ${terrace.id} ya reclamada por otro usuario: ${existingOwner.id}.`
      ); // ✅ Usar terrace.id
      return res
        .status(409)
        .json({
          message: "Aquesta terrassa ja s'ha reclamat per un altre usuari.",
        });
    }

    if (user.role === "owner" && user.id_terrace !== null) {
      console.log(
        `[CLAIM] Usuario ${userId} ya es propietario de otra terrassa: ${user.id_terrace}.`
      );
      return res
        .status(409)
        .json({
          message:
            "Ja ets propitari d'una terrassa. Cada usuari només pot reclamar una terrassa.",
        });
    }

    console.log(`[CLAIM] Antes de actualizar usuario ${user.id}:`);
    console.log(`[CLAIM]   id_terrace actual: ${user.id_terrace}`);
    console.log(`[CLAIM]   role actual: ${user.role}`);
    console.log(`[CLAIM]   Intentando asignar id_terrace: ${terrace.id}`); // ✅ Usar terrace.id
    console.log(`[CLAIM]   Tipo de terrace.id: ${typeof terrace.id}`);

    const updatedUser = await user.update({
      role: "owner",
      id_terrace: terrace.id, // ✅ Usar terrace.id del objeto plano
    });

    console.log(`[CLAIM] Después de actualizar usuario ${user.id}:`);
    console.log(
      `[CLAIM]   id_terrace nuevo (desde objeto user): ${updatedUser.id_terrace}`
    );
    console.log(
      `[CLAIM]   role nuevo (desde objeto user): ${updatedUser.role}`
    );

    // Si terrace.is_claimed es null/undefined en el objeto plano, asegúrate de que no cause un error.
    // Solo actualiza si la propiedad existe y no es ya true.
    if (
      terrace.is_claimed === false ||
      terrace.is_claimed === undefined ||
      terrace.is_claimed === null
    ) {
      await Terrace.update(
        { is_claimed: true },
        { where: { id: terrace.id } } // ✅ Aquí actualizamos por el ID de la terraza
      );
      console.log(`[CLAIM] Terrassa ${terrace.id} marcada como reclamada.`);
    } else {
      console.log(
        `[CLAIM] Terrassa ${terrace.id} ya estaba marcada como reclamada, no se hizo update.`
      );
    }

    res.status(200).json({
      message: "Enhorabona! Ara ets el propietari d'aquesta terrassa",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        id_terrace: updatedUser.id_terrace as string | null,
      },
    });
  } catch (error: unknown) {
    console.error("Error al reclamar la propietat de la terrassa:", error);
    if (typeof error === "object" && error !== null && "name" in error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        console.error(
          "❌ Error de FK:",
          (error as any).fields,
          (error as any).value
        );
      } else if (error.name === "SequelizeUniqueConstraintError") {
        console.error(
          "❌ Error de restricció única:",
          (error as any).fields,
          (error as any).value
        );
      }
    }
    res
      .status(500)
      .json({
        message:
          "Error intern del servidor al reclamar la propietat de la terrassa.",
      });
  }
};

export const unclaimTerraceOwnership = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.params.userId;
  const { password } = req.body;

  try {
    // Verificar autenticación
    if (!req.user || req.user.id !== userId) {
      return res
        .status(403)
        .json({ error: "No tens permisos per fer aquesta acció." });
    }

    // Obtener el usuario
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuari no trobat." });
    }

    // Verificar que sea owner
    if (user.role !== "owner" || !user.id_terrace) {
      return res
        .status(400)
        .json({ error: "Aquest usuari no és propietari de cap terrassa." });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Contrasenya incorrecta." });
    }

    // Liberar la terraza
    const terrace = await Terrace.findByPk(user.id_terrace);
    if (terrace) {
      terrace.is_claimed = false;
      await terrace.save();
    }

    // Actualizar el usuario
    user.role = "client";
    user.id_terrace = null;
    await user.save();

    res.status(200).json({
      message: "Has deixat de ser propietari/ària de la terrassa.",
      updatedUser: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        id_terrace: user.id_terrace,
      },
    });
  } catch (error) {
    console.error("❌ Error a l'unclaim:", error);
    res
      .status(500)
      .json({ error: "Error intern del servidor a l'unclaim de la terrassa." });
  }
};
