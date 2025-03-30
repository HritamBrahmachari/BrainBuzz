require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Quiz = require('./models/quiz');

const app = express();
app.use(express.json());

// CORS configuration for both development and production
app.use(cors({
  origin: ['https://thebrainbuzz.netlify.app', 'http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// User schema and model
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model("brainbuzzsignup", UserSchema);

// Routes
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, name: user.name });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, name: user.name });
});

app.get('/invitecode', (req, res) => {
    const generateInviteCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }
        return code;

    }
    const inviteCode = generateInviteCode();
    res.json({ inviteCode });

});

app.post("/quiz", async (req, res) => {
    try {
        const { quizName, questions, categories, optionsCount, questionCount, difficulty, timePerQuestion } = req.body;

        // Validate required fields
        if (!quizName || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ 
                error: "Invalid request data",
                details: "quizName and questions array are required"
            });
        }

        // Validate each question
        for (const q of questions) {
            if (!q.question || !Array.isArray(q.options) || !q.correct_answer) {
                return res.status(400).json({
                    error: "Invalid question format",
                    details: "Each question must have question, options array, and correct_answer"
                });
            }
        }
        if (!quizName || !questions || !Array.isArray(questions) || !categories) {
            return res.status(400).json({ 
                error: "Invalid request data",
                details: "quizName, category, and questions array are required"
            });
        }

        if (categories === null || categories.length === 0) {
            return res.status(400).json({ 
                error: "Invalid request data",
                details: "Category is required"
            });
        }

        // Handle duplicate quiz names
        try {
            const existingQuiz = await Quiz.findOne({ quizName });
            if (existingQuiz) {
                // Append timestamp to make unique
                const timestamp = new Date().getTime();
                quizName = `${quizName}`;
            }
        } catch (err) {
            console.error("Error checking for existing quiz:", err);
        }

        // Create and save quiz
        const quiz = new Quiz({
            quizName,
            questions,
            categories,
            optionsCount,
            questionCount,
            difficulty,
            timePerQuestion
        });

        await quiz.save();

        res.status(201).json({ 
            message: "Quiz created successfully", 
            quiz: { quizName: quiz.quizName } 
        });
    } catch (error) {
        console.error("Error saving quiz:", error);
        res.status(500).json({ 
            error: "Server error while saving quiz",
            details: error.message 
        });
    }
});

app.get('/quiz', async (req, res) => {
    const quiz = await Quiz.find();
    res.json(quiz);
});

// Add a route to get a specific quiz by ID
app.get('/quiz/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }
        res.json(quiz);
    } catch (error) {
        console.error("Error fetching quiz by ID:", error);
        res.status(500).json({ error: "Server error while fetching quiz" });
    }
});

// Add a health check route
app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'BrainBuzz API is running' });
});

// Define port for the server
const PORT = process.env.PORT || 5000;

// Start the server only if not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app for serverless environments (Vercel)
module.exports = app;
