// models/responseModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Question = require("./questionsModel");
const User = require("./userModel");

const Response = sequelize.define(
  "Response",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dropdown_answer: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    text_answer: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Question,
        key: "id",
      },
    },
  },
  {
    tableName: "Responses",
    timestamps: true,
  }
);

Response.associate = (models) => {
  Response.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
  Response.belongsTo(models.Question, {
    foreignKey: "questionId",
    as: "question",
  });
  Response.belongsTo(models.Appointment, {
    foreignKey: "appointment_id",
    as: "appointment",
  });
};

module.exports = Response;
