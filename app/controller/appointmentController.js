const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
// Create Appointment
exports.createAppointment = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
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
      appointmentDate,
      appointmentTime,
    } = req.body;
    console.log(
      "Request Body:",
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
      appointmentDate,
      appointmentTime
    );

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
      date: appointmentDate,
      time: appointmentTime,
    });
    // console.log("Appointment created:", appointment);

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(400).json({
      success: false,
      error: error.message || "Failed to create appointment",
    });
  }
};
exports.getAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { doctor: { [Op.like]: `%${search}%` } },
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
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      appointments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get Single Appointment
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Appointment
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    await appointment.update(req.body);
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    await appointment.destroy();
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
