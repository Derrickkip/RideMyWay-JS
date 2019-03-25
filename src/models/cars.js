/* eslint-disable no-unused-expressions */
module.exports = (sequelize, DataTypes) => {
  const Car = sequelize.define('Car', {
    model: {
      type: DataTypes.STRING,
    },
    registration: {
      type: DataTypes.STRING,
    },
    seats: {
      type: DataTypes.INTEGER,
    },
  });
  Car.associate = (models) => {
    Car.belongsTo(models.User);
  };

  return Car;
};
