import User from '../user-model/user.model.js';
import Terrace from '../terrace-model/db/terrace-model-sequelize.js';
import Review from '../review-model/review.model.js';

User.belongsTo(Terrace, {
  foreignKey: 'terraceId',
  as: 'ownedTerrace', 
});


Terrace.hasMany(User, {
  foreignKey: 'restaurantId', 
  as: 'owners', 
});

Review.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(Terrace, { foreignKey: 'terraceId' });

User.hasMany(Review, { foreignKey: 'userId' });
Terrace.hasMany(Review, { foreignKey: 'terraceId' });