"use strict";

module.exports = function(sequelize, DataTypes) {
  var Subject = sequelize.define("Subject", {
    name: DataTypes.STRING(250),
    name_en: DataTypes.STRING(250),
    code: DataTypes.STRING(250),
    no_th_unit: DataTypes.INTEGER(8),
    no_th_hour: DataTypes.INTEGER(8),
    no_pr_unit: DataTypes.INTEGER(8),
    no_pr_hour: DataTypes.INTEGER(8),
    chapter_degree: DataTypes.FLOAT(),
    final_theor: DataTypes.FLOAT(),
    final_practical: DataTypes.FLOAT(),
    subject_type: DataTypes.INTEGER(1),
    system_type: DataTypes.INTEGER(1),
    has_practical :{type: DataTypes.INTEGER(1),defaultValue:1},
    status :{type: DataTypes.INTEGER(1),defaultValue:1}
  }, {
    classMethods: {
      associate: function(models) {
        Subject.belongsToMany(models.Subject, { 
          as: 'Prerequisites', 
          through: 'SubjectHasPrerequisites'
        });
        Subject.belongsTo(models.User, {
          onDelete: "restrict",
          foreignKey: {
            allowNull: false
          }
        });
        Subject.belongsTo(models.Department, {
          onDelete: "restrict",
          foreignKey: {
            allowNull: true
          }
        });
        Subject.belongsToMany(models.Department, { 
          as: 'DepartmentSubjects', 
          through: 'DepartmentSubjects'
        });

        Subject.belongsToMany(models.Division, {
          onDelete: "restrict",
          through: 'DivisionSubject'
        });
        
      }
    }
  });

  return Subject;
};
