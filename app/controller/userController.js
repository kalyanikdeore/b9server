const Appointment = require("../models/appointmentModel");
const Question = require("../models/questionsModel");
const Response = require("../models/responseModel");
const User = require("../models/userModel");
const { Op } = require("sequelize");

module.exports = {
  // Get user dashboard with appointments and responses
  async getUserDashboard(req, res) {
    try {
      const { userId } = req.params;
      const { appointmentId } = req.query;

      const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const whereCondition = { created_by: userId };
      if (appointmentId) whereCondition.id = appointmentId;

      const appointments = await Appointment.findAll({
        where: whereCondition,
        order: [
          ["date", "DESC"],
          ["time", "DESC"],
        ],
      });

      const appointmentIds = appointments.map((a) => a.id);
      const responses = await Response.findAll({
        where: { appointment_id: appointmentIds },
        include: [
          {
            model: Question,
            as: "question",
            attributes: ["id", "category", "question_text", "dropdown_options"],
          },
        ],
      });

      res.status(200).json({
        success: true,
        user,
        appointments,
        responses,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Get all users (admin only)
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (search) {
        where[Op.or] = [
          { username: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { role: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const { count, rows: users } = await User.findAndCountAll({
        where,
        attributes: { exclude: ["password"] },
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.status(200).json({
        success: true,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
        users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Get single user by ID
  async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Appointment,
            as: "appointments",
            attributes: ["id", "firstName", "lastName", "date", "status"],
          },
        ],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Update user profile
  async updateUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Prevent role changes unless superadmin
      if (req.body.role && req.user.role !== "superadmin") {
        return res.status(403).json({
          success: false,
          message: "Unauthorized to change roles",
        });
      }

      // Prevent password updates through this endpoint
      if (req.body.password) {
        return res.status(400).json({
          success: false,
          message: "Use password reset endpoint to change password",
        });
      }

      await user.update(req.body);

      const updatedUser = await User.findByPk(req.params.id, {
        attributes: { exclude: ["password"] },
      });

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Delete user (admin only)
  async deleteUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Prevent deleting superadmin unless superadmin
      if (user.role === "superadmin" && req.user.role !== "superadmin") {
        return res.status(403).json({
          success: false,
          message: "Unauthorized to delete superadmin",
        });
      }

      await user.destroy();

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
};
