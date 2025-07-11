require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan"); // logger
const cors = require("cors"); // for connecting frontend and backend

// cross origin resource sharing
// db setup
const sequelize = require("./utils/db");

// Models setup

const User = require("./models/userModel");
const Token = require("./models/tokenModel");
const Appointment = require("./models/appointmentModel");
const Response = require("./models/responseModel");
const Question = require("./models/questionsModel");

const models = {
  User,
  Token,
  Appointment,
  Response,
  Question,
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// server defined
const app = express();

// CORS policy
const corsOptions = {
  origin: [
    // "http://192.168.0.241:5173",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "*",
  ],
  credentials: true,
  methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json()); // body parser
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get("/dev", (req, res) => {
  res.send("Website Template App");
});

// Routes -- routesn ka path file ka
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const questionRoutes = require("./routes/questionRoutes");
const responsesRoutes = require("./routes/responsesRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/appoint", appointmentRoutes);

app.use("/api/v1/question", questionRoutes);
app.use("/api/v1/responses", responsesRoutes);
app.use("/api/v1/user", userRoutes);

app.use("/api/v1/admin", adminRoutes);
sequelize
  .authenticate()
  .then(async () => {
    console.log(
      "Connection to the database has been established successfully."
    );

    // Sync models in a specific order
    await User.sync({ alter: true });
    await Question.sync({ alter: true });
    await Appointment.sync({ alter: true });
    await Response.sync({ alter: true });
    await Token.sync({ alter: true });

    console.log("Models have been synchronized with the database.");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is Running on Port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
