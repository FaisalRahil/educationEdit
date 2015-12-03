"use strict";

module.exports = function(sequelize, DataTypes) {
  var DivisionSubject = sequelize.define("DivisionSubject", {
    status :{type: DataTypes.INTEGER(1),defaultValue:1}
  }, {
    classMethods: {
      associate: function(models) {
        DivisionSubject.belongsTo(models.Subject, {
          onDelete: "restrict",
          foreignKey: {
            allowNull: false
          }
        });
        // DivisionSubject.hasMany(models.Division, {
        //   onDelete: "CASCADE",
        //   foreignKey: {
        //     allowNull: false
        //   }
        // });
      }
    }
  });

  return DivisionSubject;
};
