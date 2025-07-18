// models/appointmentModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const User = require("./userModel");

const Appointment = sequelize.define(
  "Appointment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        isNumeric: true,
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    doctor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      defaultValue: "pending",
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "Appointments",
    timestamps: true,
  }
);

Appointment.associate = (models) => {
  Appointment.belongsTo(models.User, {
    foreignKey: "created_by",
    as: "creator",
  });
  Appointment.hasMany(models.Response, {
    foreignKey: "appointment_id",
    as: "responses",
  });
};

module.exports = Appointment;
