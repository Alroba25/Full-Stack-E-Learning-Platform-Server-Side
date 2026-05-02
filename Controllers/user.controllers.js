const { validateEmail, validatePassword } = require("../Validations/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/user");
exports.studentRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "The Password Must Contain At Least One Uppercase Letter, One Lowercase Letter, One Number, and One Special Character.",
      });
    }
    const handelPassword = await bcrypt.hash(password, 10);

    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({
      name,
      email,
      password: handelPassword,
      role: "student",
    });
    await newUser.save();
    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
        email: newUser.email,
        name: newUser.name,
      },
      "secretKey",
      {
        expiresIn: "1h",
      },
    );
    return res.status(201).json({
      message: "User registered successfully",
      user: { name, email, role: newUser.role },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.instructorRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "The Password Must Contain At Least One Uppercase Letter, One Lowercase Letter, One Number, and One Special Character.",
      });
    }
    const handelPassword = await bcrypt.hash(password, 10);

    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({
      name,
      email,
      password: handelPassword,
      role: "instructor",
    });
    await newUser.save();
    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
        email: newUser.email,
        name: newUser.name,
      },
      "secretKey",
      {
        expiresIn: "1h",
      },
    );
    return res.status(201).json({
      message: "instructor registered successfully",
      user: { name, email, role: newUser.role },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "The Password Must Contain At Least One Uppercase Letter, One Lowercase Letter, One Number, and One Special Character.",
      });
    }
    const isUserExists = await User.findOne({ email });
    if (!isUserExists) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const isMatch = await bcrypt.compare(password, isUserExists.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }
    const token = jwt.sign(
      {
        id: isUserExists._id,
        role: isUserExists.role,
        email: isUserExists.email,
        name: isUserExists.name,
      },
      "secretKey",
      {
        expiresIn: "1h",
      },
    );
    return res.status(200).json({
      message: "User Logged in successfully",
      user: { email, role: isUserExists.role, name: isUserExists.name },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
