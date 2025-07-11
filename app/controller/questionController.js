const Question = require("../models/questionsModel");

module.exports = {
  // Create new question
  async createQuestion(req, res) {
    try {
      const {
        category,
        question_text,
        dropdown_options,
        display_order,
        is_active,
      } = req.body;

      const question = await Question.create({
        category,
        question_text,
        dropdown_options,
        display_order,
        is_active,
      });

      res.status(201).json({
        success: true,
        message: "Question created successfully",
        question,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Get all questions
  async getAllQuestions(req, res) {
    try {
      const questions = await Question.findAll({
        order: [["display_order", "ASC"]],
      });

      res.status(200).json({
        success: true,
        questions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Get active questions only
  async getActiveQuestions(req, res) {
    try {
      const questions = await Question.findAll({
        where: { is_active: true },
        order: [["display_order", "ASC"]],
      });

      res.status(200).json({
        success: true,
        questions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Update question
  async updateQuestion(req, res) {
    try {
      const question = await Question.findByPk(req.params.id);

      if (!question) {
        return res.status(404).json({
          success: false,
          message: "Question not found",
        });
      }

      await question.update(req.body);

      res.status(200).json({
        success: true,
        message: "Question updated successfully",
        question,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Delete question
  async deleteQuestion(req, res) {
    try {
      const question = await Question.findByPk(req.params.id);

      if (!question) {
        return res.status(404).json({
          success: false,
          message: "Question not found",
        });
      }

      await question.destroy();

      res.status(200).json({
        success: true,
        message: "Question deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
};
