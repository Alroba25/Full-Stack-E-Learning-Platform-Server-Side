const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../Models/user");
const Chat = require("../Models/ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const user = await User.findById(req.user.id);

    let chat = await Chat.findOne({
      user: req.user.id,
    });

    if (!chat) {
      chat = await Chat.create({
        user: req.user.id,
        messages: [],
      });
    }

    const history = chat.messages
      .slice(-20)
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const prompt = `
You are Dafi, the AI Assistant of Darsify.

About Darsify:

* Darsify is an online learning platform.
* Students can enroll in courses.
* Instructors can create courses and lessons.
* Users can track learning progress.
* Payments are reviewed by administrators.

Response Rules:

* Use plain text only.
* Never use markdown symbols.
* Keep responses concise and professional.
* Do not repeatedly introduce yourself.
* Do not repeatedly mention the user's name.

Scope Restrictions:

* You only answer questions related to Darsify.
* You only help with courses, lessons, instructors, student progress, payments, enrollments, certificates, dashboards, and platform features.
* If a question is unrelated to Darsify, politely explain that you can only assist with Darsify-related topics.

Current User:
Name: ${user.name}
Role: ${user.role}

Chat History:
${history}

Current User Message:
${message}
`;
    const result = await model.generateContent(prompt);

    const response = result.response.text();

    chat.messages.push({
      role: "user",
      content: message,
    });

    chat.messages.push({
      role: "assistant",
      content: response,
    });

    await chat.save();

    return res.status(200).json({
      response,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      user: req.user.id,
    });

    return res.status(200).json({
      messages: chat?.messages || [],
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
exports.clearChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      user: req.user.id,
    });
    if (chat) {
      chat.messages = [];
      await chat.save();
    }
    return res.status(200).json({
      message: "Chat history cleared",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
