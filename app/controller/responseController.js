const Question = require("../models/questionsModel");
const User = require("../models/userModel");
const Response = require("../models/responseModel");

exports.submitResponses = async (req, res) => {
  try {
    const { userId, responses } = req.body;
    const { appointmentId } = req.params; // Get from URL instead of body

    // Validate user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate all questions exist
    const questionIds = responses.map((r) => r.questionId);
    const questions = await Question.findAll({
      where: { id: questionIds, is_active: true },
    });

    if (questions.length !== questionIds.length) {
      return res
        .status(400)
        .json({ message: "One or more questions not found or inactive" });
    }

    // First delete existing responses for this user and appointment
    await Response.destroy({
      where: {
        userId,
        appointment_id: appointmentId,
      },
    });

    // Create new responses
    const responseRecords = responses.map(
      ({ questionId, dropdown_answer, text_answer }) => ({
        questionId,
        userId,
        appointment_id: appointmentId,
        dropdown_answer,
        text_answer,
      })
    );

    await Response.bulkCreate(responseRecords);
    res.status(201).json({ message: "Responses saved successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Get responses by user, grouped by appointment
exports.getUserResponses = async (req, res) => {
  try {
    const { userId } = req.params;

    const responses = await Response.findAll({
      where: { userId },
      include: [
        { model: Question, as: "question" },
        { model: User, as: "user", attributes: ["id", "username", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Group responses by appointment_id
    const groupedResponses = responses.reduce((acc, response) => {
      const appointmentId = response.appointment_id;

      if (!acc[appointmentId]) {
        acc[appointmentId] = {
          appointment_id: appointmentId,
          user: response.user, // User info is the same for all responses
          createdAt: response.createdAt, // You might want to use the earliest/latest
          updatedAt: response.updatedAt, // You might want to use the earliest/latest
          responses: [],
        };
      }

      acc[appointmentId].responses.push({
        id: response.id,
        dropdown_answer: response.dropdown_answer,
        text_answer: response.text_answer,
        questionId: response.questionId,
        question: response.question,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      });

      return acc;
    }, {});

    // Convert the object to an array of grouped responses
    const result = Object.values(groupedResponses);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get responses by appointment
exports.getAppointmentResponses = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const responses = await Response.findAll({
      where: { appointment_id: appointmentId },
      include: [
        { model: Question, as: "question" },
        { model: User, as: "user", attributes: ["id", "username", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
