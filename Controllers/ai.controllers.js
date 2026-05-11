const { GoogleGenerativeAI } = require("@google/generative-ai");

const User = require("../Models/user");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    const user = await User.findById(req.user.id);

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const prompt = `
You are Darsify AI Assistant.

About Darsify:
- Darsify is an E-learning platform.
- Students can enroll in courses.
- Instructors can create courses and lessons.
- Users can track learning progress.
- Platform contains AI support assistant.

Current User:
- Name: ${user.name}
- Role: ${user.role}

User Message:
${message}
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return res.status(200).json({
      response,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
