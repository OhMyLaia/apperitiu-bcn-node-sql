
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize';
import { sequelize } from '../../config/sequelize-config.js';

export class Review extends Model<
  InferAttributes<Review>,
  InferCreationAttributes<Review>
> {
  declare id: CreationOptional<number>;
  declare rating: number;
  declare comment: string;
  declare userId: string; // 👈 correspon a id_user
  declare terraceId: string; // 👈 correspon a id_terrace
  declare userName?: string; // opcional, corresponent a la columna user_name
  declare createdAt: CreationOptional<Date>;
}

Review.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'id_user' // 👈 MAPEIG amb la columna real
    },
    userName: {
      type: DataTypes.STRING(100),
      allowNull: true, // opcional
      field: 'user_name' // 👈 MAPEIG amb la columna real
    },
    terraceId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'id_terrace' // 👈 MAPEIG amb la columna real
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at' // 👈 MAPEIG amb la columna real
    }
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: false // perquè Supabase gestiona created_at manualment
  }
);

export default Review;