// controller/clientController.js
const Client = require("../models/clientModel");
const Appointment = require("../models/appointmentModel");

exports.createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows: clients } = await Client.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Appointment,
          as: "appointments",
          attributes: [
            "id",
            "appointmentDate",
            "appointmentTime",
            "doctor",
            "status",
          ],
        },
      ],
    });

    res.status(200).json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      clients,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id, {
      include: [
        {
          model: Appointment,
          as: "appointments",
          attributes: [
            "id",
            "appointmentDate",
            "appointmentTime",
            "doctor",
            "status",
          ],
        },
      ],
    });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { client_id: req.params.id },
      order: [
        ["appointmentDate", "DESC"],
        ["appointmentTime", "DESC"],
      ],
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add updateClient and deleteClient methods similarly
