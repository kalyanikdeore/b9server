const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const { Op } = require("sequelize");

module.exports = {
  // Create new appointment
  async createAppointment(req, res) {
    try {
      const {
        firstName,
        lastName,
        city,
        contact,
        email,
        dob,
        gender,
        doctor,
        status,
        created_by,
        date,
        time,
      } = req.body;

      const appointment = await Appointment.create({
        firstName,
        lastName,
        city,
        contact,
        email,
        dob,
        gender,
        doctor,
        status,
        created_by,
        date,
        time,
      });

      res.status(201).json({
        success: true,
        message: "Appointment created successfully",
        data: appointment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message || "Failed to create appointment",
      });
    }
  },

  // Get all appointments with pagination
  async getAppointments(req, res) {
    try {
      const { page = 1, limit = 10, status, search } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (status) where.status = status;

      if (search) {
        where[Op.or] = [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { doctor: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const { count, rows: appointments } = await Appointment.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["id", "username", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.status(200).json({
        success: true,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
        appointments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Get single appointment by ID
  async getAppointmentById(req, res) {
    try {
      const appointment = await Appointment.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["id", "username", "email"],
          },
        ],
      });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      res.status(200).json({
        success: true,
        appointment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Update appointment
  async updateAppointment(req, res) {
    try {
      const appointment = await Appointment.findByPk(req.params.id);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      await appointment.update(req.body);

      res.status(200).json({
        success: true,
        message: "Appointment updated successfully",
        appointment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Delete appointment
  async deleteAppointment(req, res) {
    try {
      const appointment = await Appointment.findByPk(req.params.id);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      await appointment.destroy();

      res.status(200).json({
        success: true,
        message: "Appointment deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
};
