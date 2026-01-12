import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize-config.js';

class Promo extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public price!: number;
  public status!: boolean;
  public image!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Promo.init({

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    image: {
        type: DataTypes.NUMBER,
        allowNull: true
    },

},{
    sequelize,
    modelName: 'Promo',
    tableName: 'promos',
    timestamps: true
})

export default Promo