module.exports = (sequelize, DataTypes) => {
  const Ride = sequelize.define('Ride', {
    start: {
      type: DataTypes.STRING,
    },
    destination: {
      type: DataTypes.STRING,
    },
    time: {
      type: DataTypes.DATE,
    },
    price: {
      type: DataTypes.INTEGER,
    },
  }, {});
  Ride.associate = (models) => {
    Ride.belongsTo(models.User);
    Ride.hasMany(models.Request, { onDelete: 'CASCADE' });
  };

  return Ride;
};
