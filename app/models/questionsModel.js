// models/question.js
const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Question = sequelize.define(
  "Question",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dropdown_options: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: ["Other"],
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "questions",
    timestamps: true,
  }
);

module.exports = Question;
