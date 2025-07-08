const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const User = require("./userModel"); // Import User model

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
      validate: {
        isDate: true,
        isAfter: new Date().toISOString().split("T")[0], // Ensures date is not in the past
      },
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        isValidTime(value) {
          if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
            throw new Error("Time must be in HH:MM format");
          }
        },
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    dob: {
      type: DataTypes.DATE,
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

Appointment.belongsTo(User, { foreignKey: "created_by", as: "creator" });

module.exports = Appointment;
