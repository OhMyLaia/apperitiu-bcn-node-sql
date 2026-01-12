
// import { Model, DataTypes } from 'sequelize';
// import { sequelize } from '../../config/sequelize-config.js';

// class User extends Model {
//   public id!: string;
//   public email!: string;
//   public name!: string;
//   public birth_date!: string;
//   password_hash!: string;
//   public role!: string;
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// User.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//       allowNull: false
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate : {
//           isEmail : true
//       }
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     birth_date : {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     password_hash: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     role: {
//     type: DataTypes.ENUM('client', 'owner'), 
//     defaultValue: 'client',
//     //allowNull: false,
//   },
//   id_terrace: {
//     type: DataTypes.UUID, 
//     allowNull: true, 
//     unique: true, 
//     references: {
//       model: 'terraces',
//       key: 'id',
//     },
    
//     onDelete: 'SET NULL',
//     onUpdate: 'CASCADE',
//   }
//   },
//   {
//     sequelize,
//     modelName: 'User',
//     tableName: 'users',
//     timestamps: true
//   }
// );

// export default User;
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize-config.js';

class User extends Model {
  // ✅ Re-declarar propiedades para que TypeScript las reconozca,
  // sin causar el problema de "shadowing" de Sequelize.
  declare id: string;
  declare email: string;
  declare name: string;
  declare birth_date: string;
  declare password_hash: string;
  declare role: 'client' | 'owner'; // Tipado más estricto para el rol
  declare id_terrace: string | null; // Usar 'string | null' si allowNull es true
 

  // Las propiedades de tiempo como createdAt y updatedAt también deben declararse
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birth_date: {
      type: DataTypes.STRING, // Considera usar DataTypes.DATE o DataTypes.DATEONLY si es una fecha real
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('client', 'owner'),
      defaultValue: 'client',
      allowNull: false,
    },
    id_terrace: {
      type: DataTypes.UUID,
      allowNull: true,
      unique: true,
      references: {
        model: 'terraces',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
  }
);

export default User;
