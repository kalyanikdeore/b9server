// models/response.js
const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const User = require("./userModel");
const Question = require("./questionsModel");

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
      allowNull: true, // Optional if you want to link to appointments
    },
  },
  {
    tableName: "responses",
    timestamps: true,
  }
);

// Associations
Response.belongsTo(User, {
  foreignKey: "userId", // Matches your User model primary key
  as: "user",
});

Response.belongsTo(Question, {
  foreignKey: "questionId",
  as: "question",
});

module.exports = Response;
