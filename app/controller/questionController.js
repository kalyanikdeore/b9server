// controllers/questionController.js

const Question = require("../models/questionsModel");

// Create a new question
exports.createQuestion = async (req, res) => {
  try {
    // Ensure "Other" is always included
    const dropdown_options = [
      ...new Set([...req.body.dropdown_options, "Other"]),
    ];

    const question = await Question.create({
      ...req.body,
      dropdown_options,
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      order: [
        ["category", "ASC"],
        ["display_order", "ASC"],
      ],
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get active questions
exports.getActiveQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      where: { is_active: true },
      order: [
        ["category", "ASC"],
        ["display_order", "ASC"],
      ],
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a question
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { dropdown_options, ...updateData } = req.body;

    // Ensure "Other" is always included if updating options
    const updatedOptions = dropdown_options
      ? [...new Set([...dropdown_options, "Other"])]
      : undefined;

    const [updated] = await Question.update(
      {
        ...updateData,
        ...(updatedOptions && { dropdown_options: updatedOptions }),
      },
      { where: { id } }
    );

    if (updated) {
      const updatedQuestion = await Question.findByPk(id);
      res.json(updatedQuestion);
    } else {
      res.status(404).json({ message: "Question not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a question (soft delete by setting is_active to false)
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Question.update(
      { is_active: false },
      { where: { id } }
    );

    if (deleted) {
      res.json({ message: "Question deactivated successfully" });
    } else {
      res.status(404).json({ message: "Question not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
