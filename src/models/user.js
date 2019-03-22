
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
    },
    phonenumber: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  }, {});
  User.associate = (models) => {
    User.hasMany(models.Ride, { onDelete: 'CASCADE' });
    User.hasMany(models.Request, { onDelete: 'CASCADE' });
  };
  return User;
};
