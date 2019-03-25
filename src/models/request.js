/* eslint-disable no-unused-expressions */

module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    status: {
      type: DataTypes.STRING,
      isIn: {
        args: [['pending', 'approved', 'rejected']],
        msg: 'Must be either pending, accepted or rejected',
      },
      defaultValue: 'pending',
    },
  });
  Request.associate = (models) => {
    Request.belongsTo(models.User);
    Request.belongsTo(models.Ride);
  };

  return Request;
};
