import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize-config.js';

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  id_user: { //if breaks check later if it's id_user!!!
    type: DataTypes.UUID,
    allowNull: false,
  },
  id_terrace: { //if broken check later if it's id_terrace !!!
    type: DataTypes.UUID,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'favorites',
  timestamps: false,
});

export default Favorite;
